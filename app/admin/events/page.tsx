'use client'

import { useEffect, useState } from 'react'
import { AdminGuard } from '@/lib/auth-context'
import { AdminShell } from '@/components/admin/admin-shell'
import { fetchCollection, addDocument, updateDocument, deleteDocument, formatTimestamp, FirestoreDoc } from '@/lib/firestore-helpers'
import { useToast } from '@/components/admin/toast'
import { ImageUpload } from '@/components/admin/image-upload'
import { Plus, Pencil, Trash2, X, Save, Loader2, Star } from 'lucide-react'

const COPPER = '#B87333'
const COPPER_LIGHT = '#D4956A'
const INDIGO_DEEP = '#0F172A'
const INDIGO_MEDIUM = '#1E293B'
const INDIGO_LIGHT = '#334155'

const STATUS_OPTIONS = [
  { value: 'active', label: 'نشط' },
  { value: 'canceled', label: 'ملغي' },
  { value: 'finished', label: 'منتهي' },
]

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active: { bg: 'rgba(34, 197, 94, 0.15)', text: '#22C55E' },
  canceled: { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444' },
  finished: { bg: 'rgba(100, 116, 139, 0.15)', text: '#94A3B8' },
}

interface EventItem {
  title: string
  description: string
  date: string
  location: string
  capacity: string
  imageUrl: string
  gallery: string[]
  category: string
  status: string
  featured: boolean
}

const emptyEvent: EventItem = { title: '', description: '', date: '', location: '', capacity: '', imageUrl: '', gallery: [], category: '', status: 'active', featured: false }

