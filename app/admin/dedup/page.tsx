'use client'

import { useState } from 'react'
import { AdminGuard } from '@/lib/auth-context'
import { AdminShell } from '@/components/admin/admin-shell'
import { fetchCollection, deleteDocument, FirestoreDoc } from '@/lib/firestore-helpers'
import { useToast } from '@/components/admin/toast'
import { Loader2, ShieldCheck, AlertTriangle, Trash2, RefreshCw } from 'lucide-react'

const COPPER = '#c9952a'
const COPPER_LIGHT = '#e0b060'
const INDIGO_DEEP = '#1a0f0a'
const INDIGO_MEDIUM = '#1e1610'
const INDIGO_LIGHT = '#2a1e14'

interface CollectionConfig {
  name: string
  label: string
  titleFields: string[]
}

const COLLECTIONS: CollectionConfig[] = [
  { name: 'institutions', label: 'المؤسسات', titleFields: ['title'] },
  { name: 'workshops', label: 'الورشات', titleFields: ['name'] },
  { name: 'khenchelaSections', label: 'ملف خنشلة', titleFields: ['title'] },
  { name: 'libraryAnnexes', label: 'ملحقات المكتبة', titleFields: ['name'] },
  { name: 'facilities', label: 'المرافق والخدمات', titleFields: ['name'] },
  { name: 'departments', label: 'الأقسام', titleFields: ['title'] },
  { name: 'artists', label: 'الفنانون', titleFields: ['name'] },
  { name: 'associations', label: 'الجمعيات', titleFields: ['name'] },
  { name: 'directorateStats', label: 'الإحصائيات', titleFields: ['activity'] },
  { name: 'nationalMonuments', label: 'المعالم الوطنية', titleFields: ['title'] },
  { name: 'inventoryMonuments', label: 'الجرد الإضافي', titleFields: ['title'] },
  { name: 'intangibleHeritage', label: 'التراث اللامادي', titleFields: ['alt'] },
  { name: 'events', label: 'الفعاليات', titleFields: ['title'] },
  { name: 'news', label: 'الأخبار', titleFields: ['title'] },
]

const SKIP_FIELDS = new Set(['id', 'createdAt', 'updatedAt', '_seedId'])

function normalize(v: unknown): string {
  return String(v ?? '').trim().toLowerCase().replace(/\s+/g, ' ')
}

function getTitleKey(doc: FirestoreDoc, fields: string[]): string {
  for (const f of fields) {
    const v = doc[f]
    if (typeof v === 'string' && v.trim()) return normalize(v)
  }
  return ''
}

function getTitle(doc: FirestoreDoc, fields: string[]): string {
  for (const f of fields) {
    const v = doc[f]
    if (typeof v === 'string' && v.trim()) return v
  }
  return '(بدون عنوان)'
}

function scoreDoc(doc: FirestoreDoc): number {
  let score = 0
  for (const [k, v] of Object.entries(doc)) {
    if (SKIP_FIELDS.has(k)) continue
    if (v == null) continue
    if (typeof v === 'string') {
      const t = v.trim()
      if (t) score += 2 + Math.min(t.length, 500) / 50
    } else if (Array.isArray(v)) {
      const filled = v.filter(x => x != null && String(x).trim()).length
      if (filled > 0) score += 3 + filled * 2
    } else if (typeof v === 'number') {
      if (v !== 0) score += 2
    } else if (typeof v === 'boolean') {
      if (v) score += 1
    } else if (typeof v === 'object') {
      score += 1
    }
  }
  if (doc._seedId) score += 0.5
  return score
}

interface DupGroup {
  titleKey: string
  displayTitle: string
  keeper: FirestoreDoc
  toDelete: FirestoreDoc[]
}

interface CollectionPlan {
  config: CollectionConfig
  totalDocs: number
  groups: DupGroup[]
  toDeleteCount: number
}

