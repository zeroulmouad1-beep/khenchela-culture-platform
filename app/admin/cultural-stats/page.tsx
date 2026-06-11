'use client'

import { useEffect, useState } from 'react'
import { AdminGuard } from '@/lib/auth-context'
import { AdminShell } from '@/components/admin/admin-shell'
import { fetchCollection, addDocument, updateDocument, FirestoreDoc } from '@/lib/firestore-helpers'
import { useToast, ToastProvider } from '@/components/admin/toast'
import { Save, Loader2, Plus, Trash2, BarChart2, Users, Building2, Star, TrendingUp, Calendar } from 'lucide-react'

const COPPER = '#c9952a'
const COPPER_LIGHT = '#e0b060'
const INDIGO_DEEP = '#1a0f0a'
const INDIGO_MEDIUM = '#1e1610'
const INDIGO_LIGHT = '#2a1e14'

const ARABIC_MONTHS = [
  'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان',
  'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
]

interface MonthRow { month: string; count: string }
interface TypeRow  { type: string;  count: string }

interface StatsForm {
  totalEvents: string
  totalAttendance: string
  localArtists: string
  culturalInstitutions: string
  featuredEventName: string
  featuredEventAttendance: string
  monthlyEvents: MonthRow[]
  attendanceGrowth: MonthRow[]
  eventTypes: TypeRow[]
}

const defaultMonthly = (): MonthRow[] =>
  ARABIC_MONTHS.map(month => ({ month, count: '0' }))

const defaultTypes = (): TypeRow[] => [
  { type: 'مهرجانات', count: '0' },
  { type: 'معارض',   count: '0' },
  { type: 'حفلات',   count: '0' },
  { type: 'ورشات عمل', count: '0' },
]

const emptyForm = (): StatsForm => ({
  totalEvents: '',
  totalAttendance: '',
  localArtists: '',
  culturalInstitutions: '',
  featuredEventName: '',
  featuredEventAttendance: '',
  monthlyEvents: defaultMonthly(),
  attendanceGrowth: defaultMonthly(),
  eventTypes: defaultTypes(),
})

function docToForm(doc: FirestoreDoc): StatsForm {
  const me: MonthRow[] = Array.isArray(doc.monthlyEvents) && doc.monthlyEvents.length === 12
    ? doc.monthlyEvents.map((r: any) => ({ month: r.month ?? '', count: String(r.count ?? 0) }))
    : defaultMonthly()

  const ag: MonthRow[] = Array.isArray(doc.attendanceGrowth) && doc.attendanceGrowth.length === 12
    ? doc.attendanceGrowth.map((r: any) => ({ month: r.month ?? '', count: String(r.count ?? 0) }))
    : defaultMonthly()

  const et: TypeRow[] = Array.isArray(doc.eventTypes) && doc.eventTypes.length > 0
    ? doc.eventTypes.map((r: any) => ({ type: r.type ?? '', count: String(r.count ?? 0) }))
    : defaultTypes()

  return {
    totalEvents:           String(doc.totalEvents           ?? ''),
    totalAttendance:       String(doc.totalAttendance       ?? ''),
    localArtists:          String(doc.localArtists          ?? ''),
    culturalInstitutions:  String(doc.culturalInstitutions  ?? ''),
    featuredEventName:     String(doc.featuredEventName     ?? ''),
    featuredEventAttendance: String(doc.featuredEventAttendance ?? ''),
    monthlyEvents: me,
    attendanceGrowth: ag,
    eventTypes: et,
  }
}

function formToPayload(f: StatsForm) {
  return {
    totalEvents:           parseInt(f.totalEvents)           || 0,
    totalAttendance:       parseInt(f.totalAttendance)       || 0,
    localArtists:          parseInt(f.localArtists)          || 0,
    culturalInstitutions:  parseInt(f.culturalInstitutions)  || 0,
    featuredEventName:     f.featuredEventName.trim(),
    featuredEventAttendance: parseInt(f.featuredEventAttendance) || 0,
    monthlyEvents:   f.monthlyEvents.map(r  => ({ month: r.month,  count: parseInt(r.count)  || 0 })),
    attendanceGrowth:f.attendanceGrowth.map(r => ({ month: r.month, count: parseInt(r.count) || 0 })),
    eventTypes:      f.eventTypes.filter(r => r.type.trim()).map(r => ({ type: r.type.trim(), count: parseInt(r.count) || 0 })),
  }
}

