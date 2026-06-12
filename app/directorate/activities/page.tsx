'use client'

import Link from 'next/link'
import { ArrowRight, Home, Users, BookOpen, BarChart3, Calendar, Star, Building2, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getAssociations, type Association } from '@/lib/activities-data'
import { Loader2 } from 'lucide-react'

const COPPER = '#c9952a'
const COPPER_LIGHT = '#e0b060'
const INDIGO_DEEP = '#1a0f0a'
const INDIGO_DARKER = '#12100e'
const INDIGO_MEDIUM = '#1e1610'
const INDIGO_LIGHT = '#2a1e14'

const ASSOC_HEADERS = ['#', 'اسم الجمعية', 'النوع', 'الرئيس', 'تاريخ التأسيس']

interface CulturalStats {
  totalEvents: number
  totalAttendance: number
  localArtists: number
  culturalInstitutions: number
  featuredEventName: string
  featuredEventAttendance: number
  eventTypes: { type: string; count: number }[]
  monthlyEvents: { month: string; count: number }[]
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
        <p className="text-sm" style={{ color: '#a89070' }}>سيتم عرض سجل الجمعيات هنا بعد إضافته من لوحة الإدارة</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl" style={{ WebkitOverflowScrolling: 'touch' }}>
      <table className="w-full min-w-[700px] text-right" dir="rtl">
        <thead>
          <tr style={{ backgroundColor: 'rgba(201,149,42,0.12)', borderBottom: '1px solid rgba(201,149,42,0.25)' }}>
            {ASSOC_HEADERS.map((header) => (
              <th key={header} className="px-5 py-4 text-sm font-semibold whitespace-nowrap" style={{ color: COPPER }}>
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
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: index % 2 === 0 ? '#1c120c' : '#1a0f0a' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(201,149,42,0.08)' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#1c120c' : '#1a0f0a' }}
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

function KpiCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div
      style={{
        backgroundColor: INDIGO_MEDIUM,
        border: `1.5px solid ${INDIGO_LIGHT}`,
        borderRadius: 16,
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
        backgroundColor: `${COPPER}18`, border: `1px solid ${COPPER}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 12, color: '#a89070', fontFamily: 'Tajawal, sans-serif', margin: '0 0 4px' }}>{label}</p>
        <p style={{ fontSize: 30, fontWeight: 800, color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif', margin: 0, lineHeight: 1 }}>
          {value.toLocaleString('ar-DZ')}
        </p>
      </div>
    </div>
  )
}

function EventTypeBar({ type, count, total }: { type: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: '#f0e6d3', fontFamily: 'Tajawal, sans-serif' }}>{type}</span>
        <span style={{ fontSize: 13, color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
          {count.toLocaleString('ar-DZ')}
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 3, backgroundColor: INDIGO_LIGHT, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, backgroundColor: COPPER, borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: 11, color: '#7a6a5a', fontFamily: 'Tajawal, sans-serif' }}>{pct}٪ من المجموع</span>
    </div>
  )
}

export default function ActivitiesPage() {
  const [associations, setAssociations] = useState<Association[]>([])
  const [stats, setStats] = useState<CulturalStats | null>(null)
  const [assocLoading, setAssocLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    getAssociations()
      .then(setAssociations)
      .finally(() => setAssocLoading(false))
  }, [])

  useEffect(() => {
    fetch('/api/public/culturalStats', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(({ docs }) => {
        if (docs && docs.length > 0) {
          const raw = docs[0]
          setStats({
            totalEvents: raw.totalEvents ?? 0,
            totalAttendance: raw.totalAttendance ?? 0,
            localArtists: raw.localArtists ?? 0,
            culturalInstitutions: raw.culturalInstitutions ?? 0,
            featuredEventName: raw.featuredEventName ?? '',
            featuredEventAttendance: raw.featuredEventAttendance ?? 0,
            eventTypes: Array.isArray(raw.eventTypes) ? raw.eventTypes : [],
            monthlyEvents: Array.isArray(raw.monthlyEvents) ? raw.monthlyEvents : [],
          })
        }
      })
      .catch(err => console.error('[activities] failed to load culturalStats:', err))
      .finally(() => setStatsLoading(false))
  }, [])

  const loading = assocLoading || statsLoading

  const eventTypesTotal = stats?.eventTypes.reduce((s, r) => s + (r.count || 0), 0) ?? 0

  return (
    <div
      className="min-h-screen"
      dir="rtl"
      style={{ background: `linear-gradient(180deg, ${INDIGO_DEEP} 0%, ${INDIGO_DARKER} 40%, #060A14 100%)` }}
    >
      <div className="fixed top-[-10%] right-[-5%] w-[50%] h-[50%] pointer-events-none z-[1]" style={{ backgroundImage: 'url("/images/cultural-festival.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12, filter: 'blur(44px)' }} />
      <div className="fixed bottom-[-10%] left-[-5%] w-[45%] h-[45%] pointer-events-none z-[1]" style={{ backgroundImage: 'url("/images/music-concert.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.10, filter: 'blur(50px)' }} />
      <div className="fixed inset-0 pointer-events-none z-[2]" style={{ background: `radial-gradient(ellipse at center, ${INDIGO_DEEP}B0 0%, ${INDIGO_DARKER}E6 50%, #060A14F2 100%)` }} />
      <div className="fixed inset-0 opacity-[0.06] pointer-events-none z-[3]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B87333' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] opacity-15 pointer-events-none z-[3]" style={{ background: `radial-gradient(circle, ${COPPER}40 0%, transparent 70%)` }} />

      <header className="relative z-10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/?enter=true" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 group">
              <ArrowRight size={20} className="transition-transform duration-200 group-hover:translate-x-1" />
              <span className="text-sm font-medium">العودة للرئيسية</span>
            </Link>
            <Link href="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 group">
              <Home size={20} className="transition-transform duration-200 group-hover:translate-x-1" />
              <span className="text-sm font-medium">صفحة الترحيب</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${COPPER}18`, border: `1px solid ${COPPER}30` }}>
              <Users size={16} style={{ color: COPPER }} />
              <span className="text-sm font-semibold" style={{ color: COPPER }}>مصالح المديرية</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <span style={{ background: 'linear-gradient(135deg, #c9952a 0%, #e0b060 40%, #c9952a 70%, #8b3a2a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                مصلحة النشاطات الثقافية
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light">
              سجل الجمعيات الثقافية والإحصائيات الدورية لولاية خنشلة
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={32} className="animate-spin" style={{ color: COPPER }} />
            </div>
          ) : (
            <>
              {/* ── Associations table ── */}
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${COPPER}18`, border: `1px solid ${COPPER}30` }}>
                    <BookOpen size={18} style={{ color: COPPER }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">سجل الجمعيات</h2>
                    <p className="text-xs text-gray-400">إجمالي الجمعيات المسجلة: {associations.length}</p>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1e1610', border: '1.5px solid rgba(255,255,255,0.10)' }}>
                  <AssociationsTable data={associations} />
                </div>
              </section>

              {/* ── Live cultural statistics ── */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.25)' }}>
                    <BarChart3 size={18} style={{ color: '#22D3EE' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">الإحصائيات الثقافية</h2>
                    <p className="text-xs text-gray-400">بيانات مباشرة من لوحة الإدارة</p>
                  </div>
                </div>

                {!stats || (stats.totalEvents === 0 && stats.totalAttendance === 0) ? (
                  <div className="rounded-2xl flex flex-col items-center justify-center py-16 text-center" style={{ backgroundColor: '#1e1610', border: '1.5px solid rgba(255,255,255,0.10)' }}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.25)' }}>
                      <BarChart3 size={28} style={{ color: '#22D3EE' }} />
                    </div>
                    <p className="text-white font-semibold mb-2">لا توجد إحصائيات متاحة حالياً</p>
                    <p className="text-sm" style={{ color: '#a89070' }}>سيتم عرض الإحصائيات هنا بعد إضافتها من لوحة الإدارة</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* KPI cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                      <KpiCard icon={<Calendar size={22} style={{ color: COPPER }} />} label="عدد الفعاليات المنظمة" value={stats.totalEvents} />
                      <KpiCard icon={<Users size={22} style={{ color: COPPER }} />} label="إجمالي الحضور" value={stats.totalAttendance} />
                      <KpiCard icon={<Star size={22} style={{ color: COPPER }} />} label="الفنانون المحليون" value={stats.localArtists} />
                      <KpiCard icon={<Building2 size={22} style={{ color: COPPER }} />} label="المؤسسات الثقافية" value={stats.culturalInstitutions} />
                    </div>

                    {/* Featured event */}
                    {stats.featuredEventName && (
                      <div style={{ backgroundColor: INDIGO_MEDIUM, border: `1px solid ${COPPER}40`, borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: `${COPPER}20`, border: `1px solid ${COPPER}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Star size={22} style={{ color: COPPER }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 11, color: '#7a6a5a', fontFamily: 'Tajawal, sans-serif', margin: '0 0 4px', fontWeight: 600, letterSpacing: '0.05em' }}>★ الفعالية الأكثر شعبية</p>
                          <p style={{ fontSize: 18, fontWeight: 700, color: '#f0e6d3', fontFamily: 'Tajawal, sans-serif', margin: 0 }}>{stats.featuredEventName}</p>
                        </div>
                        {stats.featuredEventAttendance > 0 && (
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: 28, fontWeight: 800, color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif', margin: 0, lineHeight: 1 }}>
                              {stats.featuredEventAttendance.toLocaleString('ar-DZ')}
                            </p>
                            <p style={{ fontSize: 12, color: '#a89070', fontFamily: 'Tajawal, sans-serif', margin: '4px 0 0' }}>حاضر</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Event types breakdown */}
                    {stats.eventTypes.length > 0 && (
                      <div style={{ backgroundColor: INDIGO_MEDIUM, border: `1.5px solid ${INDIGO_LIGHT}`, borderRadius: 16, padding: '20px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                          <TrendingUp size={18} style={{ color: COPPER }} />
                          <span style={{ fontSize: 15, fontWeight: 700, color: '#f0e6d3', fontFamily: 'Tajawal, sans-serif' }}>توزيع أنواع الفعاليات</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                          {stats.eventTypes.map((et, i) => (
                            <EventTypeBar key={i} type={et.type} count={et.count} total={eventTypesTotal} />
                          ))}
                        </div>
                      </div>
                    )}
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
