'use client'

import { useState } from 'react'
import { AdminGuard } from '@/lib/auth-context'
import { AdminShell } from '@/components/admin/admin-shell'
import { useCms, LibraryAnnex } from '@/lib/cms-context'
import { useToast } from '@/components/admin/toast'
import { Plus, Pencil, Trash2, X, Save, BookMarked, Loader2 } from 'lucide-react'

const COPPER = '#c9952a'
const COPPER_LIGHT = '#e0b060'
const INDIGO_DEEP = '#1a0f0a'
const INDIGO_MEDIUM = '#1e1610'
const INDIGO_LIGHT = '#2a1e14'

const emptyAnnex = { name: '', type: 'شبه حضارية' as const }

function LibraryAnnexesContent() {
  const { libraryAnnexes, addAnnex, updateAnnex, deleteAnnex } = useCms()
  const { showToast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<{ name: string; type: 'شبه حضارية' | 'ريفية' }>(emptyAnnex)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (saving) return
    if (!form.name.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        await updateAnnex(editingId, form)
        showToast('تم تحديث الملحقة بنجاح', 'success')
      } else {
        await addAnnex(form)
        showToast('تمت إضافة الملحقة بنجاح', 'success')
      }
      setShowForm(false)
      setEditingId(null)
      setForm(emptyAnnex)
    } catch {
      showToast('حدث خطأ أثناء الحفظ', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (annex: LibraryAnnex) => {
    setForm({ name: annex.name, type: annex.type })
    setEditingId(annex.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAnnex(id)
      showToast('تم حذف الملحقة', 'success')
    } catch {
      showToast('فشل حذف الملحقة', 'error')
    }
    setDeleteConfirm(null)
  }

  const openNew = () => {
    setForm(emptyAnnex)
    setEditingId(null)
    setShowForm(true)
  }

  const inputStyle = { backgroundColor: INDIGO_DEEP, border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Tajawal, sans-serif' }

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إدارة ملحقات المكتبة
          </h2>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: COPPER, fontFamily: 'Tajawal, sans-serif' }}>
            <Plus size={16} />ملحقة جديدة
          </button>
        </div>

        {showForm && (
          <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {editingId ? 'تعديل الملحقة' : 'إضافة ملحقة جديدة'}
              </h3>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyAnnex) }} style={{ color: '#a89070' }}><X size={20} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>اسم الملحقة *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none" style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>النوع *</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'شبه حضارية' | 'ريفية' })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none" style={inputStyle}>
                  <option value="شبه حضارية">شبه حضارية</option>
                  <option value="ريفية">ريفية</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyAnnex) }}
                className="px-4 py-2 rounded-lg text-sm font-medium" style={{ color: '#a89070', border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Tajawal, sans-serif' }}>إلغاء</button>
              <button onClick={handleSave} disabled={!form.name.trim() || saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: COPPER, fontFamily: 'Tajawal, sans-serif' }}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{editingId ? 'تحديث' : 'حفظ'}
              </button>
            </div>
          </div>
        )}

        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${INDIGO_LIGHT}` }}>
                  <th className="px-4 py-3 text-right font-medium" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>الملحقة</th>
                  <th className="px-4 py-3 text-right font-medium" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>النوع</th>
                  <th className="px-4 py-3 text-right font-medium" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {libraryAnnexes.map((annex) => (
                  <tr key={annex.id} style={{ borderBottom: `1px solid ${INDIGO_LIGHT}20` }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <BookMarked size={14} style={{ color: COPPER }} />
                        <span className="text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>{annex.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: annex.type === 'ريفية' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(201, 149, 42, 0.15)',
                          color: annex.type === 'ريفية' ? '#22C55E' : COPPER_LIGHT,
                          fontFamily: 'Tajawal, sans-serif',
                        }}>
                        {annex.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(annex)} className="p-1.5 rounded-md" style={{ color: COPPER_LIGHT }} title="تعديل">
                          <Pencil size={14} />
                        </button>
                        {deleteConfirm === annex.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(annex.id)} className="px-2 py-0.5 rounded text-xs text-white" style={{ backgroundColor: '#DC2626', fontFamily: 'Tajawal, sans-serif' }}>تأكيد</button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-2 py-0.5 rounded text-xs" style={{ color: '#a89070', fontFamily: 'Tajawal, sans-serif' }}>إلغاء</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(annex.id)} className="p-1.5 rounded-md" style={{ color: '#a89070' }} title="حذف">
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
          {libraryAnnexes.length === 0 && (
            <div className="p-8 text-center" style={{ color: '#a89070', fontFamily: 'Tajawal, sans-serif' }}>
              لا توجد ملحقات. اضغط على "ملحقة جديدة" لإضافة ملحقة.
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  )
}

export default function AdminLibraryAnnexesPage() {
  return (
    <AdminGuard>
      <LibraryAnnexesContent />
    </AdminGuard>
  )
}
