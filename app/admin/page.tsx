'use client'

import { useEffect, useState } from 'react'
import { AdminGuard } from '@/lib/auth-context'
import { AdminShell } from '@/components/admin/admin-shell'
import { isMockMode } from '@/lib/firestore-helpers'
import { mockGetCounts } from '@/lib/mock-data'
import { useCms } from '@/lib/cms-context'
import { db } from '@/lib/firebase'
import { collection, getCountFromServer } from 'firebase/firestore'
import Link from 'next/link'
import {
  Newspaper, Settings, Calendar, Building2,
  BookMarked, Home, Mountain, TrendingUp, Landmark
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const COPPER = '#B87333'
const COPPER_LIGHT = '#D4956A'
const INDIGO_MEDIUM = '#1E293B'
const INDIGO_LIGHT = '#334155'

function DashboardContent() {
  const [counts, setCounts] = useState({ news: 0, services: 0, events: 0, artists: 0, associations: 0, monuments: 0 })
  const [loading, setLoading] = useState(true)
  const cms = useCms()

  useEffect(() => {
    async function fetchCounts() {
      try {
        if (isMockMode) {
          setCounts({ ...mockGetCounts(), artists: 0, associations: 0, monuments: 0 })
        } else if (db) {
          const [newsSnap, facilitiesSnap, eventsSnap, artistsSnap, assocSnap, monSnap] = await Promise.all([
            getCountFromServer(collection(db, 'news')),
            getCountFromServer(collection(db, 'facilities')),
            getCountFromServer(collection(db, 'events')),
            getCountFromServer(collection(db, 'artists')),
            getCountFromServer(collection(db, 'associations')),
            getCountFromServer(collection(db, 'nationalMonuments')),
          ])
          setCounts({
            news: newsSnap.data().count,
            services: facilitiesSnap.data().count,
            events: eventsSnap.data().count,
            artists: artistsSnap.data().count,
            associations: assocSnap.data().count,
            monuments: monSnap.data().count,
          })
        }
      } catch {
        setCounts({ news: 0, services: 0, events: 0, artists: 0, associations: 0, monuments: 0 })
      } finally {
        setLoading(false)
      }
    }
    fetchCounts()
  }, [])

  const cmsCards = [
    { label: 'المؤسسات', count: cms.institutions.length, icon: Building2, href: '/admin/institutions', color: '#B87333' },
    { label: 'ملحقات المكتبة', count: cms.libraryAnnexes.length, icon: BookMarked, href: '/admin/library-annexes', color: '#D4956A' },
    { label: 'ورشات دار الثقافة', count: cms.workshops.length, icon: Home, href: '/admin/culture-house', color: '#22C55E' },
    { label: 'مرافق دار الثقافة', count: cms.facilities.length, icon: Home, href: '/admin/culture-house', color: '#3B82F6' },
    { label: 'الأخبار', count: counts.news, icon: Newspaper, href: '/admin/news', color: '#F59E0B' },
    { label: 'الخدمات', count: counts.services, icon: Settings, href: '/admin/services', color: '#8B5CF6' },
    { label: 'الفعاليات', count: counts.events, icon: Calendar, href: '/admin/events', color: '#EC4899' },
    { label: 'أقسام ملف خنشلة', count: cms.khenchelaSections.length, icon: Mountain, href: '/admin/khenchela-profile', color: '#06B6D4' },
    { label: 'مصالح المديرية', count: cms.departments.length, icon: Landmark, href: '/admin/directorate', color: '#10B981' },
    { label: 'الفنانون', count: counts.artists, icon: Landmark, href: '/admin/directorate', color: '#F43F5E' },
    { label: 'الجمعيات', count: counts.associations, icon: Landmark, href: '/admin/directorate', color: '#6366F1' },
  ]

  const barData = [
    { name: 'المؤسسات', value: cms.institutions.length, fill: '#B87333' },
    { name: 'الملحقات', value: cms.libraryAnnexes.length, fill: '#D4956A' },
    { name: 'الورشات', value: cms.workshops.length, fill: '#22C55E' },
    { name: 'المرافق', value: cms.facilities.length, fill: '#3B82F6' },
    { name: 'الأخبار', value: counts.news, fill: '#F59E0B' },
    { name: 'الفعاليات', value: counts.events, fill: '#EC4899' },
  ]

  const pieData = [
    { name: 'شبه حضارية', value: cms.libraryAnnexes.filter(a => a.type === 'شبه حضارية').length },
    { name: 'ريفية', value: cms.libraryAnnexes.filter(a => a.type === 'ريفية').length },
  ]
  const PIE_COLORS = ['#B87333', '#D4956A']

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            مرحباً بك في لوحة الإدارة
          </h2>
          <p className="text-sm" style={{ color: '#94A3B8', fontFamily: 'Amiri, serif' }}>
            إدارة محتوى منصة قطاع الثقافة والفنون - خنشلة
          </p>
        </div>

        {isMockMode && (
          <div className="mb-6 p-3 rounded-lg flex items-center gap-2 text-sm" style={{ backgroundColor: 'rgba(184, 115, 51, 0.12)', border: '1px solid rgba(184, 115, 51, 0.3)', color: '#D4956A', fontFamily: 'Tajawal, sans-serif' }}>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#B87333' }} />
            وضع المعاينة — البيانات تجريبية ولن تُحفظ بعد إعادة التحميل
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {cmsCards.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.label}
                href={card.href}
                className="p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] block"
                style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}20` }}>
                    <Icon size={18} style={{ color: card.color }} />
                  </div>
                  <TrendingUp size={14} style={{ color: '#22C55E' }} />
                </div>
                <p className="text-xl font-bold text-white mb-0.5" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  {loading && (card.label === 'الأخبار' || card.label === 'الخدمات' || card.label === 'الفعاليات') ? '...' : card.count}
                </p>
                <p className="text-xs" style={{ color: '#94A3B8', fontFamily: 'Tajawal, sans-serif' }}>
                  {card.label}
                </p>
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl border p-5" style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}>
            <h3 className="text-sm font-bold text-white mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              إحصائيات المحتوى
            </h3>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={barData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'Tajawal, sans-serif' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: 8, fontFamily: 'Tajawal, sans-serif', fontSize: 12 }}
                    labelStyle={{ color: '#D4956A' }}
                    itemStyle={{ color: '#CBD5E1' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border p-5" style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}>
            <h3 className="text-sm font-bold text-white mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              توزيع ملحقات المكتبة
            </h3>
            <div style={{ width: '100%', height: 220 }} className="flex items-center justify-center">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: 8, fontFamily: 'Tajawal, sans-serif', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-6" style={{ backgroundColor: INDIGO_MEDIUM, borderColor: INDIGO_LIGHT }}>
          <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            دليل سريع
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { text: 'إدارة بيانات المؤسسات الثقافية الخمس', icon: Building2, href: '/admin/institutions' },
              { text: 'إضافة وتعديل ملحقات المكتبة العمومية', icon: BookMarked, href: '/admin/library-annexes' },
              { text: 'إدارة ورشات ومرافق دار الثقافة', icon: Home, href: '/admin/culture-house' },
              { text: 'تحديث محتوى ملف خنشلة الثقافي', icon: Mountain, href: '/admin/khenchela-profile' },
              { text: 'إضافة أخبار ومنشورات جديدة', icon: Newspaper, href: '/admin/news' },
              { text: 'إدارة الفعاليات الثقافية القادمة', icon: Calendar, href: '/admin/events' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.text} href={item.href} className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:scale-[1.01]" style={{ backgroundColor: `${COPPER}08` }}>
                  <Icon size={16} style={{ color: COPPER_LIGHT }} />
                  <span className="text-sm" style={{ color: '#CBD5E1', fontFamily: 'Tajawal, sans-serif' }}>
                    {item.text}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <DashboardContent />
    </AdminGuard>
  )
}
