'use client'

import { useState } from 'react'
import { AdminGuard } from '@/lib/auth-context'
import { AdminShell } from '@/components/admin/admin-shell'
import { useCms } from '@/lib/cms-context'
import { useToast } from '@/components/admin/toast'
import { ImageUpload } from '@/components/admin/image-upload'
import { Institution } from '@/lib/institutions-data'
import { Pencil, X, Save, Building2, Loader2 } from 'lucide-react'

const COPPER = '#B87333'
const COPPER_LIGHT = '#D4956A'
const INDIGO_DEEP = '#0F172A'
const INDIGO_MEDIUM = '#1E293B'
const INDIGO_LIGHT = '#334155'

function InstitutionsContent() {
  const { institutions, updateInstitution } = useCms()
  const { showToast } = useToast()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Institution>>({})
  const [saving, setSaving] = useState(false)

  const handleEdit = (inst: Institution) => {
    setForm({ ...inst })
    setEditingId(inst.id)
  }

  const handleSave = async () => {
    if (saving) return
    if (!editingId || !form.title?.trim()) return
    setSaving(true)
    try {
      await updateInstitution(editingId, form)
      showToast('تم تحديث المؤسسة بنجاح', 'success')
      setEditingId(null)
      setForm({})
    } catch {
      showToast('فشل تحديث المؤسسة', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({})
  }

  const inputStyle = { backgroundColor: INDIGO_DEEP, border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Tajawal, sans-serif' }
  const labelStyle = { color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إدارة المؤسسات
          </h2>
          <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: `${COPPER}20`, color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>
            {institutions.length} مؤسسات
          </span>
        </div>

        {editingId && (
          <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تعديل المؤسسة
              </h3>
              <button onClick={handleCancel} style={{ color: '#94A3B8' }}><X size={20} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>الاسم *</label>
                <input value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none" style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>اللقب الرسمي</label>
                <input value={form.subtitle || ''} onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none" style={inputStyle}
                  placeholder="(مثلاً: الاخوة الشهداء بولعزيز)" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" style={labelStyle}>الوصف المختصر</label>
              <input value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none" style={inputStyle} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" style={labelStyle}>الوصف الكامل</label>
              <textarea value={form.fullDescription || ''} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                rows={4} className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none resize-none"
                style={{ ...inputStyle, fontFamily: 'Amiri, serif' }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>العنوان</label>
                <input value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none" style={inputStyle} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>الهاتف</label>
                <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none" style={inputStyle} dir="ltr" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>البريد الإلكتروني</label>
                <input value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none" style={inputStyle} dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>أوقات العمل</label>
                <input value={form.workingHours || ''} onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white text-sm outline-none" style={inputStyle} />
              </div>
            </div>
            <div className="mb-4">
              <ImageUpload value={form.image || ''} onChange={(url) => setForm({ ...form, image: url })} storagePath="institutions" label="صورة المؤسسة" />
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium" style={labelStyle}>معرض الصور</label>
                <button type="button" onClick={() => setForm({ ...form, gallery: [...(form.gallery || []), ''] })}
                  className="text-xs px-2 py-1 rounded" style={{ color: COPPER_LIGHT, border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Tajawal, sans-serif' }}>+ صورة</button>
              </div>
              {(form.gallery || []).map((url, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input value={url} onChange={(e) => { const g = [...(form.gallery || [])]; g[i] = e.target.value; setForm({ ...form, gallery: g }) }}
                    className="flex-1 px-3 py-2 rounded-lg text-white text-sm outline-none"
                    style={{ backgroundColor: INDIGO_DEEP, border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Tajawal, sans-serif' }}
                    dir="ltr" placeholder="https://..." />
                  <button type="button" onClick={() => setForm({ ...form, gallery: (form.gallery || []).filter((_, j) => j !== i) })}
                    className="p-1" style={{ color: '#EF4444' }}><X size={14} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={handleCancel} className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ color: '#94A3B8', border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Tajawal, sans-serif' }}>إلغاء</button>
              <button onClick={handleSave} disabled={!form.title?.trim() || saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: COPPER, fontFamily: 'Tajawal, sans-serif' }}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}تحديث
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {institutions.map((inst) => (
            <div key={inst.id} className="rounded-xl border p-4 transition-all duration-200 hover:border-opacity-50"
              style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${COPPER}20` }}>
                    <Building2 size={20} style={{ color: COPPER }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-bold text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{inst.title}</h3>
                    {inst.subtitle && (
                      <p className="text-xs mt-0.5" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>{inst.subtitle}</p>
                    )}
                    {inst.description && (
                      <p className="text-xs mt-1" style={{ color: '#94A3B8', fontFamily: 'Amiri, serif' }}>{inst.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="text-xs" style={{ color: '#64748B', fontFamily: 'Tajawal, sans-serif' }}>{inst.address}</span>
                      <span className="text-xs" style={{ color: '#64748B' }} dir="ltr">{inst.phone}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => handleEdit(inst)} className="p-2 rounded-lg transition-colors flex-shrink-0"
                  style={{ color: COPPER_LIGHT }} title="تعديل">
                  <Pencil size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  )
}

export default function AdminInstitutionsPage() {
  return (
    <AdminGuard>
      <InstitutionsContent />
    </AdminGuard>
  )
}
