'use client'

import { useState, useEffect } from 'react'
import { AdminShell } from '@/components/admin/admin-shell'
import { useCms, Department } from '@/lib/cms-context'
import { fetchCollection, addDocument, updateDocument, deleteDocument, isMockMode, FirestoreDoc } from '@/lib/firestore-helpers'
import {
  Palette, Users, Landmark, Save, Plus, Trash2, Edit3, X, Check,
  BarChart3, BookOpen, MapPin, ImageIcon, Hash
} from 'lucide-react'
import type { Artist } from '@/lib/artists-data'
import type { Association, Statistic } from '@/lib/activities-data'
import type { NationalMonument, InventoryMonument, IntangibleHeritageItem } from '@/lib/heritage-data'

const COPPER = '#c9952a'
const COPPER_LIGHT = '#e0b060'
const INDIGO_DEEP = '#1a0f0a'
const INDIGO_MEDIUM = '#1e1610'
const INDIGO_LIGHT = '#2a1e14'

type Tab = 'departments' | 'artists' | 'associations' | 'statistics' | 'nationalMonuments' | 'inventoryMonuments' | 'intangibleHeritage'

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'departments', label: 'الأقسام', icon: Landmark },
  { id: 'artists', label: 'الفنانون', icon: Palette },
  { id: 'associations', label: 'الجمعيات', icon: Users },
  { id: 'statistics', label: 'الإحصائيات', icon: BarChart3 },
  { id: 'nationalMonuments', label: 'المعالم الوطنية', icon: MapPin },
  { id: 'inventoryMonuments', label: 'الجرد الإضافي', icon: Hash },
  { id: 'intangibleHeritage', label: 'التراث اللامادي', icon: ImageIcon },
]

function inputStyle() {
  return {
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: `1px solid ${INDIGO_LIGHT}`,
    color: 'white',
    fontFamily: 'Tajawal, sans-serif',
  }
}