const TABS = [
  { id: 'totals',    label: 'الإجماليات',         icon: BarChart2 },
  { id: 'monthly',   label: 'البيانات الشهرية',    icon: Calendar  },
  { id: 'types',     label: 'أنواع الفعاليات',     icon: TrendingUp },
  { id: 'featured',  label: 'الفعالية الأبرز',     icon: Star      },
]

// ── helpers ──────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', fontSize: 13, color: '#a89070', marginBottom: 6, fontFamily: 'Tajawal, sans-serif' }}>
      {children}
    </label>
  )
}

function Input({ value, onChange, placeholder = '', type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '9px 12px', borderRadius: 8, fontSize: 14,
        backgroundColor: INDIGO_DEEP, border: `1px solid ${INDIGO_LIGHT}`,
        color: '#f0e6d3', outline: 'none', fontFamily: 'Tajawal, sans-serif',
        boxSizing: 'border-box',
      }}
      onFocus={e => (e.target.style.borderColor = COPPER)}
      onBlur={e  => (e.target.style.borderColor = INDIGO_LIGHT)}
    />
  )
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ backgroundColor: INDIGO_MEDIUM, border: `1px solid ${INDIGO_LIGHT}`, borderRadius: 12, padding: 24, ...style }}>
      {children}
    </div>
  )
}
// ─────────────────────────────────────────────────────────────

