'use client'

import Link from 'next/link'
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'

export function ModernFooter() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Facebook, url: 'https://www.facebook.com/share/1Cb5L3zNjg/', label: 'Facebook' },
    { icon: Instagram, url: '#', label: 'Instagram' },
    { icon: Twitter, url: '#', label: 'Twitter' },
    { icon: Linkedin, url: '#', label: 'LinkedIn' },
  ]

  return (
    <footer className="text-white py-16 md:py-20" style={{ backgroundColor: '#0F172A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full h-px bg-[#334155] mb-12" />

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 mb-12">
          {/* Column 1 - Brand */}
          <div>
            <Link href="/?enter=true" className="flex items-center gap-2 mb-4">
              <img
                src="/images/logo-culture.jpg"
                alt="مديرية الثقافة والفنون"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-xl font-bold">منصة</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              منصة قطاع الثقافة والفنون في خنشلة. نافذتكم على الإبداع والتراث الخنشلي الأصيل.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  {...(url !== '#' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="w-10 h-10 rounded-full border border-[#B87333]/30 flex items-center justify-center hover:bg-[#B87333] hover:border-[#B87333] hover:-translate-y-0.5 hover:scale-110 transition-all duration-300 text-sm"
                  title={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-[#B87333]">الروابط السريعة</h3>
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
                    className="text-gray-400 hover:text-[#D4956A] transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-[#B87333]">اتصل بنا</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <MapPin size={20} className="text-[#D4956A] flex-shrink-0 mt-0.5" />
                <p className="text-gray-400 text-sm">
                  خنشلة، الجزائر
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <Phone size={20} className="text-[#D4956A] flex-shrink-0" />
                <a href="tel:+21332712345" className="text-gray-400 hover:text-[#D4956A] transition-colors text-sm">
                  032 71 23 45
                </a>
              </div>
              <div className="flex gap-3 items-center">
                <Mail size={20} className="text-[#D4956A] flex-shrink-0" />
                <a href="mailto:direction.culture40k@gmail.com" className="text-gray-400 hover:text-[#D4956A] transition-colors text-sm">
                  direction.culture40k@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#334155] mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
          <p>© {currentYear} منصة قطاع الثقافة والفنون. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#D4956A] transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="#" className="hover:text-[#D4956A] transition-colors">
              شروط الاستخدام
            </Link>
            <Link href="#" className="hover:text-[#D4956A] transition-colors">
              الاستفسارات
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
