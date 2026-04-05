'use client'

import Link from 'next/link'
import { ArrowRight, Home, MapPin, Phone, Mail, Clock, Calendar, Newspaper, Palette, Film, BookOpen, Music, Drama, LucideIcon, Theater, Paintbrush, BookText, Video, Landmark, Coffee, Users, GraduationCap } from 'lucide-react'
import { useCms } from '@/lib/cms-context'

const COPPER = '#B87333'
const COPPER_LIGHT = '#D4956A'
const INDIGO_DEEP = '#0F172A'
const INDIGO_MEDIUM = '#1E293B'
const INDIGO_LIGHT = '#334155'

type IconName = 'palette' | 'film' | 'book-open' | 'music' | 'drama'
const iconMap: Record<IconName, LucideIcon> = {
  'palette': Palette,
  'film': Film,
  'book-open': BookOpen,
  'music': Music,
  'drama': Drama,
}

const workshopIconMap: Record<string, LucideIcon> = {
  'Theater': Theater,
  'Paintbrush': Paintbrush,
  'BookText': BookText,
  'Video': Video,
  'Music': Music,
  'Landmark': Landmark,
  'Palette': Palette,
  'Film': Film,
  'BookOpen': BookOpen,
  'GraduationCap': GraduationCap,
  'Coffee': Coffee,
  'Users': Users,
  'Drama': Drama,
}

interface InstitutionDetailProps {
  institutionId: string
}

