'use client'

import { useState, useRef } from 'react'
import { Upload, Loader2, ImageIcon, X } from 'lucide-react'
import { uploadImage, isMockStorage } from '@/lib/storage-helpers'

const COPPER = '#B87333'
const COPPER_LIGHT = '#D4956A'
const INDIGO_DEEP = '#0F172A'
const INDIGO_LIGHT = '#334155'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  storagePath?: string
  label?: string
}

export function ImageUpload({ value, onChange, storagePath = 'images', label = 'الصورة' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة يجب أن لا يتجاوز 5 ميغابايت')
      return
    }

    setError('')
    setUploading(true)
    try {
      const url = await uploadImage(file, storagePath)
      onChange(url)
    } catch {
      setError('فشل رفع الصورة')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif' }}>
        {label}
      </label>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg text-white text-sm outline-none"
          style={{ backgroundColor: INDIGO_DEEP, border: `1px solid ${INDIGO_LIGHT}`, fontFamily: 'Tajawal, sans-serif' }}
          dir="ltr"
          placeholder="https://... أو ارفع صورة"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50"
          style={{ backgroundColor: `${COPPER}20`, color: COPPER_LIGHT, border: `1px solid ${COPPER}40`, fontFamily: 'Tajawal, sans-serif' }}
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          رفع
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      {isMockStorage && (
        <p className="text-xs mt-1" style={{ color: '#64748B', fontFamily: 'Tajawal, sans-serif' }}>
          وضع المعاينة — الصور المرفوعة مؤقتة
        </p>
      )}
      {error && <p className="text-xs mt-1" style={{ color: '#EF4444', fontFamily: 'Tajawal, sans-serif' }}>{error}</p>}
      {value && (
        <div className="mt-2 relative inline-block">
          <div className="w-20 h-20 rounded-lg overflow-hidden border" style={{ borderColor: INDIGO_LIGHT }}>
            {value.startsWith('blob:') || value.startsWith('http') || value.startsWith('/') ? (
              <img src={value} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: INDIGO_DEEP }}>
                <ImageIcon size={20} style={{ color: '#64748B' }} />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#EF4444' }}
          >
            <X size={10} className="text-white" />
          </button>
        </div>
      )}
    </div>
  )
}
