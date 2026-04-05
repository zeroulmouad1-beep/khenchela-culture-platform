'use client'

import Link from 'next/link'
import { ArrowRight, Home, Star, Music, BookOpen, Palette } from 'lucide-react'

const COPPER = '#B87333'
const INDIGO_DEEP = '#0F172A'
const INDIGO_DARKER = '#0B1120'

const festivals = [
  {
    id: 'child-welfare',
    title: 'المهرجان الثقافي الوطني لمصلحة الطفل',
    subtitle: 'مهرجان وطني',
    icon: Star,
    accentColor: '#D4A04A',
  },
  {
    id: 'shawia-music',
    title: 'المهرجان الثقافي الوطني للموسيقى والأغنية الشاوية',
    subtitle: 'مهرجان وطني',
    icon: Music,
    accentColor: '#2DD4BF',
  },
  {
    id: 'reading',
    title: 'المهرجان الثقافي المحلي للقراءة',
    subtitle: 'مهرجان محلي',
    icon: BookOpen,
    accentColor: '#F59E0B',
  },
  {
    id: 'folk-arts',
    title: 'المهرجان الثقافي المحلي للنشاطات والفنون الشعبية',
    subtitle: 'مهرجان محلي',
    icon: Palette,
    accentColor: '#A78BFA',
  },
]

export default function FestivalsPage() {
  return (
    <div
      className="min-h-screen"
      dir="rtl"
      style={{
        background: `linear-gradient(180deg, ${INDIGO_DEEP} 0%, ${INDIGO_DARKER} 40%, #060A14 100%)`,
      }}
    >
      <div
        className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] pointer-events-none z-[1]"
        style={{
          backgroundImage: 'url("/images/cultural-festival.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          filter: 'blur(40px)',
        }}
      />

      <div
        className="fixed bottom-[-10%] left-[-10%] w-[55%] h-[55%] pointer-events-none z-[1]"
        style={{
          backgroundImage: 'url("/images/music-concert.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
          filter: 'blur(44px)',
        }}
      />

      <div
        className="fixed top-[30%] left-[10%] w-[40%] h-[40%] pointer-events-none z-[1]"
        style={{
          backgroundImage: 'url("/images/heritage.jpg")',
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
        className="fixed top-0 right-0 w-[600px] h-[600px] opacity-20 pointer-events-none z-[3]"
        style={{
          background: `radial-gradient(circle, ${COPPER}40 0%, transparent 70%)`,
        }}
      />

      <div
        className="fixed bottom-0 left-0 w-[500px] h-[500px] opacity-10 pointer-events-none z-[3]"
        style={{
          background: `radial-gradient(circle, #2DD4BF30 0%, transparent 70%)`,
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
          <div className="text-center mb-16">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: COPPER }}
            >
              المهرجانات الثقافية
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              <span
                style={{
                  background: 'linear-gradient(135deg, #D4A04A 0%, #F5D78E 40%, #B87333 70%, #D4956A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                مهرجانات ولاية خنشلة
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light">
              اكتشف المهرجانات الثقافية الوطنية والمحلية التي تحتضنها ولاية خنشلة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {festivals.map((festival) => {
              const FestivalIcon = festival.icon
              const accent = festival.accentColor
              return (
                <a
                  key={festival.id}
                  href="#"
                  className="group rounded-2xl p-6 md:p-8 transition-all duration-500 block cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: `1.5px solid rgba(255,255,255,0.10)`,
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    transform: 'scale(1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = accent
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.boxShadow = `0 0 30px -5px ${accent}40, 0 20px 50px -15px ${accent}25, inset 0 1px 0 rgba(255,255,255,0.1)`
                    e.currentTarget.style.transform = 'scale(1.04)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <div className="flex items-start gap-4 md:gap-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${accent}18`,
                        border: `1px solid ${accent}30`,
                      }}
                    >
                      <FestivalIcon
                        size={26}
                        style={{ color: accent }}
                        className="transition-colors duration-300"
                      />
                    </div>
                    <div className="text-right">
                      <h2
                        className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight transition-colors duration-300"
                      >
                        {festival.title}
                      </h2>
                      <p className="text-xs font-medium" style={{ color: accent, opacity: 0.85 }}>
                        {festival.subtitle}
                      </p>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