export function InstitutionDetail({ institutionId }: InstitutionDetailProps) {
  const { institutions, libraryAnnexes, workshops, facilities, loading } = useCms()
  const institution = institutions.find(i => i.id === institutionId)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: INDIGO_DEEP }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: `${COPPER}30`, borderTopColor: COPPER }} />
          <p className="text-white text-lg">جاري التحميل...</p>
        </div>
      </div>
    )
  }
  
  if (!institution) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: INDIGO_DEEP }}>
        <p className="text-white text-xl">المؤسسة غير موجودة</p>
      </div>
    )
  }

  const Icon = iconMap[institution.iconName]

  return (
    <div className="min-h-screen" style={{ backgroundColor: INDIGO_DEEP }}>
      {/* Navigation Bar */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 border-b h-16 flex items-center"
        style={{ backgroundColor: INDIGO_DEEP, borderColor: INDIGO_LIGHT }}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Back Buttons */}
          <div className="flex items-center gap-2">
            <Link 
              href="/?enter=true"
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              style={{ 
                backgroundColor: INDIGO_MEDIUM,
                color: COPPER_LIGHT,
              }}
            >
              <ArrowRight size={20} />
              <span className="font-medium">العودة للرئيسية</span>
            </Link>
            <Link 
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              style={{ 
                backgroundColor: INDIGO_MEDIUM,
                color: COPPER_LIGHT,
              }}
            >
              <Home size={20} />
              <span className="font-medium">صفحة الترحيب</span>
            </Link>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold" style={{ color: COPPER }}>
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
              style={{ backgroundColor: COPPER }}
            >
              ق
            </div>
            <span>منصة</span>
          </Link>
        </div>
      </nav>

      {/* Hero Header Section */}
      <header className="relative pt-16 h-[50vh] min-h-[400px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={institution.image}
            alt={institution.title}
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${INDIGO_DEEP} 0%, rgba(15, 23, 42, 0.7) 50%, rgba(15, 23, 42, 0.4) 100%)`,
            }}
          />
        </div>

        {/* Ambient Glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${institution.iconBg}50 0%, transparent 70%)`,
          }}
        />

        {/* Header Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg"
                style={{ 
                  backgroundColor: institution.iconBg,
                  boxShadow: `0 0 30px ${institution.iconBg}60`,
                }}
              >
                <Icon size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-1">
                  {institution.title}
                </h1>
                {institution.subtitle && (
                  <p className="text-xl md:text-2xl font-medium mb-2" style={{ color: COPPER }}>
                    {institution.subtitle}
                  </p>
                )}
                {institution.description && (
                  <p className="text-lg" style={{ color: COPPER_LIGHT }}>
                    {institution.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <section 
                className="rounded-2xl p-8 border"
                style={{ backgroundColor: INDIGO_MEDIUM, borderColor: `${COPPER}30` }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">نبذة عن المؤسسة</h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {institution.fullDescription}
                </p>
              </section>

              {/* Gallery Section */}
              <section 
                className="rounded-2xl p-8 border"
                style={{ backgroundColor: INDIGO_MEDIUM, borderColor: `${COPPER}30` }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">معرض الصور</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {institution.gallery.map((img, idx) => (
                    <div 
                      key={idx}
                      className="relative h-48 rounded-xl overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={img}
                        alt={`${institution.title} - صورة ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ backgroundColor: `${institution.iconBg}30` }}
                      />
                    </div>
                  ))}
                  {/* Placeholder for more images */}
                  <div 
                    className="h-48 rounded-xl border-2 border-dashed flex items-center justify-center"
                    style={{ borderColor: INDIGO_LIGHT }}
                  >
                    <p className="text-gray-500">المزيد من الصور قريباً</p>
                  </div>
                </div>
              </section>

              {/* Future Events Section - Placeholder */}
              <section 
                className="rounded-2xl p-8 border"
                style={{ backgroundColor: INDIGO_MEDIUM, borderColor: `${COPPER}30` }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Calendar size={24} style={{ color: COPPER }} />
                  <h2 className="text-2xl font-bold text-white">الفعاليات القادمة</h2>
                </div>
                <div 
                  className="h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3"
                  style={{ borderColor: INDIGO_LIGHT }}
                >
                  <Calendar size={40} className="text-gray-500" />
                  <p className="text-gray-500 text-center">
                    سيتم ربط الفعاليات بقاعدة البيانات قريباً
                    <br />
                    <span className="text-sm">(Firebase Integration)</span>
                  </p>
                </div>
              </section>

              {/* Future News Section - Placeholder */}
              <section 
                className="rounded-2xl p-8 border"
                style={{ backgroundColor: INDIGO_MEDIUM, borderColor: `${COPPER}30` }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Newspaper size={24} style={{ color: COPPER }} />
                  <h2 className="text-2xl font-bold text-white">آخر الأخبار</h2>
                </div>
                <div 
                  className="h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3"
                  style={{ borderColor: INDIGO_LIGHT }}
                >
                  <Newspaper size={40} className="text-gray-500" />
                  <p className="text-gray-500 text-center">
                    سيتم ربط الأخبار بقاعدة البيانات قريباً
                    <br />
                    <span className="text-sm">(Firebase Integration)</span>
                  </p>
                </div>
              </section>

              {institutionId === 'library' && (
                <section
                  className="rounded-2xl p-8 border"
                  style={{ backgroundColor: INDIGO_MEDIUM, borderColor: `${COPPER}30` }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${COPPER_LIGHT}20`, border: `1px solid ${COPPER_LIGHT}40` }}
                    >
                      <MapPin size={20} style={{ color: COPPER_LIGHT }} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">ملحقات المكتبة عبر الولاية</h2>
                      <p className="text-sm text-gray-400">{libraryAnnexes.length} ملحقات موزعة عبر بلديات ولاية خنشلة</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {libraryAnnexes.map((annex) => {
                      const AnnexIcon = annex.type === 'ريفية' ? MapPin : BookOpen
                      return (
                      <div
                        key={annex.id}
                        className="rounded-xl p-4 border transition-all duration-300 hover:scale-[1.02]"
                        style={{
                          backgroundColor: 'rgba(30,41,59,0.6)',
                          backdropFilter: 'blur(12px)',
                          borderColor: annex.type === 'ريفية' ? 'rgba(34,197,94,0.25)' : 'rgba(59,130,246,0.25)',
                        }}
                      >
                        <div className="flex items-center gap-3" dir="rtl">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: annex.type === 'ريفية' ? 'rgba(34,197,94,0.12)' : 'rgba(59,130,246,0.12)',
                            }}
                          >
                            <AnnexIcon
                              size={16}
                              style={{ color: annex.type === 'ريفية' ? '#22C55E' : '#3B82F6' }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm">{annex.name}</p>
                          </div>
                          <span
                            className="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                            style={{
                              backgroundColor: annex.type === 'ريفية' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)',
                              color: annex.type === 'ريفية' ? '#4ADE80' : '#60A5FA',
                              border: `1px solid ${annex.type === 'ريفية' ? 'rgba(34,197,94,0.3)' : 'rgba(59,130,246,0.3)'}`,
                            }}
                          >
                            {annex.type}
                          </span>
                        </div>
                      </div>
                    )})}
                  </div>
                </section>
              )}

              {institutionId === 'culture-house' && (
                <section
                  className="rounded-2xl p-6 sm:p-8 border"
                  style={{ backgroundColor: INDIGO_MEDIUM, borderColor: `${COPPER}30` }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${COPPER_LIGHT}20`, border: `1px solid ${COPPER_LIGHT}40` }}
                    >
                      <GraduationCap size={20} style={{ color: COPPER_LIGHT }} />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>الجناح البيداغوجي</h2>
                      <p className="text-sm text-gray-400" style={{ fontFamily: 'Tajawal, sans-serif' }}>{workshops.length} ورشات تكوينية وإبداعية</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {workshops.map((workshop) => {
                      const WorkshopIcon = workshopIconMap[workshop.iconName] || Theater
                      return (
                        <div
                          key={workshop.id}
                          className="rounded-xl p-4 border transition-all duration-300 hover:scale-[1.02]"
                          style={{
                            backgroundColor: 'rgba(30,41,59,0.6)',
                            backdropFilter: 'blur(12px)',
                            borderColor: `${COPPER}25`,
                          }}
                        >
                          <div className="flex items-center gap-3" dir="rtl">
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${COPPER}15` }}
                            >
                              <WorkshopIcon size={16} style={{ color: COPPER_LIGHT }} />
                            </div>
                            <p className="text-white font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{workshop.name}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

              {institutionId === 'culture-house' && (
                <section
                  className="rounded-2xl p-6 sm:p-8 border"
                  style={{ backgroundColor: INDIGO_MEDIUM, borderColor: `${COPPER}30` }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${COPPER_LIGHT}20`, border: `1px solid ${COPPER_LIGHT}40` }}
                    >
                      <Landmark size={20} style={{ color: COPPER_LIGHT }} />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرافق والمصالح</h2>
                      <p className="text-sm text-gray-400" style={{ fontFamily: 'Tajawal, sans-serif' }}>المرافق المستقلة التابعة لدار الثقافة</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {facilities.map((facility) => {
                      const FacilityIcon = workshopIconMap[facility.iconName] || Landmark
                      return (
                        <div
                          key={facility.id}
                          className="rounded-xl p-4 border transition-all duration-300 hover:scale-[1.02]"
                          style={{
                            backgroundColor: 'rgba(30,41,59,0.6)',
                            backdropFilter: 'blur(12px)',
                            borderColor: `${COPPER}25`,
                          }}
                        >
                          <div className="flex items-center gap-3" dir="rtl">
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${COPPER}15` }}
                            >
                              <FacilityIcon size={16} style={{ color: COPPER_LIGHT }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>{facility.name}</p>
                              {facility.subtitle && (
                                <p className="text-xs mt-0.5" style={{ color: COPPER, fontFamily: 'Amiri, serif' }}>{facility.subtitle}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info Card */}
              <aside 
                className="rounded-2xl p-6 border sticky top-24"
                style={{ backgroundColor: INDIGO_MEDIUM, borderColor: `${COPPER}30` }}
              >
                <h3 className="text-xl font-bold text-white mb-6">معلومات التواصل</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={20} style={{ color: COPPER_LIGHT }} className="flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm mb-1">العنوان</p>
                      <p className="text-white">{institution.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={20} style={{ color: COPPER_LIGHT }} className="flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm mb-1">الهاتف</p>
                      <p className="text-white" dir="ltr">{institution.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail size={20} style={{ color: COPPER_LIGHT }} className="flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm mb-1">البريد الإلكتروني</p>
                      <p className="text-white text-sm" dir="ltr">{institution.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={20} style={{ color: COPPER_LIGHT }} className="flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm mb-1">أوقات العمل</p>
                      <p className="text-white">{institution.workingHours}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  className="w-full mt-6 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                  style={{ 
                    backgroundColor: COPPER,
                    boxShadow: `0 4px 20px ${COPPER}40`,
                  }}
                >
                  تواصل معنا
                </button>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