function CulturalStatsContent() {
  const { showToast } = useToast()
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [docId, setDocId]       = useState<string | null>(null)
  const [form, setForm]         = useState<StatsForm>(emptyForm())
  const [activeTab, setActiveTab] = useState('totals')

  useEffect(() => {
    async function load() {
      try {
        const docs = await fetchCollection('culturalStats')
        if (docs.length > 0) {
          setDocId(docs[0].id)
          setForm(docToForm(docs[0]))
        }
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const set = (key: keyof StatsForm, value: string) =>
    setForm(f => ({ ...f, [key]: value }))

  const setMonthly = (field: 'monthlyEvents' | 'attendanceGrowth', idx: number, value: string) =>
    setForm(f => {
      const arr = [...f[field]]
      arr[idx] = { ...arr[idx], count: value }
      return { ...f, [field]: arr }
    })

  const setType = (idx: number, key: 'type' | 'count', value: string) =>
    setForm(f => {
      const arr = [...f.eventTypes]
      arr[idx] = { ...arr[idx], [key]: value }
      return { ...f, eventTypes: arr }
    })

  const addType = () =>
    setForm(f => ({ ...f, eventTypes: [...f.eventTypes, { type: '', count: '0' }] }))

  const removeType = (idx: number) =>
    setForm(f => ({ ...f, eventTypes: f.eventTypes.filter((_, i) => i !== idx) }))

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    try {
      const payload = formToPayload(form)
      if (docId) {
        await updateDocument('culturalStats', docId, payload)
      } else {
        const res = await addDocument('culturalStats', payload)
        if (res?.id) setDocId(res.id)
      }
      showToast('تم حفظ الإحصائيات بنجاح', 'success')
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[cultural-stats save]', msg)
      showToast(`خطأ: ${msg}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <Loader2 size={32} className="animate-spin" style={{ color: COPPER }} />
      </div>
    )
  }

  return (
    <div dir="rtl" style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: `${COPPER}20`, border: `1px solid ${COPPER}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart2 size={22} style={{ color: COPPER }} />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#f0e6d3', fontFamily: 'Tajawal, sans-serif', margin: 0 }}>
              إدارة إحصائيات النشاطات الثقافية
            </h1>
            <p style={{ fontSize: 13, color: '#a89070', fontFamily: 'Tajawal, sans-serif', margin: '2px 0 0' }}>
              مصلحة النشاطات الثقافية — البيانات تُعرض على الصفحة العامة
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 22px', borderRadius: 10, fontSize: 14, fontWeight: 600,
            backgroundColor: COPPER, color: INDIGO_DEEP, border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1, fontFamily: 'Tajawal, sans-serif',
          }}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'جاري الحفظ…' : 'حفظ التغييرات'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, backgroundColor: INDIGO_MEDIUM, borderRadius: 12, padding: 4, border: `1px solid ${INDIGO_LIGHT}`, flexWrap: 'wrap' }}>
        {TABS.map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, minWidth: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                padding: '9px 14px', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: active ? `1px solid ${COPPER}40` : '1px solid transparent',
                backgroundColor: active ? `${COPPER}18` : 'transparent',
                color: active ? COPPER_LIGHT : '#7a6a5a',
                fontFamily: 'Tajawal, sans-serif', transition: 'all 0.15s',
              }}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ── Tab: Totals ── */}
      {activeTab === 'totals' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Calendar size={18} style={{ color: COPPER }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: '#f0e6d3', fontFamily: 'Tajawal, sans-serif' }}>إجمالي الفعاليات</span>
            </div>
            <Label>عدد الفعاليات المنظمة</Label>
            <Input value={form.totalEvents} onChange={v => set('totalEvents', v)} placeholder="0" type="number" />
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Users size={18} style={{ color: COPPER }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: '#f0e6d3', fontFamily: 'Tajawal, sans-serif' }}>إجمالي الحضور</span>
            </div>
            <Label>مجموع الحضور في كل الفعاليات</Label>
            <Input value={form.totalAttendance} onChange={v => set('totalAttendance', v)} placeholder="0" type="number" />
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Star size={18} style={{ color: COPPER }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: '#f0e6d3', fontFamily: 'Tajawal, sans-serif' }}>الفنانون المحليون</span>
            </div>
            <Label>عدد الفنانين المحليين المشاركين</Label>
            <Input value={form.localArtists} onChange={v => set('localArtists', v)} placeholder="0" type="number" />
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Building2 size={18} style={{ color: COPPER }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: '#f0e6d3', fontFamily: 'Tajawal, sans-serif' }}>المؤسسات الثقافية</span>
            </div>
            <Label>عدد المؤسسات الثقافية المشاركة</Label>
            <Input value={form.culturalInstitutions} onChange={v => set('culturalInstitutions', v)} placeholder="0" type="number" />
          </Card>
        </div>
      )}

      {/* ── Tab: Monthly ── */}
      {activeTab === 'monthly' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Calendar size={18} style={{ color: COPPER }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: '#f0e6d3', fontFamily: 'Tajawal, sans-serif' }}>عدد الفعاليات الشهري</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {form.monthlyEvents.map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 70, fontSize: 13, color: '#a89070', fontFamily: 'Tajawal, sans-serif', flexShrink: 0 }}>{row.month}</span>
                  <input
                    type="number"
                    value={row.count}
                    onChange={e => setMonthly('monthlyEvents', i, e.target.value)}
                    min="0"
                    style={{
                      flex: 1, padding: '7px 10px', borderRadius: 7, fontSize: 14,
                      backgroundColor: INDIGO_DEEP, border: `1px solid ${INDIGO_LIGHT}`,
                      color: '#f0e6d3', outline: 'none', fontFamily: 'Tajawal, sans-serif',
                    }}
                    onFocus={e => (e.target.style.borderColor = COPPER)}
                    onBlur={e  => (e.target.style.borderColor = INDIGO_LIGHT)}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <TrendingUp size={18} style={{ color: COPPER }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: '#f0e6d3', fontFamily: 'Tajawal, sans-serif' }}>الحضور الشهري</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {form.attendanceGrowth.map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 70, fontSize: 13, color: '#a89070', fontFamily: 'Tajawal, sans-serif', flexShrink: 0 }}>{row.month}</span>
                  <input
                    type="number"
                    value={row.count}
                    onChange={e => setMonthly('attendanceGrowth', i, e.target.value)}
                    min="0"
                    style={{
                      flex: 1, padding: '7px 10px', borderRadius: 7, fontSize: 14,
                      backgroundColor: INDIGO_DEEP, border: `1px solid ${INDIGO_LIGHT}`,
                      color: '#f0e6d3', outline: 'none', fontFamily: 'Tajawal, sans-serif',
                    }}
                    onFocus={e => (e.target.style.borderColor = COPPER)}
                    onBlur={e  => (e.target.style.borderColor = INDIGO_LIGHT)}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── Tab: Event Types ── */}
      {activeTab === 'types' && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <TrendingUp size={18} style={{ color: COPPER }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: '#f0e6d3', fontFamily: 'Tajawal, sans-serif' }}>توزيع أنواع الفعاليات</span>
            </div>
            <button
              onClick={addType}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
                borderRadius: 8, fontSize: 13, fontWeight: 600,
                backgroundColor: `${COPPER}20`, border: `1px solid ${COPPER}50`,
                color: COPPER_LIGHT, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif',
              }}
            >
              <Plus size={14} />
              إضافة نوع
            </button>
          </div>

          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 44px', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#7a6a5a', fontFamily: 'Tajawal, sans-serif' }}>نوع الفعالية</span>
            <span style={{ fontSize: 12, color: '#7a6a5a', fontFamily: 'Tajawal, sans-serif' }}>العدد</span>
            <span />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {form.eventTypes.map((row, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 160px 44px', gap: 10, alignItems: 'center' }}>
                <input
                  value={row.type}
                  onChange={e => setType(i, 'type', e.target.value)}
                  placeholder="مثال: مهرجانات"
                  style={{
                    padding: '9px 12px', borderRadius: 8, fontSize: 14,
                    backgroundColor: INDIGO_DEEP, border: `1px solid ${INDIGO_LIGHT}`,
                    color: '#f0e6d3', outline: 'none', fontFamily: 'Tajawal, sans-serif',
                  }}
                  onFocus={e => (e.target.style.borderColor = COPPER)}
                  onBlur={e  => (e.target.style.borderColor = INDIGO_LIGHT)}
                />
                <input
                  type="number"
                  value={row.count}
                  onChange={e => setType(i, 'count', e.target.value)}
                  min="0"
                  style={{
                    padding: '9px 12px', borderRadius: 8, fontSize: 14,
                    backgroundColor: INDIGO_DEEP, border: `1px solid ${INDIGO_LIGHT}`,
                    color: '#f0e6d3', outline: 'none', fontFamily: 'Tajawal, sans-serif',
                  }}
                  onFocus={e => (e.target.style.borderColor = COPPER)}
                  onBlur={e  => (e.target.style.borderColor = INDIGO_LIGHT)}
                />
                <button
                  onClick={() => removeType(i)}
                  disabled={form.eventTypes.length <= 1}
                  style={{
                    width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                    color: '#EF4444', cursor: form.eventTypes.length <= 1 ? 'not-allowed' : 'pointer',
                    opacity: form.eventTypes.length <= 1 ? 0.4 : 1,
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 16, fontSize: 12, color: '#7a6a5a', fontFamily: 'Tajawal, sans-serif' }}>
            ستظهر هذه البيانات في المخطط الدائري على الصفحة العامة
          </p>
        </Card>
      )}

      {/* ── Tab: Featured Event ── */}
      {activeTab === 'featured' && (
        <Card style={{ maxWidth: 520 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <Star size={18} style={{ color: COPPER }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: '#f0e6d3', fontFamily: 'Tajawal, sans-serif' }}>الفعالية الأكثر شعبية</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <Label>اسم الفعالية</Label>
              <Input value={form.featuredEventName} onChange={v => set('featuredEventName', v)} placeholder="اسم الفعالية الأبرز" />
            </div>
            <div>
              <Label>عدد الحضور</Label>
              <Input value={form.featuredEventAttendance} onChange={v => set('featuredEventAttendance', v)} placeholder="0" type="number" />
            </div>
          </div>
          <div style={{ marginTop: 20, padding: 14, borderRadius: 10, backgroundColor: `${COPPER}10`, border: `1px solid ${COPPER}30` }}>
            <p style={{ fontSize: 13, color: '#a89070', fontFamily: 'Tajawal, sans-serif', margin: 0 }}>
              ستظهر هذه الفعالية في كارد مميز على صفحة الإحصائيات العامة.
            </p>
          </div>
        </Card>
      )}

      {/* Bottom save */}
      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '11px 28px', borderRadius: 10, fontSize: 14, fontWeight: 600,
            backgroundColor: COPPER, color: INDIGO_DEEP, border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1, fontFamily: 'Tajawal, sans-serif',
          }}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'جاري الحفظ…' : 'حفظ التغييرات'}
        </button>
      </div>
    </div>
  )
}

export default function CulturalStatsPage() {
  return (
    <AdminGuard>
      <ToastProvider>
        <AdminShell>
          <CulturalStatsContent />
        </AdminShell>
      </ToastProvider>
    </AdminGuard>
  )
}
