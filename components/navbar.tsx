'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { menuItems } from '@/lib/constants'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)

  const megaMenuContent: Record<string, { title: string; image: string; description: string }[]> = {
    'المؤسسات الثقافية': [
      {
        title: 'المتحف العمومي الوطني',
        image: '/images/chelia.jpg',
        description: 'متحف الآثار والتراث الخنشلي',
      },
      {
        title: 'دار الثقافة',
        image: '/images/palais-kahina.jpg',
        description: 'مركز الفنون والأداب',
      },
      {
        title: 'المكتبة الرئيسية للمطالعة العمومية',
        image: '/images/heritage.jpg',
        description: '',
      },
      {
        title: 'قاعة السينيماتيك',
        image: '/images/chelia.jpg',
        description: 'عرض الأفلام الثقافية والفنية',
      },
      {
        title: 'مسرح الهواء الطلق',
        image: '/images/cultural-festival.jpg',
        description: 'عروض مسرحية فنية',
      },
    ],
    'مصالح المديرية': [
      {
        title: 'مصلحة الفنون والآداب',
        image: '/images/heritage.jpg',
        description: 'قسم الفنون البصرية والأدبية',
      },
      {
        title: 'مصلحة النشاطات الثقافية',
        image: '/images/palais-kahina.jpg',
        description: 'تنظيم المهرجانات والفعاليات',
      },
      {
        title: 'مصلحة التراث الثقافي',
        image: '/images/chelia.jpg',
        description: 'الحفاظ على الموارد التاريخية',
      },
    ],
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A] border-b border-[#334155] h-16 flex items-center">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link href="/?enter=true" className="flex items-center gap-2 text-xl font-bold text-[#B87333]">
          <img
            src="/images/logo-culture.jpg"
            alt="مديرية الثقافة والفنون"
            className="w-9 h-9 rounded-full object-cover"
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
              <button className="text-white font-medium text-sm hover:text-[#B87333] transition-colors py-2">
                {item.label}
              </button>

              {/* Mega Menu Panel - CSS-only visibility toggle */}
              {hoveredMenu === item.label && megaMenuContent[item.label] && (
                <div className="absolute top-full left-0 w-screen max-w-none bg-[#1E293B] border-b border-[#334155] shadow-lg opacity-100 transition-opacity duration-200">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {megaMenuContent[item.label].map((subitem, idx) => (
                        <div
                          key={idx}
                          className="group/card cursor-pointer"
                        >
                          <div className="relative h-40 bg-[#334155] rounded-lg overflow-hidden mb-3">
                            <img
                              src={subitem.image}
                              alt={subitem.title}
                              className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-colors" />
                          </div>
                          <h4 className="text-sm font-semibold text-white group-hover/card:text-[#B87333] transition-colors">
                            {subitem.title}
                          </h4>
                          <p className="text-xs text-gray-400 mt-1">{subitem.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Services Link */}
          <Link href="#services" className="text-white font-medium text-sm hover:text-[#B87333] transition-colors">
            {menuItems[2].label}
          </Link>

          {/* Festivals Link */}
          <Link href="/festivals" className="text-white font-medium text-sm hover:text-[#B87333] transition-colors">
            المهرجانات الثقافية
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu - CSS visibility */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#1E293B] border-b border-[#334155] transition-all duration-200">
          <div className="px-4 py-4 space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href="#"
                className="block text-white font-medium py-2 hover:text-[#B87333] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/festivals"
              className="block text-white font-medium py-2 hover:text-[#B87333] transition-colors"
            >
              المهرجانات الثقافية
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
