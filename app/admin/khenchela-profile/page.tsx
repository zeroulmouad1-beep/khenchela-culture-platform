'use client'

import { useState } from 'react'
import { AdminGuard } from '@/lib/auth-context'
import { AdminShell } from '@/components/admin/admin-shell'
import { useCms, KhenchelaSection } from '@/lib/cms-context'
import { useToast } from '@/components/admin/toast'
import { Pencil, X, Save, Eye, EyeOff, Mountain, Loader2 } from 'lucide-react'

const COPPER = '#B87333'
const COPPER_LIGHT = '#D4956A'
const INDIGO_DEEP = '#0F172A'
const INDIGO_MEDIUM = '#1E293B'
const INDIGO_LIGHT = '#334155'

function KhenchelaProfileContent() {
  const { khenchelaSections, updateKhenchelaSection } = useCms()
  const { showToast } = useToast()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<{ title: string; subtitle: string; paragraphs: string[] }>({ title: '', subtitle: '', paragraphs: [] })
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleEdit = (section: KhenchelaSection) => {
    setForm({ title: section.title, subtitle: section.subtitle, paragraphs: [...section.paragraphs] })
    setEditingId(section.id)
  }

  const handleSave = async () => {
    if (saving) return
    if (!editingId || !form.title.trim()) return
    setSaving(true)
    try {
      await updateKhenchelaSection(editingId, form)
      showToast('تم تحديث القسم بنجاح', 'success')
      setEditingId(null)
      setForm({ title: '', subtitle: '', paragraphs: [] })
    } catch {
      showToast('فشل تحديث القسم', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({ title: '', subtitle: '', paragraphs: [] })
  }

  const updateParagraph = (index: number, value: string) => {
    const updated = [...form.paragraphs]
    updated[index] = value
    setForm({ ...form, paragraphs: updated })
  }

  const addParagraph = () => {
    setForm({ ...form, paragraphs: [...form.paragraphs, ''] })
  }

  const removeParagraph = (index: number) => {
    if (form.paragraphs.length <= 1) return
    setForm({ ...form, paragraphs: form.paragraphs.filter((_, i) => i !== index) })
  }

  const inputStyle = { backgroundColor: INDIGO_DEEP, border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Tajawal, sans-serif' }
  const labelStyle = { color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إدارة ملف خنشلة
          </h2>
          <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: `${COPPER}20`, color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>
            {khenchelaSections.length} أقسام
          </span>
        </div>

        {editingId && (
          <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>تعديل القسم</h3>
              <button onClick={handleCancel} style={{ color: '#94A3B8' }}><X size={20} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>العنوان *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none" style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>العنوان الفرعي</label>
                <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none" style={inputStyle} />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium" style={labelStyle}>الفقرات</label>
                <button onClick={addParagraph} className="text-xs px-2 py-1 rounded" style={{ color: COPPER_LIGHT, border: `1px solid ${COPPER}40`, fontFamily: 'Tajawal, sans-serif' }}>
                  + فقرة جديدة
                </button>
              </div>
              {form.paragraphs.map((p, i) => (
                <div key={i} className="mb-3 relative">
                  <div className="flex items-start gap-2">
                    <span className="text-xs mt-2 flex-shrink-0" style={{ color: '#64748B' }}>{i + 1}</span>
                    <textarea value={p} onChange={(e) => updateParagraph(i, e.target.value)}
                      rows={3} className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none resize-none flex-1"
                      style={{ ...inputStyle, fontFamily: 'Amiri, serif' }} />
                    {form.paragraphs.length > 1 && (
                      <button onClick={() => removeParagraph(i)} className="mt-2 flex-shrink-0" style={{ color: '#EF4444' }}>
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={handleCancel} className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ color: '#94A3B8', border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Tajawal, sans-serif' }}>إلغاء</button>
              <button onClick={handleSave} disabled={!form.title.trim() || saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: COPPER, fontFamily: 'Tajawal, sans-serif' }}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}تحديث
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {khenchelaSections.map((section) => (
            <div key={section.id} className="rounded-xl border p-5 transition-all duration-200"
              style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${COPPER}20` }}>
                    <Mountain size={20} style={{ color: COPPER }} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>{section.title}</h3>
                    <p className="text-xs" style={{ color: COPPER_LIGHT, fontFamily: 'Amiri, serif' }}>{section.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPreviewId(previewId === section.id ? null : section.id)}
                    className="p-1.5 rounded-md" style={{ color: '#94A3B8' }} title="معاينة">
                    {previewId === section.id ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button onClick={() => handleEdit(section)} className="p-1.5 rounded-md" style={{ color: COPPER_LIGHT }} title="تعديل">
                    <Pencil size={16} />
                  </button>
                </div>
              </div>
              <p className="text-xs mb-2" style={{ color: '#64748B', fontFamily: 'Tajawal, sans-serif' }}>
                {section.paragraphs.length} فقرات
              </p>
              {previewId === section.id && (
                <div className="mt-3 p-4 rounded-lg space-y-3" style={{ backgroundColor: `${INDIGO_DEEP}`, border: `1px solid ${INDIGO_LIGHT}40` }}>
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="text-sm leading-relaxed" style={{ color: '#CBD5E1', fontFamily: 'Amiri, serif' }}>{p}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}

export default function AdminKhenchelaProfilePage() {
  return (
    <AdminGuard>
      <KhenchelaProfileContent />
    </AdminGuard>
  )
}
