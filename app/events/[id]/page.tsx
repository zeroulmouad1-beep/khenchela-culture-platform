'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { fetchCollection, FirestoreDoc } from '@/lib/firestore-helpers'
import { ArrowRight, Calendar, MapPin, Users, Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react'

const COPPER = '#c9952a'
const COPPER_LIGHT = '#e0b060'
const INDIGO_DEEP = '#1a0f0a'
const INDIGO_MEDIUM = '#1e1610'
const INDIGO_LIGHT = '#2a1e14'

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params?.id as string
  const [event, setEvent] = useState<FirestoreDoc | null>(null)
  const [loading, setLoading] = useState(true)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const touchStartX = useRef(0)

  // Derived early so keyboard effect can reference them before early returns
  const mainImage = event?.imageUrl || event?.image || '/images/cultural-festival.jpg'
  const gallery: string[] = (event?.gallery as string[]) || []
  const allImages: string[] = event
    ? [mainImage, ...gallery.filter((g: string) => g && g.trim())]
    : []

  useEffect(() => {
    async function loadEvent() {
      try {
        const docs = await fetchCollection('events', 'date')
        const found = docs.find(d => d.id === eventId)
        if (found) setEvent(found)
      } catch (err) {
        console.error('Failed to load event:', err)
      } finally {
        setLoading(false)
      }
    }
    if (eventId) loadEvent()
  }, [eventId])

  // Keyboard navigation + Escape to close
  useEffect(() => {
    if (!lightboxOpen) return
    const total = allImages.length
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightboxOpen(false)
      // RTL: ArrowLeft → advance, ArrowRight → go back
      if (e.key === 'ArrowLeft')  setLightboxIndex(i => (i + 1) % total)
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i - 1 + total) % total)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxOpen, allImages.length])

  // Lock body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

  function openLightbox(index: number) {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  function lbPrev() {
    setLightboxIndex(i => (i - 1 + allImages.length) % allImages.length)
  }

  function lbNext() {
    setLightboxIndex(i => (i + 1) % allImages.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: INDIGO_DEEP }}>
        <Loader2 size={32} className="animate-spin" style={{ color: COPPER }} />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: INDIGO_DEEP }}>
        <p className="text-white text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>لم يتم العثور على الفعالية</p>
        <Link href="/?enter=true" className="px-4 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: COPPER, fontFamily: 'Tajawal, sans-serif' }}>
          العودة للرئيسية
        </Link>
      </div>
    )
  }

  const statusLabel = event.status === 'canceled' ? 'ملغي' : event.status === 'finished' ? 'منتهي' : 'نشط'
  const statusColor = event.status === 'canceled' ? '#EF4444' : event.status === 'finished' ? '#a89070' : '#22C55E'

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    try {
      return new Date(dateStr).toLocaleDateString('ar-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: INDIGO_DEEP }} dir="rtl">

      {/* ── Hero / main image with carousel ── */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={allImages[galleryIndex] || mainImage}
          alt={event.title || ''}
          className="w-full h-full object-cover cursor-zoom-in"
          onClick={() => openLightbox(galleryIndex)}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0.6) 40%, rgba(15, 23, 42, 0.2) 100%)' }} />

        {allImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
            <button
              onClick={() => setGalleryIndex(i => (i - 1 + allImages.length) % allImages.length)}
              className="p-2 rounded-full border transition-colors"
              style={{ borderColor: COPPER, color: COPPER, backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
            >
              <ChevronRight size={18} />
            </button>
            <div className="flex gap-1.5">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIndex(i)}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{ backgroundColor: i === galleryIndex ? COPPER : '#a89070' }}
                />
              ))}
            </div>
            <button
              onClick={() => setGalleryIndex(i => (i + 1) % allImages.length)}
              className="p-2 rounded-full border transition-colors"
              style={{ borderColor: COPPER, color: COPPER, backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        )}

        <div className="absolute top-6 right-6 z-10">
          <Link
            href="/?enter=true"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif', border: `1px solid ${INDIGO_LIGHT}` }}
          >
            <ArrowRight size={16} />
            العودة للرئيسية
          </Link>
        </div>

        <div className="absolute bottom-12 right-0 left-0 px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              {event.category && (
                <span className="px-3 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: COPPER, fontFamily: 'Tajawal, sans-serif' }}>
                  {event.category}
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${statusColor}20`, color: statusColor, fontFamily: 'Tajawal, sans-serif' }}>
                {statusLabel}
              </span>
              {event.featured && (
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', fontFamily: 'Tajawal, sans-serif' }}>
                  مميزة
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Body content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-xl border p-6 mb-6" style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}>
              <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                عن الفعالية
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#d4c4a8', fontFamily: 'Amiri, serif', lineHeight: '2' }}>
                {event.description || 'لا يوجد وصف متاح لهذه الفعالية.'}
              </p>
            </div>

            {gallery.length > 0 && gallery.some((g: string) => g && g.trim()) && (
              <div className="rounded-xl border p-6" style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}>
                <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  معرض الصور
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gallery.filter((g: string) => g && g.trim()).map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => openLightbox(i + 1)}
                      className="aspect-[4/3] rounded-lg overflow-hidden border transition-all duration-200 hover:scale-[1.02] hover:border-opacity-100"
                      style={{ borderColor: COPPER_LIGHT }}
                      aria-label={`فتح الصورة ${i + 1}`}
                    >
                      <img src={img} alt={`${event.title} - ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-xl border p-6 lg:sticky lg:top-6" style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}>
              <h2 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                تفاصيل الفعالية
              </h2>
              <div className="space-y-4">
                {event.date && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${COPPER}20` }}>
                      <Calendar size={16} style={{ color: COPPER }} />
                    </div>
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: '#a89070', fontFamily: 'Tajawal, sans-serif' }}>التاريخ</p>
                      <p className="text-sm text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>{formatDate(event.date as string)}</p>
                    </div>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${COPPER}20` }}>
                      <MapPin size={16} style={{ color: COPPER }} />
                    </div>
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: '#a89070', fontFamily: 'Tajawal, sans-serif' }}>المكان</p>
                      <p className="text-sm text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>{event.location as string}</p>
                    </div>
                  </div>
                )}
                {event.capacity != null && (event.capacity as number) > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${COPPER}20` }}>
                      <Users size={16} style={{ color: COPPER }} />
                    </div>
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: '#a89070', fontFamily: 'Tajawal, sans-serif' }}>السعة</p>
                      <p className="text-sm text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>{event.capacity as number} شخص</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lightbox modal ── */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="معرض الصور"
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            aria-label="إغلاق"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: 'rgba(201,149,42,0.15)',
              border: `1px solid ${COPPER}`,
              color: COPPER_LIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            <X size={22} />
          </button>

          {/* Image counter */}
          <div
            style={{
              position: 'absolute',
              top: 22,
              left: '50%',
              transform: 'translateX(-50%)',
              color: COPPER_LIGHT,
              fontSize: 14,
              fontFamily: 'Tajawal, sans-serif',
              letterSpacing: '0.05em',
              zIndex: 10,
            }}
          >
            {lightboxIndex + 1} / {allImages.length}
          </div>

          {/* Main image — stop click from bubbling to overlay */}
          <img
            src={allImages[lightboxIndex]}
            alt={`${event.title} - ${lightboxIndex + 1}`}
            onClick={e => e.stopPropagation()}
            onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
            onTouchEnd={e => {
              const diff = touchStartX.current - e.changedTouches[0].clientX
              if (diff > 50) lbNext()
              else if (diff < -50) lbPrev()
            }}
            style={{
              maxHeight: '88vh',
              maxWidth: '88vw',
              objectFit: 'contain',
              borderRadius: 8,
              boxShadow: '0 8px 48px rgba(0,0,0,0.7)',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          />

          {/* Prev / Next — only when multiple images */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); lbPrev() }}
                aria-label="الصورة السابقة"
                style={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(201,149,42,0.15)',
                  border: `1px solid ${COPPER}`,
                  color: COPPER_LIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronRight size={24} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); lbNext() }}
                aria-label="الصورة التالية"
                style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(201,149,42,0.15)',
                  border: `1px solid ${COPPER}`,
                  color: COPPER_LIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={24} />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {allImages.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 8,
                zIndex: 10,
              }}
              onClick={e => e.stopPropagation()}
            >
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  style={{
                    width: i === lightboxIndex ? 20 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: i === lightboxIndex ? COPPER : 'rgba(201,149,42,0.35)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'width 0.2s ease, background-color 0.2s ease',
                    padding: 0,
                  }}
                  aria-label={`الصورة ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )

  function closeLightbox() {
    setLightboxOpen(false)
  }
}
