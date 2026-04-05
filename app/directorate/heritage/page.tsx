'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Home, Landmark, MapPin, Eye, X, Calendar, Hash, ImageIcon } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import {
  getNationalMonuments,
  getInventoryMonuments,
  getIntangibleHeritage,
  type NationalMonument,
  type InventoryMonument,
  type IntangibleHeritageItem,
} from '@/lib/heritage-data'

const COPPER = '#B87333'
const INDIGO_DEEP = '#0F172A'
const INDIGO_DARKER = '#0B1120'

type ModalContent = {
  title: string
  image: string
  description: string
  meta?: { label: string; value: string }[]
} | null

function DetailModal({ content, onClose }: { content: ModalContent; onClose: () => void }) {
  if (!content) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_200ms_ease-out]"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl animate-[scaleIn_300ms_ease-out]"
        style={{
          backgroundColor: 'rgba(15,23,42,0.95)',
          border: `1.5px solid ${COPPER}40`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <X size={18} className="text-white" />
        </button>

        <div className="relative w-full h-[280px] sm:h-[320px]">
          <Image
            src={content.image}
            alt={content.title}
            fill
            className="object-cover rounded-t-2xl"
            sizes="(max-width: 768px) 100vw, 672px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
        </div>

        <div className="p-6 -mt-8 relative" dir="rtl">
          <h3
            className="text-2xl font-bold mb-4"
            style={{
              background: 'linear-gradient(135deg, #D4A04A 0%, #F5D78E 40%, #B87333 70%, #D4956A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {content.title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-5">
            {content.description}
          </p>
          {content.meta && content.meta.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {content.meta.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: `${COPPER}15`, border: `1px solid ${COPPER}25` }}
                >
                  <span className="text-xs text-gray-400">{m.label}:</span>
                  <span className="text-xs font-semibold" style={{ color: COPPER }}>{m.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LightboxModal({ image, alt, onClose }: { image: string; alt: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_200ms_ease-out]"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/90" />
      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
        style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}
      >
        <X size={18} className="text-white" />
      </button>
      <div className="relative w-full max-w-4xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
        <Image
          src={image}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 896px"
        />
      </div>
      <p className="absolute bottom-8 text-center text-white text-sm w-full" dir="rtl">{alt}</p>
    </div>
  )
}

function NationalMonumentCard({ monument, onClick }: { monument: NationalMonument; onClick: () => void }) {
  return (
    <div
      className="group relative rounded-2xl overflow-hidden cursor-pointer h-[280px] sm:h-[320px] transition-all duration-500"
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 35px ${COPPER}40, 0 8px 30px rgba(0,0,0,0.4)`
        e.currentTarget.style.transform = 'translateY(-4px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <Image
        src={monument.image}
        alt={monument.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ border: `2px solid ${COPPER}50`, boxShadow: `inset 0 0 40px ${COPPER}15` }}
      />

      <div className="absolute bottom-0 right-0 left-0 p-5" dir="rtl">
        <h3 className="text-white text-lg font-bold mb-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
          {monument.title}
        </h3>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Eye size={14} style={{ color: COPPER }} />
          <span className="text-xs" style={{ color: COPPER }}>اضغط لعرض التفاصيل</span>
        </div>
      </div>
    </div>
  )
}

function InventoryCard({ monument, onClick }: { monument: InventoryMonument; onClick: () => void }) {
  return (
    <div
      className="group relative rounded-2xl overflow-hidden h-[380px] sm:h-[420px] transition-all duration-500"
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 30px ${COPPER}30, 0 8px 30px rgba(0,0,0,0.4)`
        e.currentTarget.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <Image
        src={monument.image}
        alt={monument.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ border: `1.5px solid ${COPPER}40` }}
      />

      <div className="absolute bottom-0 right-0 left-0 p-5" dir="rtl">
        <h3 className="text-white text-base font-bold mb-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
          {monument.title}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          <Hash size={12} className="text-gray-400" />
          <span className="text-xs text-gray-400 font-mono">{monument.inventoryNumber}</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClick() }}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all duration-300 border"
          style={{ borderColor: `${COPPER}60`, backgroundColor: 'rgba(184,115,51,0.15)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = COPPER
            e.currentTarget.style.boxShadow = `0 0 20px ${COPPER}50`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(184,115,51,0.15)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          عرض التفاصيل
        </button>
      </div>
    </div>
  )
}

const MASONRY_SPANS = [2, 1, 1, 2, 1, 2, 1, 1]

function GalleryImage({ item, spanClass, onClick }: { item: IntangibleHeritageItem; spanClass: string; onClick: () => void }) {
  return (
    <div
      className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ${spanClass}`}
      style={{ boxShadow: '0 2px 15px rgba(0,0,0,0.25)' }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 25px ${COPPER}35`
        e.currentTarget.style.transform = 'scale(1.02)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 15px rgba(0,0,0,0.25)'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      <Image
        src={item.image}
        alt={item.alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ border: `1.5px solid ${COPPER}50` }}
      />
      <div className="absolute bottom-0 right-0 left-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" dir="rtl">
        <p className="text-white text-xs font-medium" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
          {item.alt}
        </p>
      </div>
    </div>
  )
}

const KEYFRAMES = `
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
`

export default function HeritagePage() {
  const [nationalMonuments, setNationalMonuments] = useState<NationalMonument[]>([])
  const [inventoryMonuments, setInventoryMonuments] = useState<InventoryMonument[]>([])
  const [intangibleHeritage, setIntangibleHeritage] = useState<IntangibleHeritageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modalContent, setModalContent] = useState<ModalContent>(null)
  const [lightboxImage, setLightboxImage] = useState<{ image: string; alt: string } | null>(null)

  useEffect(() => {
    Promise.all([getNationalMonuments(), getInventoryMonuments(), getIntangibleHeritage()])
      .then(([nat, inv, intg]) => {
        setNationalMonuments(nat)
        setInventoryMonuments(inv)
        setIntangibleHeritage(intg)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (modalContent || lightboxImage) {
      document.body.style.overflow = 'hidden'
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setModalContent(null)
          setLightboxImage(null)
        }
      }
      window.addEventListener('keydown', handleEsc)
      return () => { window.removeEventListener('keydown', handleEsc); document.body.style.overflow = '' }
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [modalContent, lightboxImage])

  const openNationalModal = useCallback((m: NationalMonument) => {
    setModalContent({
      title: m.title,
      image: m.image,
      description: m.description,
      meta: [{ label: 'تاريخ التصنيف', value: m.classificationDate }],
    })
  }, [])

  const openInventoryModal = useCallback((m: InventoryMonument) => {
    setModalContent({
      title: m.title,
      image: m.image,
      description: m.description,
      meta: [{ label: 'رقم الجرد', value: m.inventoryNumber }],
    })
  }, [])

  return (
    <div
      className="min-h-screen"
      dir="rtl"
      style={{
        background: `linear-gradient(180deg, ${INDIGO_DEEP} 0%, ${INDIGO_DARKER} 40%, #060A14 100%)`,
      }}
    >
      <div
        className="fixed top-[-10%] right-[-5%] w-[50%] h-[50%] pointer-events-none z-[1]"
        style={{
          backgroundImage: 'url("/images/heritage.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
          filter: 'blur(44px)',
        }}
      />

      <div
        className="fixed bottom-[-10%] left-[-5%] w-[45%] h-[45%] pointer-events-none z-[1]"
        style={{
          backgroundImage: 'url("/images/palais-kahina.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.10,
          filter: 'blur(50px)',
        }}
      />

      <div
        className="fixed inset-0 pointer-events-none z-[2]"
        style={{
          background: `radial-gradient(ellipse at center, ${INDIGO_DEEP}B0 0%, ${INDIGO_DARKER}E6 50%, #060A14F2 100%)`,
        }}
      />

      <div
        className="fixed inset-0 opacity-[0.06] pointer-events-none z-[3]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B87333' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div
        className="fixed top-0 right-0 w-[500px] h-[500px] opacity-15 pointer-events-none z-[3]"
        style={{
          background: `radial-gradient(circle, ${COPPER}40 0%, transparent 70%)`,
        }}
      />

      <header className="relative z-10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              href="/?enter=true"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 group"
            >
              <ArrowRight size={20} className="transition-transform duration-200 group-hover:translate-x-1" />
              <span className="text-sm font-medium">العودة للرئيسية</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 group"
            >
              <Home size={20} className="transition-transform duration-200 group-hover:translate-x-1" />
              <span className="text-sm font-medium">صفحة الترحيب</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                backgroundColor: `${COPPER}18`,
                border: `1px solid ${COPPER}30`,
              }}
            >
              <Landmark size={16} style={{ color: COPPER }} />
              <span className="text-sm font-semibold" style={{ color: COPPER }}>
                مصالح المديرية
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4A04A 0%, #F5D78E 40%, #B87333 70%, #D4956A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                مصلحة التراث الثقافي
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light">
              حماية وتثمين المعالم الأثرية والتراث المادي واللامادي لولاية خنشلة
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: `${COPPER}40`, borderTopColor: 'transparent' }}
              />
            </div>
          ) : (
            <>
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${COPPER}18`, border: `1px solid ${COPPER}30` }}
                  >
                    <MapPin size={18} style={{ color: COPPER }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">المعالم المصنفة وطنياً</h2>
                    <p className="text-xs text-gray-400">{nationalMonuments.length} معالم مصنفة</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {nationalMonuments.map((m) => (
                    <NationalMonumentCard
                      key={m.id}
                      monument={m}
                      onClick={() => openNationalModal(m)}
                    />
                  ))}
                </div>
              </section>

              <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.25)' }}
                  >
                    <Calendar size={18} style={{ color: '#22D3EE' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">الجرد الإضافي للمعالم</h2>
                    <p className="text-xs text-gray-400">{inventoryMonuments.length} معالم مجرودة</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {inventoryMonuments.map((m) => (
                    <InventoryCard
                      key={m.id}
                      monument={m}
                      onClick={() => openInventoryModal(m)}
                    />
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)' }}
                  >
                    <ImageIcon size={18} style={{ color: '#FBBF24' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">التراث الثقافي اللامادي</h2>
                    <p className="text-xs text-gray-400">معرض صور التراث والتقاليد المحلية</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[200px] sm:auto-rows-[220px]">
                  {intangibleHeritage.map((item, index) => {
                    const span = MASONRY_SPANS[index % MASONRY_SPANS.length]
                    const spanClass = span === 2 ? 'row-span-2' : ''
                    return (
                      <GalleryImage
                        key={item.id}
                        item={item}
                        spanClass={spanClass}
                        onClick={() => setLightboxImage({ image: item.image, alt: item.alt })}
                      />
                    )
                  })}
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      {modalContent && (
        <DetailModal content={modalContent} onClose={() => setModalContent(null)} />
      )}

      {lightboxImage && (
        <LightboxModal
          image={lightboxImage.image}
          alt={lightboxImage.alt}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  )
}