function DedupContent() {
  const { showToast } = useToast()
  const [scanning, setScanning] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [plans, setPlans] = useState<CollectionPlan[] | null>(null)
  const [confirmExec, setConfirmExec] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)

  const handleScan = async () => {
    if (scanning) return
    setScanning(true)
    setPlans(null)
    setConfirmExec(false)
    try {
      const results: CollectionPlan[] = []
      for (const cfg of COLLECTIONS) {
        let docs: FirestoreDoc[] = []
        try {
          docs = await fetchCollection(cfg.name, cfg.titleFields[0])
        } catch {
          docs = []
        }
        const buckets = new Map<string, FirestoreDoc[]>()
        for (const d of docs) {
          const k = getTitleKey(d, cfg.titleFields)
          if (!k) continue
          const arr = buckets.get(k) || []
          arr.push(d)
          buckets.set(k, arr)
        }
        const groups: DupGroup[] = []
        let toDeleteCount = 0
        for (const [titleKey, arr] of buckets.entries()) {
          if (arr.length < 2) continue
          const sorted = [...arr].sort((a, b) => scoreDoc(b) - scoreDoc(a))
          const keeper = sorted[0]
          const toDelete = sorted.slice(1)
          if (toDelete.length === 0) continue
          groups.push({
            titleKey,
            displayTitle: getTitle(keeper, cfg.titleFields),
            keeper,
            toDelete,
          })
          toDeleteCount += toDelete.length
        }
        results.push({ config: cfg, totalDocs: docs.length, groups, toDeleteCount })
      }
      setPlans(results)
      const totalDel = results.reduce((s, p) => s + p.toDeleteCount, 0)
      showToast(totalDel === 0 ? 'لم يتم العثور على أي تكرار' : `تم العثور على ${totalDel} نسخة مكررة`, totalDel === 0 ? 'success' : 'success')
    } catch (e) {
      console.error(e)
      showToast('فشل المسح', 'error')
    } finally {
      setScanning(false)
    }
  }

  const handleExecute = async () => {
    if (!plans || executing) return
    const all: { collection: string; id: string; keeperId: string }[] = []
    for (const p of plans) {
      for (const g of p.groups) {
        for (const d of g.toDelete) {
          if (d.id === g.keeper.id) continue
          all.push({ collection: p.config.name, id: d.id, keeperId: g.keeper.id })
        }
      }
    }
    if (all.length === 0) {
      showToast('لا شيء للحذف', 'success')
      return
    }
    setExecuting(true)
    setProgress({ done: 0, total: all.length })
    let success = 0
    let failed = 0
    for (let i = 0; i < all.length; i++) {
      const item = all[i]
      try {
        await deleteDocument(item.collection, item.id)
        success++
      } catch (e) {
        console.error('delete failed', item, e)
        failed++
      }
      setProgress({ done: i + 1, total: all.length })
    }
    setExecuting(false)
    setConfirmExec(false)
    showToast(`تم الحذف: ${success}${failed ? ` — فشل: ${failed}` : ''}`, failed ? 'error' : 'success')
    await handleScan()
  }

  const totalToDelete = plans?.reduce((s, p) => s + p.toDeleteCount, 0) || 0
  const totalGroups = plans?.reduce((s, p) => s + p.groups.length, 0) || 0

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto" dir="rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">تنظيف البيانات المكررة</h2>
            <p className="text-xs mt-1" style={{ color: '#a89070' }}>
              يفحص جميع المجموعات، ويحتفظ بالنسخة الأكثر اكتمالاً من كل سجل، ويحذف النسخ المكررة فقط.
            </p>
          </div>
          <button
            onClick={handleScan}
            disabled={scanning || executing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
            style={{ backgroundColor: COPPER }}
          >
            {scanning ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            {scanning ? 'جاري الفحص…' : 'فحص المجموعات'}
          </button>
        </div>

        <div className="rounded-xl border p-4 mb-6 flex items-start gap-3"
          style={{ backgroundColor: `${COPPER}10`, borderColor: `${COPPER}40` }}>
          <ShieldCheck size={20} style={{ color: COPPER_LIGHT }} className="flex-shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed" style={{ color: '#d4c4a8' }}>
            <strong style={{ color: COPPER_LIGHT }}>سياسة الأمان:</strong> لكل مجموعة سجلات لها نفس العنوان، يتم الاحتفاظ بالسجل الأعلى نقاطاً (المحتوى الأطول، الصور، الحقول المعبّأة). لا يتم حذف أي عنصر فريد. يجب الضغط على "فحص" أولاً، ثم مراجعة الخطة، ثم تأكيد التنفيذ.
          </div>
        </div>

        {plans && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <StatCard label="مجموعات مفحوصة" value={plans.length} />
              <StatCard label="إجمالي السجلات" value={plans.reduce((s, p) => s + p.totalDocs, 0)} />
              <StatCard label="مجموعات بها تكرار" value={totalGroups} />
              <StatCard label="نسخ سيتم حذفها" value={totalToDelete} highlight />
            </div>

            {totalToDelete > 0 && (
              <div className="rounded-xl border p-4 mb-6 flex items-center justify-between gap-4 flex-wrap"
                style={{ backgroundColor: 'rgba(220, 38, 38, 0.08)', borderColor: 'rgba(220, 38, 38, 0.4)' }}>
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} style={{ color: '#EF4444' }} className="flex-shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed" style={{ color: '#FCA5A5' }}>
                    سيتم حذف <strong>{totalToDelete}</strong> سجل مكرر نهائياً. الاحتفاظ بنسخة واحدة على الأقل من كل عنصر مضمون.
                    {progress && executing && (
                      <div className="mt-2" style={{ color: '#d4c4a8' }}>
                        التقدم: {progress.done} / {progress.total}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {confirmExec ? (
                    <>
                      <button
                        onClick={handleExecute}
                        disabled={executing}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-bold disabled:opacity-50"
                        style={{ backgroundColor: '#DC2626' }}
                      >
                        {executing ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        تأكيد نهائي للحذف
                      </button>
                      <button
                        onClick={() => setConfirmExec(false)}
                        disabled={executing}
                        className="px-3 py-2 rounded-lg text-sm"
                        style={{ color: '#a89070', border: `1px solid ${INDIGO_LIGHT}` }}
                      >
                        إلغاء
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmExec(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
                      style={{ backgroundColor: '#DC2626' }}
                    >
                      <Trash2 size={14} />
                      تنفيذ التنظيف
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {plans.map(plan => (
                <div key={plan.config.name} className="rounded-xl border overflow-hidden"
                  style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}>
                  <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${INDIGO_LIGHT}` }}>
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-bold text-sm">{plan.config.label}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${COPPER}20`, color: COPPER_LIGHT }}>
                        {plan.totalDocs} سجل
                      </span>
                    </div>
                    {plan.toDeleteCount > 0 ? (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#FCA5A5' }}>
                        {plan.groups.length} تكرار · حذف {plan.toDeleteCount}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22C55E' }}>
                        نظيف
                      </span>
                    )}
                  </div>
                  {plan.groups.length > 0 && (
                    <div className="divide-y" style={{ borderColor: `${INDIGO_LIGHT}40` }}>
                      {plan.groups.map(g => (
                        <div key={g.titleKey} className="px-4 py-3 text-xs">
                          <div className="text-white font-medium mb-2">{g.displayTitle}</div>
                          <div className="space-y-1">
                            <div style={{ color: '#22C55E' }}>
                              ✓ سيُحفظ: <code className="text-[10px]" style={{ color: '#a89070' }}>{g.keeper.id}</code>
                              <span className="mr-2" style={{ color: '#a89070' }}>(نقاط: {scoreDoc(g.keeper).toFixed(1)})</span>
                            </div>
                            {g.toDelete.map(d => (
                              <div key={d.id} style={{ color: '#FCA5A5' }}>
                                ✗ سيُحذف: <code className="text-[10px]" style={{ color: '#a89070' }}>{d.id}</code>
                                <span className="mr-2" style={{ color: '#a89070' }}>(نقاط: {scoreDoc(d).toFixed(1)})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {!plans && !scanning && (
          <div className="rounded-xl border p-8 text-center"
            style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT, color: '#a89070' }}>
            اضغط على "فحص المجموعات" لبدء مسح قاعدة البيانات بحثاً عن التكرارات.
          </div>
        )}
      </div>
    </AdminShell>
  )
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="rounded-xl border p-3"
      style={{ backgroundColor: INDIGO_MEDIUM, borderColor: highlight ? '#DC262660' : INDIGO_LIGHT }}>
      <div className="text-xs mb-1" style={{ color: '#a89070' }}>{label}</div>
      <div className="text-2xl font-bold" style={{ color: highlight ? '#FCA5A5' : 'white' }}>{value}</div>
    </div>
  )
}

export default function AdminDedupPage() {
  return (
    <AdminGuard>
      <DedupContent />
    </AdminGuard>
  )
}
