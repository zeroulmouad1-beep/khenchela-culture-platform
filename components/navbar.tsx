'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { menuItems } from '@/lib/constants'

const GOLD = '#c9952a'
const WARM_DARK = '#1a0f0a'
const WARM_SECONDARY = '#1e1610'
const WARM_BORDER = '#2a1e14'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)

  const megaMenuContent: Record<string, { title: string; image: string; description: string }[]> = {
    'المؤسسات الثقافية': [
      { title: 'المتحف العمومي الوطني', image: '/images/chelia.jpg', description: 'متحف الآثار والتراث الخنشلي' },
      { title: 'دار الثقافة', image: '/images/palais-kahina.jpg', description: 'مركز الفنون والأداب' },
      { title: 'المكتبة الرئيسية للمطالعة العمومية', image: '/images/heritage.jpg', description: '' },
      { title: 'قاعة السينيماتيك', image: '/images/chelia.jpg', description: 'عرض الأفلام الثقافية والفنية' },
      { title: 'مسرح الهواء الطلق', image: '/images/cultural-festival.jpg', description: 'عروض مسرحية فنية' },
    ],
    'مصالح المديرية': [
      { title: 'مصلحة الفنون والآداب', image: '/images/heritage.jpg', description: 'قسم الفنون البصرية والأدبية' },
      { title: 'مصلحة النشاطات الثقافية', image: '/images/palais-kahina.jpg', description: 'تنظيم المهرجانات والفعاليات' },
      { title: 'مصلحة التراث الثقافي', image: '/images/chelia.jpg', description: 'الحفاظ على الموارد التاريخية' },
    ],
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center border-b"
      style={{ backgroundColor: WARM_DARK, borderColor: WARM_BORDER }}
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link href="/?enter=true" className="flex items-center gap-2 text-xl font-bold" style={{ color: GOLD }}>
          <img
            src="/images/logo-culture.jpg"
            alt="مديرية الثقافة والفنون"
            className="w-9 h-9 rounded-full object-cover"
            style={{ border: `1.5px solid ${GOLD}40` }}
          />
          <span>منصة</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.slice(0, 2).map((item) => (
            <div
              key={item.label}
              className="relative group"
              onMouseEnter={() => setHoveredMenu(item.label)}
              onMouseLeave={() => setHoveredMenu(null)}
            >
              <button
                className="font-medium text-sm py-2 transition-colors"
                style={{ color: '#f0e6d3' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#f0e6d3')}
              >
                {item.label}
              </button>

              {hoveredMenu === item.label && megaMenuContent[item.label] && (
                <div
                  className="absolute top-full left-0 w-screen max-w-none border-b shadow-xl"
                  style={{ backgroundColor: WARM_SECONDARY, borderColor: WARM_BORDER }}
                >
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {megaMenuContent[item.label].map((subitem, idx) => (
                        <div key={idx} className="group/card cursor-pointer">
                          <div
                            className="relative h-40 rounded-lg overflow-hidden mb-3"
                            style={{ backgroundColor: WARM_BORDER }}
                          >
                            <img
                              src={subitem.image}
                              alt={subitem.title}
                              className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 group-hover/card:bg-[#1a0f0a] transition-colors" />
                          </div>
                          <h4
                            className="text-sm font-semibold transition-colors"
                            style={{ color: '#f0e6d3' }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#f0e6d3')}
                          >
                            {subitem.title}
                          </h4>
                          <p className="text-xs mt-1" style={{ color: '#a89070' }}>{subitem.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <Link
            href="#services"
            className="font-medium text-sm transition-colors"
            style={{ color: '#f0e6d3' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#f0e6d3')}
          >
            {menuItems[2]?.label}
          </Link>

          <Link
            href="/festivals"
            className="font-medium text-sm transition-colors"
            style={{ color: '#f0e6d3' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#f0e6d3')}
          >
            المهرجانات الثقافية
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden transition-colors"
          style={{ color: '#f0e6d3' }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden absolute top-16 left-0 right-0 border-b"
          style={{ backgroundColor: WARM_SECONDARY, borderColor: WARM_BORDER }}
        >
          <div className="px-4 py-4 space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href="#"
                className="block font-medium py-2 transition-colors"
                style={{ color: '#f0e6d3' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#f0e6d3')}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/festivals"
              className="block font-medium py-2 transition-colors"
              style={{ color: '#f0e6d3' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#f0e6d3')}
            >
              المهرجانات الثقافية
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
