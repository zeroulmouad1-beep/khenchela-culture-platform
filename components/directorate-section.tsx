'use client'

import { Palette, Users, Landmark, LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useCms, Department } from '@/lib/cms-context'

const COPPER = '#c9952a'
const COPPER_LIGHT = '#e0b060'
const INDIGO_DEEP = '#1a0f0a'
const INDIGO_MEDIUM = '#1e1610'

const iconMap: Record<string, LucideIcon> = {
  Palette,
  Users,
  Landmark,
}

const particleTypes: Record<string, string> = {
  Palette: 'brush',
  Users: 'sparkle',
  Landmark: 'dust',
}

function FloatingParticles({ type }: { type: string }) {
  const particleCount = type === 'sparkle' ? 20 : 12
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: particleCount }).map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${
            type === 'sparkle' ? 'bg-[#c9952a]' : 
            type === 'brush' ? 'bg-white' : 'bg-[#e0b060]'
          }`}
          style={{
            width: type === 'sparkle' ? '4px' : type === 'brush' ? '3px' : '2px',
            height: type === 'sparkle' ? '4px' : type === 'brush' ? '3px' : '2px',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.4 + Math.random() * 0.4,
            animation: `float-particle ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

export function DirectorateSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { departments } = useCms()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-16 relative overflow-hidden"
      aria-label="مصالح المديرية"
      style={{ backgroundColor: INDIGO_MEDIUM }}
    >
      <style jsx>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.7; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(184, 115, 51, 0.3); }
          50% { box-shadow: 0 0 40px rgba(184, 115, 51, 0.6); }
        }
      `}</style>

      <div
        className="absolute inset-0 opacity-10 transition-opacity duration-1000"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B87333' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: isVisible ? 'shimmer 8s linear infinite' : 'none',
          backgroundSize: '60px 60px',
        }}
      />

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${COPPER}40 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div 
          className={`mb-12 text-right transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: COPPER }}
          >
            الهيكل التنظيمي
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            مصالح المديرية
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl font-light mr-auto">
            تعرف على أقسام مديرية الثقافة والفنون بخنشلة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {departments.map((dept, index) => {
            const Icon = iconMap[dept.iconName] || Palette
            const particleType = particleTypes[dept.iconName] || 'brush'
            return (
              <div
                key={dept.id}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 h-[320px] ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={dept.image}
                    alt={dept.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ transform: 'scale(1.05)' }}
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/50" />

                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <FloatingParticles type={particleType} />
                </div>

                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                  style={{ 
                    backgroundColor: `${COPPER}10`,
                    boxShadow: `inset 0 0 60px ${COPPER}20`,
                  }}
                />

                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    border: `2px solid ${COPPER}40`,
                    boxShadow: `0 0 30px ${COPPER}30`,
                  }}
                />

                <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg self-end transition-all duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: COPPER,
                      boxShadow: `0 4px 20px ${COPPER}50`,
                      animation: 'pulse-glow 2s ease-in-out infinite',
                    }}
                  >
                    <Icon size={22} strokeWidth={1.5} className="text-white" />
                  </div>

                  <div className="text-right">
                    <h3
                      className="text-white text-xl font-bold mb-2 leading-snug transition-all duration-300 group-hover:translate-x-[-8px]"
                      style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                    >
                      {dept.title}
                    </h3>
                    <p className="text-gray-200 text-sm leading-relaxed mb-4 transition-all duration-300 group-hover:text-white">
                      {dept.description}
                    </p>

                    <Link
                      href={dept.href}
                      className="inline-block px-6 py-2.5 rounded-lg font-semibold text-sm text-white transition-all duration-300 border-2 hover:shadow-lg relative overflow-hidden"
                      style={{
                        borderColor: COPPER,
                        backgroundColor: 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement
                        el.style.backgroundColor = COPPER
                        el.style.boxShadow = `0 0 30px ${COPPER}60`
                        el.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement
                        el.style.backgroundColor = 'transparent'
                        el.style.boxShadow = 'none'
                        el.style.transform = 'translateY(0)'
                      }}
                    >
                      استعرض المزيد
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
