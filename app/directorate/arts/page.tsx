'use client'

import Link from 'next/link'
import { ArrowRight, Home, Palette, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getArtists, type Artist, type ArtistStatus } from '@/lib/artists-data'

const COPPER = '#c9952a'
const INDIGO_DEEP = '#1a0f0a'
const INDIGO_DARKER = '#12100e'

const statusConfig: Record<ArtistStatus, { bg: string; text: string; border: string }> = {
  'نشط': { bg: 'rgba(34,197,94,0.15)', text: '#4ADE80', border: 'rgba(34,197,94,0.30)' },
  'معلق': { bg: 'rgba(245,158,11,0.15)', text: '#FBBF24', border: 'rgba(245,158,11,0.30)' },
  'غير نشط': { bg: 'rgba(148,163,184,0.15)', text: '#a89070', border: 'rgba(148,163,184,0.30)' },
}

const TABLE_HEADERS = ['#', 'الاسم الكامل', 'رقم البطاقة', 'رقم التعريف الوطني', 'التخصص', 'البلدية', 'الحالة']

function StatusBadge({ status }: { status: ArtistStatus }) {
  const config = statusConfig[status]
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
      }}
    >
      {status}
    </span>
  )
}

function ArtistsTable({ data }: { data: Artist[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: `${COPPER}15`, border: `1px solid ${COPPER}25` }}
        >
          <Users size={28} style={{ color: COPPER }} />
        </div>
        <p className="text-white font-semibold mb-2">لا توجد بيانات متاحة حالياً</p>
        <p className="text-sm" style={{ color: '#a89070' }}>سيتم عرض سجل الفنانين هنا بعد إضافته من لوحة الإدارة</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl" style={{ WebkitOverflowScrolling: 'touch' }}>
      <table className="w-full min-w-[900px] text-right" dir="rtl">
        <thead>
          <tr
            style={{
              backgroundColor: 'rgba(201,149,42,0.12)',
              borderBottom: '1px solid rgba(201,149,42,0.25)',
            }}
          >
            {TABLE_HEADERS.map((header) => (
              <th
                key={header}
                className="px-5 py-4 text-sm font-semibold whitespace-nowrap"
                style={{ color: COPPER }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((artist, index) => (
            <tr
              key={artist.id}
              className="transition-colors duration-200"
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(201,149,42,0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'
              }}
            >
              <td className="px-5 py-4 text-sm text-gray-400 font-mono">{artist.id}</td>
              <td className="px-5 py-4 text-sm text-white font-medium">{artist.name}</td>
              <td className="px-5 py-4 text-sm text-gray-300 font-mono whitespace-nowrap">{artist.cardId}</td>
              <td className="px-5 py-4 text-sm text-gray-300 font-mono whitespace-nowrap">{artist.nationalId}</td>
              <td className="px-5 py-4 text-sm text-gray-300">{artist.specialty}</td>
              <td className="px-5 py-4 text-sm text-gray-300">{artist.municipality}</td>
              <td className="px-5 py-4">
                <StatusBadge status={artist.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ArtsPage() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getArtists()
      .then(setArtists)
      .finally(() => setLoading(false))
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
          backgroundImage: 'url("/images/art-workshop.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
          filter: 'blur(44px)',
        }}
      />

      <div
        className="fixed bottom-[-10%] left-[-5%] w-[45%] h-[45%] pointer-events-none z-[1]"
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
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                backgroundColor: `${COPPER}18`,
                border: `1px solid ${COPPER}30`,
              }}
            >
              <Palette size={16} style={{ color: COPPER }} />
              <span className="text-sm font-semibold" style={{ color: COPPER }}>
                مصالح المديرية
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <span
                style={{
                  background: 'linear-gradient(135deg, #c9952a 0%, #e0b060 40%, #c9952a 70%, #8b3a2a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                مصلحة الفنون والآداب
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light">
              سجل الفنانين والأدباء المعتمدين في ولاية خنشلة
            </p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              <Users size={18} style={{ color: COPPER }} />
              <span className="text-sm text-gray-300">
                إجمالي الفنانين: <span className="text-white font-semibold">{artists.length}</span>
              </span>
            </div>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1.5px solid rgba(255,255,255,0.10)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div
                  className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: `${COPPER}40`, borderTopColor: 'transparent' }}
                />
              </div>
            ) : (
              <ArtistsTable data={artists} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
