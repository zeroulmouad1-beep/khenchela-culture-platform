'use client'

import { useEffect, useState } from 'react'
import { AdminGuard } from '@/lib/auth-context'
import { AdminShell } from '@/components/admin/admin-shell'
import { fetchCollection, addDocument, updateDocument, deleteDocument, formatTimestamp, FirestoreDoc } from '@/lib/firestore-helpers'
import { useToast } from '@/components/admin/toast'
import { ImageUpload } from '@/components/admin/image-upload'
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react'

const COPPER = '#B87333'
const COPPER_LIGHT = '#D4956A'
const INDIGO_DEEP = '#0F172A'
const INDIGO_MEDIUM = '#1E293B'
const INDIGO_LIGHT = '#334155'

interface NewsItem {
  title: string
  content: string
  date: string
  imageUrl: string
  published: boolean
  gallery: string[]
}

const emptyNews: NewsItem = { title: '', content: '', date: '', imageUrl: '', published: false, gallery: [] }

function NewsContent() {
  const { showToast } = useToast()
  const [items, setItems] = useState<FirestoreDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<NewsItem>(emptyNews)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchCollection('news')
      setItems(data)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        await updateDocument('news', editingId, form)
      } else {
        await addDocument('news', form)
      }
      setShowForm(false)
      setEditingId(null)
      setForm(emptyNews)
      await loadData()
      showToast(editingId ? 'تم تحديث الخبر بنجاح' : 'تمت إضافة الخبر بنجاح', 'success')
    } catch (err) {
      console.error(err)
      showToast('فشل حفظ الخبر', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (item: FirestoreDoc) => {
    setForm({
      title: item.title || '',
      content: item.content || '',
      date: item.date || '',
      imageUrl: item.imageUrl || '',
      published: item.published || false,
      gallery: item.gallery || [],
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument('news', id)
      setDeleteConfirm(null)
      await loadData()
      showToast('تم حذف الخبر بنجاح', 'success')
    } catch (err) {
      console.error(err)
      showToast('فشل حذف الخبر', 'error')
    }
  }

  const openNew = () => {
    setForm(emptyNews)
    setEditingId(null)
    setShowForm(true)
  }

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إدارة الأخبار
          </h2>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200"
            style={{ backgroundColor: COPPER, fontFamily: 'Tajawal, sans-serif' }}
          >
            <Plus size={16} />
            خبر جديد
          </button>
        </div>

        {showForm && (
          <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {editingId ? 'تعديل الخبر' : 'إضافة خبر جديد'}
              </h3>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyNews) }} style={{ color: '#94A3B8' }}>
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>العنوان *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={{ backgroundColor: INDIGO_DEEP, border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Tajawal, sans-serif' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>التاريخ</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={{ backgroundColor: INDIGO_DEEP, border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Tajawal, sans-serif' }}
                  dir="ltr"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>المحتوى</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none resize-none"
                style={{ backgroundColor: INDIGO_DEEP, border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Amiri, serif' }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <ImageUpload value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} storagePath="news" label="صورة الخبر" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#B87333]"
                  />
                  <span className="text-sm" style={{ color: '#CBD5E1' }}>منشور</span>
                </label>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>معرض الصور</label>
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
                onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyNews) }}
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
              لا توجد أخبار حالياً. اضغط على "خبر جديد" لإضافة خبر.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${INDIGO_LIGHT}` }}>
                    <th className="px-4 py-3 text-right font-medium" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>العنوان</th>
                    <th className="px-4 py-3 text-right font-medium hidden md:table-cell" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>التاريخ</th>
                    <th className="px-4 py-3 text-right font-medium" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>الحالة</th>
                    <th className="px-4 py-3 text-right font-medium" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${INDIGO_LIGHT}20` }}>
                      <td className="px-4 py-3 text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.title || '-'}</td>
                      <td className="px-4 py-3 hidden md:table-cell" style={{ color: '#94A3B8', fontFamily: 'Tajawal, sans-serif' }}>
                        {item.date || formatTimestamp(item.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: item.published ? 'rgba(34, 197, 94, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                            color: item.published ? '#22C55E' : '#94A3B8',
                            fontFamily: 'Tajawal, sans-serif',
                          }}
                        >
                          {item.published ? 'منشور' : 'مسودة'}
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  )
}

export default function AdminNewsPage() {
  return (
    <AdminGuard>
      <NewsContent />
    </AdminGuard>
  )
}
