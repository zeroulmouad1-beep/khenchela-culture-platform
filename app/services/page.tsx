'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  CreditCard,
  Users,
  ShieldCheck,
  Sparkles,
  Globe,
  ChevronDown,
  ArrowRight,
  Home,
  Film,
  Award,
  ExternalLink,
} from 'lucide-react'

// Deep Indigo & Copper palette
const COPPER = '#c9952a'
const COPPER_LIGHT = '#e0b060'
const INDIGO_DEEP = '#1a0f0a'

const serviceCategories = [
  {
    id: 'membership',
    title: 'العضوية والتسجيل',
    icon: Users,
    description: 'بطاقات مهنية معتمدة للفنانين والعاملين في مجال السينما',
    services: [
      {
        title: 'بطاقة فنان',
        subtitle: 'Carte d\'artiste',
        description: 'للولوج إلى منصة طلب بطاقة الفنان ندعوكم للتسجيل عبر زيارة موقع وزارة الثقافة والفنون',
        icon: CreditCard,
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_20260329_205618_511-d9gmSLBrj1Wqr5wkve47lxeTFzFeKE.jpg',
        url: 'https://carteartiste.e-servicesculture.dz/L19/Identification.php',
        buttonText: 'سجل الآن',
      },
      {
        title: 'البطاقة المهنية للسينما',
        subtitle: 'Carte professionnelle du cinéma',
        description: 'للولوج إلى منصة طلب البطاقة المهنية للسينما ندعوكم للتسجيل عبر زيارة موقع وزارة الثقافة والفنون',
        icon: Film,
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_20260329_205618_142-VNxQSvv4yjXMb0BdO0hSdmhshg18UV.jpg',
        url: 'https://e-servicesculture.dz/cartecinema/',
        buttonText: 'سجل الآن',
      },
      {
        title: 'بوابة الخدمات عن بعد',
        subtitle: 'Services Portal',
        description: 'للولوج إلى منصة بوابة الخدمات عن بعد لوزارة الثقافة والفنون ندعوكم للتسجيل',
        icon: Globe,
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_20260329_205645_380-Tw4u1PdtfhfThUJTaZ6HEu7Xqx0vqG.jpg',
        url: 'https://e-servicesculture.dz/',
        buttonText: 'ادخل البوابة',
      },
    ],
  },
  {
    id: 'opportunities',
    title: 'الفرص والمنح',
    icon: Sparkles,
    description: 'برامج الدعم المالي والمنح للجمعيات والمشاريع الثقافية',
    services: [
      {
        title: 'الدعم العمومي لمشاريع الجمعيات 2024',
        subtitle: 'Support for Association Projects',
        description: 'للولوج إلى منصة لطلب دعم مالي للجمعيات الثقافية والفنية ابتداءً من 14 ديسمبر 2023',
        icon: Award,
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_20260329_205623_570-cWazLxPM8GDsImXBraSsafxcz1yC9k.jpg',
        url: 'https://e-servicesculture.dz/appui-association/',
        buttonText: 'تقدم بطلب المنحة',
      },
      {
        title: 'دعم الانتاج السينيمائي',
        subtitle: 'Cinema Production Support',
        description: 'للولوج إلى منصة طلب دعم الانتاج السينيمائي عبر زيارة موقع وزارة الثقافة والفنون',
        icon: Film,
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_20260329_205618_250-XA3pr1GGfF9YDLLrm4V4o8E8JPjk0W.jpg',
        url: 'https://e-servicesculture.dz/aidecinema/',
        buttonText: 'تقدم بطلب الدعم',
      },
    ],
  },
  {
    id: 'portals',
    title: 'البوابات الرقمية',
    icon: Globe,
    description: 'منصات وزارة الثقافة والفنون الرسمية',
    services: [
      {
        title: 'منصة الفنان الجزائري - Artio',
        subtitle: 'Algerian Artist Platform',
        description: 'للولوج إلى موقع وزارة الثقافة والفنون - منصة الفنان الجزائري الرسمية',
        icon: Globe,
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_20260329_205618_452-T4t1lO4ADAeQaJ5aLqFhc7rg7Sguff.jpg',
        url: 'https://www.m-culture.gov.dz/index.php/ar/',
        buttonText: 'سجل في البوابة',
      },
      {
        title: 'الصفحة الرسمية للمديرية',
        subtitle: 'Official Directorate Page',
        description: 'للولوج إلى الصفحة الرسمية لمديرية الثقافة والفنون لولاية خنشلة',
        icon: ShieldCheck,
        image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_20260329_205634_795-DHrgSPjCeTpD8Al87YlsEtlxcdHpS6.jpg',
        url: '#',
        buttonText: 'زيارة الصفحة',
      },
    ],
  },
]

