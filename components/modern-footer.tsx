'use client'

import Link from 'next/link'
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'

const GOLD = '#c9952a'
const GOLD_LIGHT = '#e0b060'
const WARM_DARK = '#1a0f0a'
const WARM_BORDER = '#2a1e14'

export function ModernFooter() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Facebook, url: 'https://www.facebook.com/share/1Cb5L3zNjg/', label: 'Facebook' },
    { icon: Instagram, url: '#', label: 'Instagram' },
    { icon: Twitter, url: '#', label: 'Twitter' },
    { icon: Linkedin, url: '#', label: 'LinkedIn' },
  ]

  return (
    <footer className="py-16 md:py-20" style={{ backgroundColor: WARM_DARK, color: '#f0e6d3' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full h-px mb-12" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}50, transparent)` }} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 mb-12">
          {/* Column 1 - Brand */}
          <div>
            <Link href="/?enter=true" className="flex items-center gap-2 mb-4">
              <img
                src="/images/logo-culture.jpg"
                alt="مديرية الثقافة والفنون"
                className="w-10 h-10 rounded-full object-cover"
                style={{ border: `1.5px solid ${GOLD}40` }}
              />
              <span className="text-xl font-bold" style={{ color: '#f0e6d3' }}>منصة</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#a89070' }}>
              منصة قطاع الثقافة والفنون في خنشلة. نافذتكم على الإبداع والتراث الخنشلي الأصيل.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  {...(url !== '#' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 text-sm"
                  style={{
                    border: `1px solid ${GOLD}30`,
                    color: '#a89070',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.backgroundColor = GOLD
                    el.style.borderColor = GOLD
                    el.style.color = '#1a0f0a'
                    el.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.backgroundColor = 'transparent'
                    el.style.borderColor = `${GOLD}30`
                    el.style.color = '#a89070'
                    el.style.transform = 'translateY(0)'
                  }}
                  title={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6" style={{ color: GOLD }}>الروابط السريعة</h3>
            <ul className="space-y-3">
              {[
                { label: 'المؤسسات الثقافية', href: '#' },
                { label: 'الفعاليات القادمة', href: '#' },
                { label: 'الخدمات الإلكترونية', href: '#' },
                { label: 'من نحن', href: '/about' },
                { label: 'تواصل معنا', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm transition-colors"
                    style={{ color: '#a89070' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = GOLD_LIGHT)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#a89070')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6" style={{ color: GOLD }}>اتصل بنا</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <MapPin size={20} className="flex-shrink-0 mt-0.5" style={{ color: GOLD_LIGHT }} />
                <p className="text-sm" style={{ color: '#a89070' }}>خنشلة، الجزائر</p>
              </div>
              <div className="flex gap-3 items-center">
                <Phone size={20} className="flex-shrink-0" style={{ color: GOLD_LIGHT }} />
                <a
                  href="tel:+21332712345"
                  className="text-sm transition-colors"
                  style={{ color: '#a89070' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = GOLD_LIGHT)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#a89070')}
                >
                  032 71 23 45
                </a>
              </div>
              <div className="flex gap-3 items-center">
                <Mail size={20} className="flex-shrink-0" style={{ color: GOLD_LIGHT }} />
                <a
                  href="mailto:direction.culture40k@gmail.com"
                  className="text-sm transition-colors"
                  style={{ color: '#a89070' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = GOLD_LIGHT)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#a89070')}
                >
                  direction.culture40k@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          className="w-full h-px mb-8"
          style={{ background: `linear-gradient(90deg, transparent, ${WARM_BORDER}, transparent)` }}
        />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{ color: '#a89070' }}>
          <p>© {currentYear} منصة قطاع الثقافة والفنون. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            {[
              { label: 'سياسة الخصوصية', href: '/privacy' },
              { label: 'شروط الاستخدام', href: '#' },
              { label: 'الاستفسارات', href: '#' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="transition-colors"
                style={{ color: '#a89070' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD_LIGHT)}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#a89070')}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
