'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchCollection, FirestoreDoc } from '@/lib/firestore-helpers'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend, Area, AreaChart,
} from 'recharts'
import {
  ArrowRight, Calendar, Users, Star, Building2,
  TrendingUp, Loader2, BarChart2, Award,
} from 'lucide-react'

const COPPER      = '#c9952a'
const COPPER_LIGHT = '#e0b060'
const COPPER_DIM  = '#7a5a20'
const INDIGO_DEEP  = '#1a0f0a'
const INDIGO_MEDIUM = '#1e1610'
const INDIGO_LIGHT  = '#2a1e14'

const PIE_COLORS = ['#c9952a', '#e0b060', '#a07828', '#f0c060', '#8a6018', '#d4a040']

// ── tiny components ──────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: 20, fontWeight: 700, color: '#f0e6d3', fontFamily: 'Tajawal, sans-serif',
      margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 10,
    }}>
      {children}
    </h2>
  )
}

function SectionSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 13, color: '#a89070', fontFamily: 'Tajawal, sans-serif', margin: '0 0 24px' }}>
      {children}
    </p>
  )
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      backgroundColor: INDIGO_MEDIUM, border: `1px solid ${INDIGO_LIGHT}`,
      borderRadius: 14, padding: 24, ...style,
    }}>
      {children}
    </div>
  )
}

function KpiCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string | number; sub?: string }) {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          backgroundColor: `${COPPER}18`, border: `1px solid ${COPPER}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#a89070', fontFamily: 'Tajawal, sans-serif', margin: '0 0 4px' }}>{label}</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif', margin: 0, lineHeight: 1 }}>
            {typeof value === 'number' ? value.toLocaleString('ar-DZ') : value}
          </p>
          {sub && <p style={{ fontSize: 11, color: '#7a6a5a', fontFamily: 'Tajawal, sans-serif', marginTop: 4 }}>{sub}</p>}
        </div>
      </div>
    </Card>
  )
}

// Custom tooltip for charts
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      backgroundColor: '#2a1e14', border: `1px solid ${COPPER}50`,
      borderRadius: 8, padding: '10px 14px', fontFamily: 'Tajawal, sans-serif',
    }}>
      <p style={{ fontSize: 13, color: COPPER_LIGHT, margin: '0 0 4px', fontWeight: 700 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ fontSize: 13, color: '#f0e6d3', margin: 0 }}>
          {p.name}: <strong>{Number(p.value).toLocaleString('ar-DZ')}</strong>
        </p>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────

export default function StatisticsPage() {
  const [data, setData] = useState<FirestoreDoc | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const docs = await fetchCollection('culturalStats')
        if (docs.length > 0) setData(docs[0])
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: INDIGO_DEEP, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={36} className="animate-spin" style={{ color: COPPER }} />
      </div>
    )
  }

  const totalEvents          = (data?.totalEvents          as number) || 0
  const totalAttendance      = (data?.totalAttendance      as number) || 0
  const localArtists         = (data?.localArtists         as number) || 0
  const culturalInstitutions = (data?.culturalInstitutions as number) || 0
  const featuredEventName    = (data?.featuredEventName    as string) || ''
  const featuredEventAtt     = (data?.featuredEventAttendance as number) || 0
  const monthlyEvents  = (data?.monthlyEvents   as any[]) || []
  const attendanceGrowth = (data?.attendanceGrowth as any[]) || []
  const eventTypes     = (data?.eventTypes      as any[]) || []

  const hasData = totalEvents > 0 || totalAttendance > 0

  return (
    <div dir="rtl" style={{ minHeight: '100vh', backgroundColor: INDIGO_DEEP }}>

      {/* ── Hero banner ── */}
      <div style={{
        background: `linear-gradient(135deg, #1e1208 0%, #1a0f0a 50%, #261408 100%)`,
        borderBottom: `1px solid ${INDIGO_LIGHT}`,
        padding: '48px 24px 40px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative rings */}
        <div style={{ position: 'absolute', top: -60, left: -60, width: 240, height: 240, borderRadius: '50%', border: `1px solid ${COPPER}15`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -30, left: -30, width: 160, height: 160, borderRadius: '50%', border: `1px solid ${COPPER}10`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Link
            href="/?enter=true"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 13, color: '#a89070', textDecoration: 'none',
              marginBottom: 20, fontFamily: 'Tajawal, sans-serif',
            }}
          >
            <ArrowRight size={15} />
            العودة للرئيسية
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <div style={{
              width: 54, height: 54, borderRadius: 14,
              backgroundColor: `${COPPER}20`, border: `1px solid ${COPPER}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BarChart2 size={26} style={{ color: COPPER }} />
            </div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f0e6d3', fontFamily: 'Tajawal, sans-serif', margin: 0 }}>
                إحصائيات النشاطات الثقافية
              </h1>
              <p style={{ fontSize: 14, color: '#a89070', fontFamily: 'Tajawal, sans-serif', margin: '4px 0 0' }}>
                مصلحة النشاطات الثقافية — مديرية الثقافة والفنون خنشلة
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 60px' }}>

        {!hasData ? (
          /* ── Empty state ── */
          <Card style={{ textAlign: 'center', padding: '60px 24px' }}>
            <BarChart2 size={48} style={{ color: COPPER_DIM, margin: '0 auto 16px' }} />
            <p style={{ fontSize: 16, color: '#a89070', fontFamily: 'Tajawal, sans-serif', margin: '0 0 8px' }}>
              لا توجد إحصائيات متاحة حالياً
            </p>
            <p style={{ fontSize: 13, color: '#5a4a3a', fontFamily: 'Tajawal, sans-serif', margin: 0 }}>
              يمكن للمدير إضافة البيانات من لوحة الإدارة
            </p>
          </Card>
        ) : (
          <>
            {/* ── KPI cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 16, marginBottom: 40 }}>
              <KpiCard
                icon={<Calendar size={22} style={{ color: COPPER }} />}
                label="عدد الفعاليات المنظمة"
                value={totalEvents}
                sub="مجموع الفعاليات الثقافية"
              />
              <KpiCard
                icon={<Users size={22} style={{ color: COPPER }} />}
                label="إجمالي الحضور"
                value={totalAttendance}
                sub="مجموع الحضور في كل الفعاليات"
              />
              <KpiCard
                icon={<Star size={22} style={{ color: COPPER }} />}
                label="الفنانون المحليون"
                value={localArtists}
                sub="فنان محلي مشارك"
              />
              <KpiCard
                icon={<Building2 size={22} style={{ color: COPPER }} />}
                label="المؤسسات الثقافية"
                value={culturalInstitutions}
                sub="مؤسسة مشاركة"
              />
            </div>

            {/* ── Featured event card ── */}
            {featuredEventName && (
              <Card style={{
                marginBottom: 40,
                background: `linear-gradient(135deg, ${INDIGO_MEDIUM} 0%, #221408 100%)`,
                border: `1px solid ${COPPER}40`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    backgroundColor: `${COPPER}20`, border: `1px solid ${COPPER}60`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Award size={24} style={{ color: COPPER }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, color: COPPER_DIM, fontFamily: 'Tajawal, sans-serif', margin: '0 0 4px', fontWeight: 600, letterSpacing: '0.05em' }}>
                      ★ الفعالية الأكثر شعبية
                    </p>
                    <p style={{ fontSize: 20, fontWeight: 700, color: '#f0e6d3', fontFamily: 'Tajawal, sans-serif', margin: 0 }}>
                      {featuredEventName}
                    </p>
                  </div>
                  {featuredEventAtt > 0 && (
                    <div style={{ textAlign: 'center', borderRight: `1px solid ${COPPER}30`, paddingRight: 24, marginRight: 8 }}>
                      <p style={{ fontSize: 32, fontWeight: 800, color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif', margin: 0, lineHeight: 1 }}>
                        {featuredEventAtt.toLocaleString('ar-DZ')}
                      </p>
                      <p style={{ fontSize: 12, color: '#a89070', fontFamily: 'Tajawal, sans-serif', margin: '4px 0 0' }}>حاضر</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* ── Charts row 1: Bar + Line ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: 20, marginBottom: 20 }}>

              {/* Monthly events bar chart */}
              {monthlyEvents.length > 0 && (
                <Card>
                  <SectionTitle>
                    <Calendar size={18} style={{ color: COPPER }} />
                    عدد الفعاليات المنظمة
                  </SectionTitle>
                  <SectionSubtitle>التوزيع الشهري للفعاليات الثقافية خلال السنة</SectionSubtitle>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={monthlyEvents} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={`${COPPER}15`} />
                      <XAxis dataKey="month" tick={{ fill: '#a89070', fontSize: 11, fontFamily: 'Tajawal, sans-serif' }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: '#a89070', fontSize: 11 }} tickLine={false} axisLine={false} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: `${COPPER}10` }} />
                      <Bar dataKey="count" name="الفعاليات" fill={COPPER} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* Attendance growth area chart */}
              {attendanceGrowth.length > 0 && (
                <Card>
                  <SectionTitle>
                    <TrendingUp size={18} style={{ color: COPPER }} />
                    نمو الحضور الشهري
                  </SectionTitle>
                  <SectionSubtitle>تطور أعداد الحضور عبر أشهر السنة</SectionSubtitle>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={attendanceGrowth} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
                      <defs>
                        <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor={COPPER} stopOpacity={0.35} />
                          <stop offset="95%" stopColor={COPPER} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={`${COPPER}15`} />
                      <XAxis dataKey="month" tick={{ fill: '#a89070', fontSize: 11, fontFamily: 'Tajawal, sans-serif' }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: '#a89070', fontSize: 11 }} tickLine={false} axisLine={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="count" name="الحضور" stroke={COPPER} strokeWidth={2.5} fill="url(#attendGrad)" dot={{ fill: COPPER, r: 3, strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              )}
            </div>

            {/* ── Charts row 2: Pie chart ── */}
            {eventTypes.length > 0 && (
              <Card>
                <SectionTitle>
                  <TrendingUp size={18} style={{ color: COPPER }} />
                  توزيع أنواع الفعاليات
                </SectionTitle>
                <SectionSubtitle>نسبة كل نوع من أنواع الفعاليات الثقافية المنظمة</SectionSubtitle>

                <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
                  <ResponsiveContainer width={260} height={260} minWidth={220}>
                    <PieChart>
                      <Pie
                        data={eventTypes}
                        dataKey="count"
                        nameKey="type"
                        cx="50%" cy="50%"
                        outerRadius={110}
                        innerRadius={55}
                        paddingAngle={3}
                        label={({ cx, cy, midAngle, outerRadius: r, percent }) => {
                          const RADIAN = Math.PI / 180
                          const x = cx + (r + 18) * Math.cos(-midAngle * RADIAN)
                          const y = cy + (r + 18) * Math.sin(-midAngle * RADIAN)
                          return percent > 0.04 ? (
                            <text x={x} y={y} fill={COPPER_LIGHT} fontSize={12} textAnchor="middle" dominantBaseline="central" fontFamily="Tajawal, sans-serif">
                              {`${(percent * 100).toFixed(0)}٪`}
                            </text>
                          ) : null
                        }}
                      >
                        {eventTypes.map((_: any, i: number) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any, name: any) => [Number(value).toLocaleString('ar-DZ'), name]}
                        contentStyle={{ backgroundColor: '#2a1e14', border: `1px solid ${COPPER}50`, borderRadius: 8, fontFamily: 'Tajawal, sans-serif' }}
                        labelStyle={{ color: COPPER_LIGHT }}
                        itemStyle={{ color: '#f0e6d3' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Legend */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 180 }}>
                    {eventTypes.map((t: any, i: number) => {
                      const total = eventTypes.reduce((s: number, r: any) => s + (r.count || 0), 0)
                      const pct = total > 0 ? Math.round((t.count / total) * 100) : 0
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                              <span style={{ fontSize: 13, color: '#f0e6d3', fontFamily: 'Tajawal, sans-serif' }}>{t.type}</span>
                              <span style={{ fontSize: 13, color: COPPER_LIGHT, fontFamily: 'Tajawal, sans-serif', fontWeight: 700 }}>
                                {(t.count || 0).toLocaleString('ar-DZ')}
                              </span>
                            </div>
                            <div style={{ height: 4, borderRadius: 2, backgroundColor: INDIGO_LIGHT, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${pct}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length], borderRadius: 2, transition: 'width 0.6s ease' }} />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