function EventsContent() {
  const { showToast } = useToast()
  const [items, setItems] = useState<FirestoreDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<EventItem>(emptyEvent)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchCollection('events')
      setItems(data)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleSave = async () => {
    if (saving) return
    if (!form.title.trim()) return
    setSaving(true)
    try {
      const saveData = {
        ...form,
        capacity: form.capacity ? parseInt(form.capacity, 10) || 0 : 0,
      }
      if (editingId) {
        await updateDocument('events', editingId, saveData)
      } else {
        await addDocument('events', saveData)
      }
      setShowForm(false)
      setEditingId(null)
      setForm(emptyEvent)
      await loadData()
      showToast(editingId ? 'تم تحديث الفعالية بنجاح' : 'تمت إضافة الفعالية بنجاح', 'success')
    } catch (err) {
      console.error(err)
      showToast('فشل حفظ الفعالية', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (item: FirestoreDoc) => {
    setForm({
      title: item.title || '',
      description: item.description || '',
      date: item.date || '',
      location: item.location || '',
      capacity: item.capacity ? String(item.capacity) : '',
      imageUrl: item.imageUrl || item.image || '',
      gallery: item.gallery || [],
      category: item.category || '',
      status: item.status || 'active',
      featured: item.featured || false,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument('events', id)
      setDeleteConfirm(null)
      await loadData()
      showToast('تم حذف الفعالية بنجاح', 'success')
    } catch (err) {
      console.error(err)
      showToast('فشل حذف الفعالية', 'error')
    }
  }

  const openNew = () => {
    setForm(emptyEvent)
    setEditingId(null)
    setShowForm(true)
  }

  const inputStyle = { backgroundColor: INDIGO_DEEP, border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Tajawal, sans-serif' }
  const labelStyle = { color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إدارة الفعاليات
          </h2>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200"
            style={{ backgroundColor: COPPER, fontFamily: 'Tajawal, sans-serif' }}
          >
            <Plus size={16} />
            فعالية جديدة
          </button>
        </div>

        {showForm && (
          <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {editingId ? 'تعديل الفعالية' : 'إضافة فعالية جديدة'}
              </h3>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyEvent) }} style={{ color: '#94A3B8' }}>
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>عنوان الفعالية *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>التاريخ</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={inputStyle}
                  dir="ltr"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" style={labelStyle}>الوصف</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none resize-none"
                style={{ backgroundColor: INDIGO_DEEP, border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Amiri, serif' }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>المكان</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>السعة</label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={inputStyle}
                  dir="ltr"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>التصنيف</label>
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={inputStyle}
                  placeholder="مهرجان، معرض، حفل..."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>الحالة</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={inputStyle}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#B87333]"
                  />
                  <Star size={14} style={{ color: form.featured ? '#F59E0B' : '#64748B' }} />
                  <span className="text-sm" style={{ color: '#CBD5E1' }}>مميزة</span>
                </label>
              </div>
              <div>
                <ImageUpload value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} storagePath="events" label="صورة الفعالية" />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium" style={labelStyle}>معرض الصور</label>
                <button type="button" onClick={() => setForm({ ...form, gallery: [...form.gallery, ''] })}
                  className="text-xs px-2 py-1 rounded" style={{ color: COPPER_LIGHT, border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Tajawal, sans-serif' }}>+ صورة</button>
              </div>
              {form.gallery.map((url, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input value={url} onChange={(e) => { const g = [...form.gallery]; g[i] = e.target.value; setForm({ ...form, gallery: g }) }}
                    className="flex-1 px-3 py-2 rounded-lg text-white text-sm outline-none"
                    style={{ backgroundColor: INDIGO_DEEP, border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Tajawal, sans-serif' }}
                    dir="ltr" placeholder="https://..." />
                  <button type="button" onClick={() => setForm({ ...form, gallery: form.gallery.filter((_, j) => j !== i) })}
                    className="p-1" style={{ color: '#EF4444' }}><X size={14} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyEvent) }}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ color: '#94A3B8', border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Tajawal, sans-serif' }}
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: COPPER, fontFamily: 'Tajawal, sans-serif' }}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {editingId ? 'تحديث' : 'حفظ'}
              </button>
            </div>
          </div>
        )}

        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}>
          {loading ? (
            <div className="p-8 flex justify-center">
              <Loader2 size={24} className="animate-spin" style={{ color: COPPER }} />
            </div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center" style={{ color: '#64748B', fontFamily: 'Tajawal, sans-serif' }}>
              لا توجد فعاليات حالياً. اضغط على "فعالية جديدة" لإضافة فعالية.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${INDIGO_LIGHT}` }}>
                    <th className="px-4 py-3 text-right font-medium" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>الفعالية</th>
                    <th className="px-4 py-3 text-right font-medium hidden md:table-cell" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>التاريخ</th>
                    <th className="px-4 py-3 text-right font-medium hidden md:table-cell" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>المكان</th>
                    <th className="px-4 py-3 text-right font-medium hidden lg:table-cell" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>الحالة</th>
                    <th className="px-4 py-3 text-right font-medium" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const statusInfo = STATUS_COLORS[item.status] || STATUS_COLORS.active
                    return (
                      <tr key={item.id} style={{ borderBottom: `1px solid ${INDIGO_LIGHT}20` }}>
                        <td className="px-4 py-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                          <div className="flex items-center gap-2">
                            {item.featured && <Star size={12} style={{ color: '#F59E0B' }} />}
                            <span className="text-white">{item.title || '-'}</span>
                          </div>
                          {item.category && <span className="text-xs" style={{ color: '#64748B' }}>{item.category}</span>}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell" style={{ color: '#94A3B8', fontFamily: 'Tajawal, sans-serif' }}>
                          {item.date || formatTimestamp(item.createdAt)}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell" style={{ color: '#94A3B8', fontFamily: 'Tajawal, sans-serif' }}>
                          {item.location || '-'}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: statusInfo.bg, color: statusInfo.text, fontFamily: 'Tajawal, sans-serif' }}
                          >
                            {STATUS_OPTIONS.find(o => o.value === item.status)?.label || 'نشط'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleEdit(item)} className="p-1.5 rounded-md transition-colors" style={{ color: COPPER_LIGHT }} title="تعديل">
                              <Pencil size={14} />
                            </button>
                            {deleteConfirm === item.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleDelete(item.id)} className="px-2 py-0.5 rounded text-xs text-white" style={{ backgroundColor: '#DC2626', fontFamily: 'Tajawal, sans-serif' }}>
                                  تأكيد
                                </button>
                                <button onClick={() => setDeleteConfirm(null)} className="px-2 py-0.5 rounded text-xs" style={{ color: '#94A3B8', fontFamily: 'Tajawal, sans-serif' }}>
                                  إلغاء
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 rounded-md transition-colors" style={{ color: '#94A3B8' }} title="حذف">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  )
}

export default function AdminEventsPage() {
  return (
    <AdminGuard>
      <EventsContent />
    </AdminGuard>
  )
}
