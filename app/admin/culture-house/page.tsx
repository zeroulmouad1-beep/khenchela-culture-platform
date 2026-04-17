'use client'

import { useState } from 'react'
import { AdminGuard } from '@/lib/auth-context'
import { AdminShell } from '@/components/admin/admin-shell'
import { useCms, CultureHouseWorkshop, CultureHouseFacility } from '@/lib/cms-context'
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

function CultureHouseContent() {
  const {
    workshops, addWorkshop, updateWorkshop, deleteWorkshop,
    facilities, addFacility, updateFacility, deleteFacility,
  } = useCms()
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState<'workshops' | 'facilities'>('workshops')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [wForm, setWForm] = useState({ name: '', iconName: 'Theater' })
  const [fForm, setFForm] = useState({ name: '', subtitle: '', iconName: 'Home' })
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setWForm({ name: '', iconName: 'Theater' })
    setFForm({ name: '', subtitle: '', iconName: 'Home' })
  }

  const handleSaveWorkshop = async () => {
    if (saving) return
    if (!wForm.name.trim()) return
    setSaving(true)
    try {
      if (editingId) {
        await updateWorkshop(editingId, wForm)
        showToast('تم تحديث الورشة بنجاح', 'success')
      } else {
        await addWorkshop(wForm)
        showToast('تمت إضافة الورشة بنجاح', 'success')
      }
      resetForm()
    } catch {
      showToast('حدث خطأ أثناء الحفظ', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveFacility = async () => {
    if (saving) return
    if (!fForm.name.trim()) return
    setSaving(true)
    try {
      const data: Record<string, string> = { name: fForm.name, iconName: fForm.iconName, subtitle: fForm.subtitle.trim() }
      if (editingId) {
        await updateFacility(editingId, data)
        showToast('تم تحديث المرفق بنجاح', 'success')
      } else {
        await addFacility(data)
        showToast('تمت إضافة المرفق بنجاح', 'success')
      }
      resetForm()
    } catch {
      showToast('حدث خطأ أثناء الحفظ', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleEditWorkshop = (w: CultureHouseWorkshop) => {
    setWForm({ name: w.name, iconName: w.iconName })
    setEditingId(w.id)
    setShowForm(true)
  }

  const handleEditFacility = (f: CultureHouseFacility) => {
    setFForm({ name: f.name, subtitle: f.subtitle || '', iconName: f.iconName })
    setEditingId(f.id)
    setShowForm(true)
  }

  const handleDeleteItem = async (id: string) => {
    try {
      if (activeTab === 'workshops') await deleteWorkshop(id)
      else await deleteFacility(id)
      showToast('تم الحذف بنجاح', 'success')
    } catch {
      showToast('فشل الحذف', 'error')
    }
    setDeleteConfirm(null)
  }

  const inputStyle = { backgroundColor: INDIGO_DEEP, border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Tajawal, sans-serif' }
  const labelStyle = { color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }

  const tabBtn = (tab: 'workshops' | 'facilities', label: string, count: number) => (
    <button
      onClick={() => { setActiveTab(tab); resetForm() }}
      className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
      style={{
        backgroundColor: activeTab === tab ? `${COPPER}20` : 'transparent',
        color: activeTab === tab ? COPPER_LIGHT : '#94A3B8',
        border: activeTab === tab ? `1px solid ${COPPER}40` : `1px solid transparent`,
        fontFamily: 'Tajawal, sans-serif',
      }}>
      {label} ({count})
    </button>
  )

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إدارة دار الثقافة
          </h2>
          <button onClick={() => { resetForm(); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: COPPER, fontFamily: 'Tajawal, sans-serif' }}>
            <Plus size={16} />إضافة جديد
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {tabBtn('workshops', 'الجناح البيداغوجي', workshops.length)}
          {tabBtn('facilities', 'المرافق والمصالح', facilities.length)}
        </div>

        {showForm && (
          <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {editingId ? 'تعديل' : 'إضافة'} {activeTab === 'workshops' ? 'ورشة' : 'مرفق'}
              </h3>
              <button onClick={resetForm} style={{ color: '#94A3B8' }}><X size={20} /></button>
            </div>

            {activeTab === 'workshops' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={labelStyle}>اسم الورشة *</label>
                  <input value={wForm.name} onChange={(e) => setWForm({ ...wForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none" style={inputStyle} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={labelStyle}>الأيقونة</label>
                  <select value={wForm.iconName} onChange={(e) => setWForm({ ...wForm, iconName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none" style={inputStyle}>
                    {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={labelStyle}>اسم المرفق *</label>
                    <input value={fForm.name} onChange={(e) => setFForm({ ...fForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none" style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={labelStyle}>اللقب الفرعي</label>
                    <input value={fForm.subtitle} onChange={(e) => setFForm({ ...fForm, subtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none" style={inputStyle}
                      placeholder="(اختياري)" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1" style={labelStyle}>الأيقونة</label>
                  <select value={fForm.iconName} onChange={(e) => setFForm({ ...fForm, iconName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none" style={inputStyle}>
                    {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
                </div>
              </>
            )}

            <div className="flex gap-3 justify-end">
              <button onClick={resetForm} className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ color: '#94A3B8', border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Tajawal, sans-serif' }}>إلغاء</button>
              <button onClick={activeTab === 'workshops' ? handleSaveWorkshop : handleSaveFacility}
                disabled={(activeTab === 'workshops' ? !wForm.name.trim() : !fForm.name.trim()) || saving}
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
                  <th className="px-4 py-3 text-right font-medium" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>الاسم</th>
                  {activeTab === 'facilities' && (
                    <th className="px-4 py-3 text-right font-medium hidden md:table-cell" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>اللقب</th>
                  )}
                  <th className="px-4 py-3 text-right font-medium" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>الأيقونة</th>
                  <th className="px-4 py-3 text-right font-medium" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {activeTab === 'workshops' ? (
                  workshops.map((w) => (
                    <tr key={w.id} style={{ borderBottom: `1px solid ${INDIGO_LIGHT}20` }}>
                      <td className="px-4 py-3 text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>{w.name}</td>
                      <td className="px-4 py-3" style={{ color: '#94A3B8', fontFamily: 'Tajawal, sans-serif' }}>{w.iconName}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEditWorkshop(w)} className="p-1.5 rounded-md" style={{ color: COPPER_LIGHT }}><Pencil size={14} /></button>
                          {deleteConfirm === w.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDeleteItem(w.id)} className="px-2 py-0.5 rounded text-xs text-white" style={{ backgroundColor: '#DC2626', fontFamily: 'Tajawal, sans-serif' }}>تأكيد</button>
                              <button onClick={() => setDeleteConfirm(null)} className="px-2 py-0.5 rounded text-xs" style={{ color: '#94A3B8', fontFamily: 'Tajawal, sans-serif' }}>إلغاء</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(w.id)} className="p-1.5 rounded-md" style={{ color: '#94A3B8' }}><Trash2 size={14} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  facilities.map((f) => (
                    <tr key={f.id} style={{ borderBottom: `1px solid ${INDIGO_LIGHT}20` }}>
                      <td className="px-4 py-3 text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>{f.name}</td>
                      <td className="px-4 py-3 hidden md:table-cell" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>{f.subtitle || '-'}</td>
                      <td className="px-4 py-3" style={{ color: '#94A3B8', fontFamily: 'Tajawal, sans-serif' }}>{f.iconName}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEditFacility(f)} className="p-1.5 rounded-md" style={{ color: COPPER_LIGHT }}><Pencil size={14} /></button>
                          {deleteConfirm === f.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleDeleteItem(f.id)} className="px-2 py-0.5 rounded text-xs text-white" style={{ backgroundColor: '#DC2626', fontFamily: 'Tajawal, sans-serif' }}>تأكيد</button>
                              <button onClick={() => setDeleteConfirm(null)} className="px-2 py-0.5 rounded text-xs" style={{ color: '#94A3B8', fontFamily: 'Tajawal, sans-serif' }}>إلغاء</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(f.id)} className="p-1.5 rounded-md" style={{ color: '#94A3B8' }}><Trash2 size={14} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {((activeTab === 'workshops' && workshops.length === 0) || (activeTab === 'facilities' && facilities.length === 0)) && (
            <div className="p-8 text-center" style={{ color: '#64748B', fontFamily: 'Tajawal, sans-serif' }}>
              لا توجد عناصر. اضغط على "إضافة جديد" للبدء.
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  )
}

export default function AdminCultureHousePage() {
  return (
    <AdminGuard>
      <CultureHouseContent />
    </AdminGuard>
  )
}