function DepartmentsTab() {
  const { departments, updateDepartment } = useCms()
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Department>>({})
  const [saving, setSaving] = useState(false)

  const startEdit = (dept: Department) => {
    setEditing(dept.id)
    setForm({ ...dept })
  }

  const save = async () => {
    if (saving) return
    if (!editing || !form.title) return
    setSaving(true)
    try {
      await updateDepartment(editing, form)
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {departments.map((dept) => (
        <div key={dept.id} className="rounded-xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${INDIGO_LIGHT}` }}>
          {editing === dept.id ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle()} placeholder="العنوان" value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                <input className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle()} placeholder="الوصف" value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                <input className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle()} placeholder="رابط الصورة" value={form.image || ''} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
                <input className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle()} placeholder="الرابط (href)" value={form.href || ''} onChange={e => setForm(f => ({ ...f, href: e.target.value }))} />
                <select className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle()} value={form.iconName || 'Palette'} onChange={e => setForm(f => ({ ...f, iconName: e.target.value }))}>
                  <option value="Palette">Palette - فنون</option>
                  <option value="Users">Users - نشاطات</option>
                  <option value="Landmark">Landmark - تراث</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setEditing(null)} className="px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"><X size={16} /></button>
                <button onClick={save} disabled={saving} className="px-4 py-1.5 rounded-lg text-sm text-white flex items-center gap-2" style={{ backgroundColor: COPPER }}>
                  <Save size={14} /> {saving ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-sm">{dept.title}</h3>
                <p className="text-gray-400 text-xs mt-1">{dept.description}</p>
              </div>
              <button onClick={() => startEdit(dept)} className="p-2 rounded-lg hover:bg-[#2a1f1a] transition-colors text-gray-400 hover:text-white">
                <Edit3 size={16} />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function CrudTable<T extends { id: number | string }>({
  collectionName,
  columns,
  emptyItem,
  items,
  setItems,
}: {
  collectionName: string
  columns: { key: keyof T; label: string; type?: 'text' | 'number' | 'select'; options?: string[] }[]
  emptyItem: Omit<T, 'id'>
  items: T[]
  setItems: (items: T[]) => void
}) {
  const [editing, setEditing] = useState<string | number | null>(null)
  const [form, setForm] = useState<Record<string, unknown>>({})
  const [adding, setAdding] = useState(false)
  const [addForm, setAddForm] = useState<Record<string, unknown>>({ ...emptyItem })
  const [saving, setSaving] = useState(false)
  const [docIdMap] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    async function loadDocIds() {
      if (isMockMode) return
      try {
        const docs = await fetchCollection(collectionName, 'createdAt')
        docs.forEach(doc => {
          const displayId = doc._seedId ?? doc.id
          docIdMap.set(String(displayId), doc.id)
        })
      } catch {}
    }
    loadDocIds()
  }, [collectionName, docIdMap])

  const getFirestoreId = (displayId: string | number) => {
    return docIdMap.get(String(displayId)) || String(displayId)
  }

  const startEdit = (item: T) => {
    setEditing(item.id)
    setForm({ ...item })
  }

  const saveEdit = async () => {
    if (saving) return
    if (editing == null) return
    setSaving(true)
    try {
      const { id, ...data } = form
      if (!isMockMode) {
        const fsId = getFirestoreId(editing)
        await updateDocument(collectionName, fsId, data)
      }
      setItems(items.map(item => item.id === editing ? { ...item, ...data } as T : item))
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  const addItem = async () => {
    if (saving) return
    setSaving(true)
    try {
      if (!isMockMode) {
        const docRef = await addDocument(collectionName, addForm)
        const newId = docRef && typeof docRef === 'object' && 'id' in docRef ? (docRef as { id: string }).id : `new-${Date.now()}`
        const newItem = { ...addForm, id: newId } as T
        docIdMap.set(String(newId), newId)
        setItems([...items, newItem])
      } else {
        const newId = Date.now()
        setItems([...items, { ...addForm, id: newId } as T])
      }
      setAdding(false)
      setAddForm({ ...emptyItem })
    } finally {
      setSaving(false)
    }
  }

  const deleteItem = async (id: string | number) => {
    try {
      if (!isMockMode) {
        const fsId = getFirestoreId(id)
        await deleteDocument(collectionName, fsId)
      }
      setItems(items.filter(item => item.id !== id))
    } catch (e) {
      console.error('Failed to delete:', e)
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white" style={{ backgroundColor: COPPER }}>
          <Plus size={14} /> إضافة جديد
        </button>
      </div>

      {adding && (
        <div className="rounded-xl p-4 mb-4 space-y-3" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${COPPER}40` }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {columns.map(col => (
              <div key={String(col.key)}>
                <label className="text-xs text-gray-400 mb-1 block">{col.label}</label>
                {col.type === 'select' ? (
                  <select className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle()} value={String(addForm[String(col.key)] || '')} onChange={e => setAddForm(f => ({ ...f, [String(col.key)]: col.type === 'number' ? Number(e.target.value) : e.target.value }))}>
                    {col.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input className="w-full px-3 py-2 rounded-lg text-sm" style={inputStyle()} type={col.type || 'text'} value={String(addForm[String(col.key)] || '')} onChange={e => setAddForm(f => ({ ...f, [String(col.key)]: col.type === 'number' ? Number(e.target.value) : e.target.value }))} />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setAdding(false); setAddForm({ ...emptyItem }) }} className="px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white"><X size={16} /></button>
            <button onClick={addItem} disabled={saving} className="px-4 py-1.5 rounded-lg text-sm text-white flex items-center gap-2" style={{ backgroundColor: COPPER }}>
              <Check size={14} /> {saving ? 'جاري الإضافة...' : 'إضافة'}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${INDIGO_LIGHT}` }}>
        <table className="w-full text-right" dir="rtl">
          <thead>
            <tr style={{ backgroundColor: `${COPPER}12`, borderBottom: `1px solid ${COPPER}25` }}>
              <th className="px-4 py-3 text-xs font-semibold" style={{ color: COPPER }}>#</th>
              {columns.map(col => (
                <th key={String(col.key)} className="px-4 py-3 text-xs font-semibold" style={{ color: COPPER }}>{col.label}</th>
              ))}
              <th className="px-4 py-3 text-xs font-semibold" style={{ color: COPPER }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={String(item.id)} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                {editing === item.id ? (
                  <>
                    <td className="px-4 py-3 text-xs text-gray-400">{idx + 1}</td>
                    {columns.map(col => (
                      <td key={String(col.key)} className="px-4 py-2">
                        {col.type === 'select' ? (
                          <select className="w-full px-2 py-1.5 rounded text-xs" style={inputStyle()} value={String(form[String(col.key)] || '')} onChange={e => setForm(f => ({ ...f, [String(col.key)]: col.type === 'number' ? Number(e.target.value) : e.target.value }))}>
                            {col.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        ) : (
                          <input className="w-full px-2 py-1.5 rounded text-xs" style={inputStyle()} type={col.type || 'text'} value={String(form[String(col.key)] || '')} onChange={e => setForm(f => ({ ...f, [String(col.key)]: col.type === 'number' ? Number(e.target.value) : e.target.value }))} />
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-2">
                      <div className="flex gap-1">
                        <button onClick={saveEdit} disabled={saving} className="p-1.5 rounded text-green-400 hover:bg-[#0d2310]"><Check size={14} /></button>
                        <button onClick={() => setEditing(null)} className="p-1.5 rounded text-gray-400 hover:bg-[#2a1f1a]"><X size={14} /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-xs text-gray-400">{idx + 1}</td>
                    {columns.map(col => (
                      <td key={String(col.key)} className="px-4 py-3 text-xs text-gray-300">{String((item as Record<string, unknown>)[String(col.key)] || '')}</td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(item)} className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-[#2a1f1a]"><Edit3 size={14} /></button>
                        <button onClick={() => deleteItem(item.id)} className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-[#2d0d0d]"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function DirectorateAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('departments')
  const [loading, setLoading] = useState(true)

  const [artists, setArtists] = useState<Artist[]>([])
  const [associations, setAssociations] = useState<Association[]>([])
  const [statistics, setStatistics] = useState<Statistic[]>([])
  const [nationalMonuments, setNationalMonuments] = useState<NationalMonument[]>([])
  const [inventoryMonuments, setInventoryMonuments] = useState<InventoryMonument[]>([])
  const [intangibleHeritage, setIntangibleHeritage] = useState<IntangibleHeritageItem[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const [ar, as2, st, nm, im, ih] = await Promise.all([
          fetchCollection('artists', 'name'),
          fetchCollection('associations', 'name'),
          fetchCollection('directorateStats', 'activity'),
          fetchCollection('nationalMonuments', 'title'),
          fetchCollection('inventoryMonuments', 'title'),
          fetchCollection('intangibleHeritage', 'alt'),
        ])
        if (ar.length > 0) setArtists(ar.map(d => ({ id: d._seedId ?? d.id, name: d.name || '', specialty: d.specialty || '', municipality: d.municipality || '', status: d.status || 'نشط', cardId: d.cardId || '', nationalId: d.nationalId || '' })))
        if (as2.length > 0) setAssociations(as2.map(d => ({ id: d._seedId ?? d.id, name: d.name || '', type: d.type || '', president: d.president || '', foundationDate: d.foundationDate || '' })))
        if (st.length > 0) setStatistics(st.map(d => ({ id: d._seedId ?? d.id, activity: d.activity || '', value: d.value ?? 0, target: d.target ?? 0, progress: d.progress ?? 0, period: d.period || '' })))
        if (nm.length > 0) setNationalMonuments(nm.map(d => ({ id: d._seedId ?? d.id, title: d.title || '', image: d.image || '', description: d.description || '', classificationDate: d.classificationDate || '' })))
        if (im.length > 0) setInventoryMonuments(im.map(d => ({ id: d._seedId ?? d.id, title: d.title || '', image: d.image || '', description: d.description || '', inventoryNumber: d.inventoryNumber || '' })))
        if (ih.length > 0) setIntangibleHeritage(ih.map(d => ({ id: d._seedId ?? d.id, image: d.image || '', alt: d.alt || '' })))
      } catch (e) {
        console.error('Failed to load directorate data:', e)
        const { artistsData } = await import('@/lib/artists-data')
        const { associationsData, statisticsData } = await import('@/lib/activities-data')
        const { nationalMonumentsData, inventoryMonumentsData, intangibleHeritageData } = await import('@/lib/heritage-data')
        setArtists(artistsData)
        setAssociations(associationsData)
        setStatistics(statisticsData)
        setNationalMonuments(nationalMonumentsData)
        setInventoryMonuments(inventoryMonumentsData)
        setIntangibleHeritage(intangibleHeritageData)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <AdminShell>
      <div dir="rtl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">مصالح المديرية</h1>
          <p className="text-sm text-gray-400">إدارة بيانات أقسام مديرية الثقافة والفنون</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor: active ? `${COPPER}20` : 'rgba(255,255,255,0.04)',
                  color: active ? COPPER_LIGHT : '#a89070',
                  border: `1px solid ${active ? COPPER + '40' : INDIGO_LIGHT}`,
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {loading && activeTab !== 'departments' ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${COPPER}40`, borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <>
            {activeTab === 'departments' && <DepartmentsTab />}

            {activeTab === 'artists' && (
              <CrudTable<Artist>
                collectionName="artists"
                columns={[
                  { key: 'name', label: 'الاسم الكامل' },
                  { key: 'cardId', label: 'رقم البطاقة' },
                  { key: 'nationalId', label: 'رقم التعريف الوطني' },
                  { key: 'specialty', label: 'التخصص' },
                  { key: 'municipality', label: 'البلدية' },
                  { key: 'status', label: 'الحالة', type: 'select', options: ['نشط', 'معلق', 'غير نشط'] },
                ]}
                emptyItem={{ name: '', specialty: '', municipality: '', status: 'نشط' as const, cardId: '', nationalId: '' }}
                items={artists}
                setItems={setArtists}
              />
            )}

            {activeTab === 'associations' && (
              <CrudTable<Association>
                collectionName="associations"
                columns={[
                  { key: 'name', label: 'اسم الجمعية' },
                  { key: 'type', label: 'النوع' },
                  { key: 'president', label: 'الرئيس' },
                  { key: 'foundationDate', label: 'تاريخ التأسيس' },
                ]}
                emptyItem={{ name: '', type: '', president: '', foundationDate: '' }}
                items={associations}
                setItems={setAssociations}
              />
            )}

            {activeTab === 'statistics' && (
              <CrudTable<Statistic>
                collectionName="directorateStats"
                columns={[
                  { key: 'activity', label: 'النشاط' },
                  { key: 'value', label: 'القيمة', type: 'number' },
                  { key: 'target', label: 'الهدف', type: 'number' },
                  { key: 'progress', label: 'التقدم %', type: 'number' },
                  { key: 'period', label: 'الفترة' },
                ]}
                emptyItem={{ activity: '', value: 0, target: 0, progress: 0, period: '' }}
                items={statistics}
                setItems={setStatistics}
              />
            )}

            {activeTab === 'nationalMonuments' && (
              <CrudTable<NationalMonument>
                collectionName="nationalMonuments"
                columns={[
                  { key: 'title', label: 'الاسم' },
                  { key: 'image', label: 'الصورة' },
                  { key: 'description', label: 'الوصف' },
                  { key: 'classificationDate', label: 'تاريخ التصنيف' },
                ]}
                emptyItem={{ title: '', image: '', description: '', classificationDate: '' }}
                items={nationalMonuments}
                setItems={setNationalMonuments}
              />
            )}

            {activeTab === 'inventoryMonuments' && (
              <CrudTable<InventoryMonument>
                collectionName="inventoryMonuments"
                columns={[
                  { key: 'title', label: 'الاسم' },
                  { key: 'image', label: 'الصورة' },
                  { key: 'description', label: 'الوصف' },
                  { key: 'inventoryNumber', label: 'رقم الجرد' },
                ]}
                emptyItem={{ title: '', image: '', description: '', inventoryNumber: '' }}
                items={inventoryMonuments}
                setItems={setInventoryMonuments}
              />
            )}

            {activeTab === 'intangibleHeritage' && (
              <CrudTable<IntangibleHeritageItem>
                collectionName="intangibleHeritage"
                columns={[
                  { key: 'image', label: 'رابط الصورة' },
                  { key: 'alt', label: 'وصف الصورة' },
                ]}
                emptyItem={{ image: '', alt: '' }}
                items={intangibleHeritage}
                setItems={setIntangibleHeritage}
              />
            )}
          </>
        )}
      </div>
    </AdminShell>
  )
}
