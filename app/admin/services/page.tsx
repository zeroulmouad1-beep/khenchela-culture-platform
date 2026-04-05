'use client'

import { useState } from 'react'
import { AdminGuard } from '@/lib/auth-context'
import { AdminShell } from '@/components/admin/admin-shell'
import { useCms, CultureHouseFacility } from '@/lib/cms-context'
import { useToast } from '@/components/admin/toast'
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react'

const COPPER = '#B87333'
const COPPER_LIGHT = '#D4956A'
const INDIGO_DEEP = '#0F172A'
const INDIGO_MEDIUM = '#1E293B'
const INDIGO_LIGHT = '#334155'

const ICON_OPTIONS = [
  'Theater', 'Paintbrush', 'BookText', 'Video', 'Music', 'Landmark',
  'GraduationCap', 'BookOpen', 'Users', 'Palette', 'Coffee', 'Home',
  'Mic', 'Camera', 'Pen', 'Globe', 'Star', 'Heart',
]

const emptyForm = { name: '', subtitle: '', iconName: 'Home' }

function ServicesContent() {
  const { facilities, addFacility, updateFacility, deleteFacility, loading } = useCms()
  const { showToast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<{ name: string; subtitle: string; iconName: string }>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      const data: Record<string, string> = { name: form.name, iconName: form.iconName }
      if (form.subtitle.trim()) data.subtitle = form.subtitle
      if (editingId) {
        await updateFacility(editingId, data)
        showToast('تم تحديث الخدمة بنجاح', 'success')
      } else {
        await addFacility(data)
        showToast('تمت إضافة الخدمة بنجاح', 'success')
      }
      setShowForm(false)
      setEditingId(null)
      setForm(emptyForm)
    } catch (err) {
      console.error(err)
      showToast('فشل حفظ الخدمة', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (item: CultureHouseFacility) => {
    setForm({
      name: item.name || '',
      subtitle: item.subtitle || '',
      iconName: item.iconName || 'Home',
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteFacility(id)
      setDeleteConfirm(null)
      showToast('تم حذف الخدمة بنجاح', 'success')
    } catch (err) {
      console.error(err)
      showToast('فشل حذف الخدمة', 'error')
    }
  }

  const openNew = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
  }

  const inputStyle = { backgroundColor: INDIGO_DEEP, border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Tajawal, sans-serif' }

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إدارة الخدمات
          </h2>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200"
            style={{ backgroundColor: COPPER, fontFamily: 'Tajawal, sans-serif' }}
          >
            <Plus size={16} />
            خدمة جديدة
          </button>
        </div>

        {showForm && (
          <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {editingId ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
              </h3>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm) }} style={{ color: '#94A3B8' }}>
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>اسم الخدمة *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>الأيقونة</label>
                <select
                  value={form.iconName}
                  onChange={(e) => setForm({ ...form, iconName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                  style={inputStyle}
                >
                  {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>اللقب الفرعي</label>
              <input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none"
                style={inputStyle}
                placeholder="(اختياري)"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm) }}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ color: '#94A3B8', border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Tajawal, sans-serif' }}
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim()}
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
          ) : facilities.length === 0 ? (
            <div className="p-8 text-center" style={{ color: '#64748B', fontFamily: 'Tajawal, sans-serif' }}>
              لا توجد خدمات حالياً. اضغط على "خدمة جديدة" لإضافة خدمة.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${INDIGO_LIGHT}` }}>
                    <th className="px-4 py-3 text-right font-medium" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>الخدمة</th>
                    <th className="px-4 py-3 text-right font-medium hidden md:table-cell" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>اللقب</th>
                    <th className="px-4 py-3 text-right font-medium" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>الأيقونة</th>
                    <th className="px-4 py-3 text-right font-medium" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {facilities.map((item) => (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${INDIGO_LIGHT}20` }}>
                      <td className="px-4 py-3 text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>{item.name || '-'}</td>
                      <td className="px-4 py-3 hidden md:table-cell" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>
                        {item.subtitle || '-'}
                      </td>
                      <td className="px-4 py-3" style={{ color: '#94A3B8', fontFamily: 'Tajawal, sans-serif' }}>
                        {item.iconName || '-'}
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

export default function AdminServicesPage() {
  return (
    <AdminGuard>
      <ServicesContent />
    </AdminGuard>
  )
}