export default function ServicesPortal() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('membership')

  return (
    <div
      className="min-h-screen"
      dir="rtl"
      style={{ backgroundColor: INDIGO_DEEP }}
    >
      {/* Geometric Pattern Background */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B87333' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient Glow */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${COPPER}40 0%, transparent 70%)`,
        }}
      />

      {/* Header */}
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

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-16">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: COPPER }}
            >
              بوابة الخدمات الإلكترونية
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              خدمات وزارة الثقافة{' '}
              <span style={{ color: COPPER_LIGHT }}>والفنون</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light">
              اكتشف جميع الخدمات الإلكترونية المتاحة لدعم مسيرتك الفنية والثقافية
            </p>
          </div>

          {/* Accordion Categories */}
          <div className="space-y-6">
            {serviceCategories.map((category) => {
              const CategoryIcon = category.icon
              const isExpanded = expandedCategory === category.id

              return (
                <div
                  key={category.id}
                  className="rounded-2xl overflow-hidden transition-all duration-500"
                  style={{
                    backgroundColor: isExpanded ? '#1e1610' : '#1a0f0a',
                    border: `2px solid ${isExpanded ? COPPER : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: isExpanded ? `0 20px 50px -10px ${COPPER}20` : 'none',
                  }}
                >
                  {/* Category Header */}
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-right transition-all duration-300 hover:bg-white/5"
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
                        style={{
                          backgroundColor: isExpanded ? COPPER : `${COPPER}20`,
                          boxShadow: isExpanded ? `0 8px 30px ${COPPER}40` : 'none',
                        }}
                      >
                        <CategoryIcon
                          size={26}
                          style={{ color: isExpanded ? '#fff' : COPPER }}
                        />
                      </div>
                      <div className="text-right">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{category.title}</h2>
                        <p className="text-sm text-gray-400">{category.description}</p>
                      </div>
                    </div>
                    <ChevronDown
                      size={28}
                      className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}
                      style={{ color: COPPER }}
                    />
                  </button>

                  {/* Services Grid */}
                  <div
                    className={`overflow-hidden transition-all duration-700 ease-in-out ${
                      isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-6 md:p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {category.services.map((service, idx) => {
                        const ServiceIcon = service.icon
                        return (
                          <div
                            key={idx}
                            className="group rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
                            style={{
                              backgroundColor: '#0f1726',
                              border: `1px solid ${COPPER}30`,
                            }}
                          >
                            {/* Service Image */}
                            <div className="relative h-56 md:h-64 overflow-hidden">
                              <Image
                                src={service.image}
                                alt={service.title}
                                fill
                                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                              />
                              <div
                                className="absolute inset-0"
                                style={{
                                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.3) 50%, transparent 100%)',
                                }}
                              />
                              
                              {/* Icon Badge */}
                              <div
                                className="absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                style={{
                                  backgroundColor: `${COPPER}90`,
                                  boxShadow: `0 4px 20px ${COPPER}50`,
                                }}
                              >
                                <ServiceIcon size={22} className="text-white" />
                              </div>
                            </div>

                            {/* Service Content */}
                            <div className="p-6">
                              <div className="mb-4">
                                <h3 className="text-white text-lg font-bold mb-1">{service.title}</h3>
                                <p className="text-xs font-medium" style={{ color: COPPER_LIGHT }}>{service.subtitle}</p>
                              </div>
                              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                {service.description}
                              </p>
                              
                              {/* Action Button */}
                              <a
                                href={service.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                style={{
                                  backgroundColor: COPPER,
                                  color: '#fff',
                                  boxShadow: `0 4px 20px ${COPPER}40`,
                                }}
                                onMouseEnter={(e) => {
                                  const el = e.currentTarget
                                  el.style.backgroundColor = COPPER_LIGHT
                                  el.style.boxShadow = `0 8px 30px ${COPPER}60`
                                  el.style.transform = 'translateY(-2px)'
                                }}
                                onMouseLeave={(e) => {
                                  const el = e.currentTarget
                                  el.style.backgroundColor = COPPER
                                  el.style.boxShadow = `0 4px 20px ${COPPER}40`
                                  el.style.transform = 'translateY(0)'
                                }}
                              >
                                <span>{service.buttonText}</span>
                                <ExternalLink size={16} className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                              </a>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* QR Code Notice */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              يمكنكم أيضاً الوصول لهذه الخدمات عبر مسح رمز الاستجابة السريع (QR Code) الموجود في كل بطاقة خدمة
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
