'use client'

import Link from 'next/link'
import { ArrowRight, Home, Users, BookOpen, BarChart3, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getAssociations, getStatistics, type Association, type Statistic } from '@/lib/activities-data'

const COPPER = '#B87333'
const INDIGO_DEEP = '#0F172A'
const INDIGO_DARKER = '#0B1120'

const ASSOC_HEADERS = ['#', 'اسم الجمعية', 'النوع', 'الرئيس', 'تاريخ التأسيس']

function getProgressColor(progress: number) {
  if (progress >= 70) return { bar: '#22D3EE', bg: 'rgba(34,211,238,0.15)', text: '#22D3EE', border: 'rgba(34,211,238,0.25)' }
  if (progress >= 40) return { bar: '#FBBF24', bg: 'rgba(251,191,36,0.15)', text: '#FBBF24', border: 'rgba(251,191,36,0.25)' }
  return { bar: '#F87171', bg: 'rgba(248,113,113,0.15)', text: '#F87171', border: 'rgba(248,113,113,0.25)' }
}

function AssociationsTable({ data }: { data: Association[] }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: `${COPPER}15`, border: `1px solid ${COPPER}25` }}
        >
          <BookOpen size={28} style={{ color: COPPER }} />
        </div>
        <p className="text-white font-semibold mb-2">لا توجد بيانات متاحة حالياً</p>
        <p className="text-sm" style={{ color: '#64748B' }}>سيتم عرض سجل الجمعيات هنا بعد إضافته من لوحة الإدارة</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl" style={{ WebkitOverflowScrolling: 'touch' }}>
      <table className="w-full min-w-[700px] text-right" dir="rtl">
        <thead>
          <tr
            style={{
              backgroundColor: 'rgba(184,115,51,0.12)',
              borderBottom: '1px solid rgba(184,115,51,0.25)',
            }}
          >
            {ASSOC_HEADERS.map((header) => (
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
          {data.map((assoc, index) => (
            <tr
              key={assoc.id}
              className="transition-colors duration-200"
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(184,115,51,0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'
              }}
            >
              <td className="px-5 py-4 text-sm text-gray-400 font-mono">{assoc.id}</td>
              <td className="px-5 py-4 text-sm text-white font-medium">{assoc.name}</td>
              <td className="px-5 py-4 text-sm text-gray-300">{assoc.type}</td>
              <td className="px-5 py-4 text-sm text-gray-300">{assoc.president}</td>
              <td className="px-5 py-4 text-sm text-gray-300 font-mono whitespace-nowrap">{assoc.foundationDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatCard({ stat }: { stat: Statistic }) {
  const colors = getProgressColor(stat.progress)
  return (
    <div
      className="rounded-2xl p-5 transition-all duration-300"
      style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: `1.5px solid ${colors.border}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.boxShadow = `0 0 25px -5px ${colors.bar}30`
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <p className="text-sm text-gray-300 mb-3 leading-relaxed">{stat.activity}</p>

      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-3xl font-bold" style={{ color: colors.text }}>
          {stat.value.toLocaleString('ar-DZ')}
        </span>
        <span className="text-sm text-gray-500">/ {stat.target.toLocaleString('ar-DZ')}</span>
      </div>

      <div
        className="w-full h-2 rounded-full mb-3 overflow-hidden"
        style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(stat.progress, 100)}%`,
            backgroundColor: colors.bar,
            boxShadow: `0 0 8px ${colors.bar}60`,
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: colors.text }}>
          {stat.progress}%
        </span>
        <div className="flex items-center gap-1">
          <Calendar size={12} className="text-gray-500" />
          <span className="text-xs text-gray-500">{stat.period}</span>
        </div>
      </div>
    </div>
  )
}

export default function ActivitiesPage() {
  const [associations, setAssociations] = useState<Association[]>([])
  const [statistics, setStatistics] = useState<Statistic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAssociations(), getStatistics()])
      .then(([assocData, statsData]) => {
        setAssociations(assocData)
        setStatistics(statsData)
      })
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
          backgroundImage: 'url("/images/cultural-festival.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
          filter: 'blur(44px)',
        }}
      />

      <div
        className="fixed bottom-[-10%] left-[-5%] w-[45%] h-[45%] pointer-events-none z-[1]"
        style={{
          backgroundImage: 'url("/images/music-concert.jpg")',
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
              <Users size={16} style={{ color: COPPER }} />
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
                مصلحة النشاطات الثقافية
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light">
              سجل الجمعيات الثقافية والإحصائيات الدورية لولاية خنشلة
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
                    <BookOpen size={18} style={{ color: COPPER }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">سجل الجمعيات</h2>
                    <p className="text-xs text-gray-400">إجمالي الجمعيات المسجلة: {associations.length}</p>
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
                  <AssociationsTable data={associations} />
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.25)' }}
                  >
                    <BarChart3 size={18} style={{ color: '#22D3EE' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">الإحصائيات الدورية</h2>
                    <p className="text-xs text-gray-400">مؤشرات الأداء والإنجاز</p>
                  </div>
                </div>

                {statistics.length === 0 ? (
                  <div
                    className="rounded-2xl flex flex-col items-center justify-center py-16 text-center"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      border: '1.5px solid rgba(255,255,255,0.10)',
                    }}
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.25)' }}
                    >
                      <BarChart3 size={28} style={{ color: '#22D3EE' }} />
                    </div>
                    <p className="text-white font-semibold mb-2">لا توجد بيانات متاحة حالياً</p>
                    <p className="text-sm" style={{ color: '#64748B' }}>سيتم عرض الإحصائيات هنا بعد إضافتها من لوحة الإدارة</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {statistics.map((stat) => (
                      <StatCard key={stat.id} stat={stat} />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
