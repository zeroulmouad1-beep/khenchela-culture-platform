'use client'

import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// Deep Indigo & Copper palette
const COPPER = '#c9952a'
const COPPER_LIGHT = '#e0b060'
const INDIGO_DEEP = '#1a0f0a'
const INDIGO_MEDIUM = '#1e1610'

export function SmartServices() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="services" 
      className="py-12 overflow-hidden"
      style={{ backgroundColor: INDIGO_MEDIUM }}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="block w-full group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`relative flex items-center justify-between py-8 px-8 rounded-2xl shadow-md transition-all duration-500 border overflow-hidden ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              background: `linear-gradient(135deg, ${INDIGO_DEEP} 0%, #0a0f1a 100%)`,
              borderColor: isHovered ? `${COPPER}50` : `${COPPER}20`,
              boxShadow: isHovered 
                ? `0 20px 50px -10px rgba(184, 115, 51, 0.3), 0 0 40px rgba(184, 115, 51, 0.15)` 
                : '0 10px 30px rgba(0,0,0,0.3)',
            }}
          >
            {/* Animated background pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23B87333' fill-opacity='1'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '40px 40px',
                animation: isHovered ? 'shimmer 3s linear infinite' : 'none',
              }}
            />

            {/* Floating sparkles on hover */}
            {isHovered && (
              <>
                <div 
                  className="absolute top-4 left-1/4"
                  style={{ color: COPPER, animation: 'float 2s ease-in-out infinite' }}
                >
                  <Sparkles size={16} />
                </div>
                <div 
                  className="absolute bottom-4 right-1/3"
                  style={{ color: COPPER_LIGHT, animation: 'float 2.5s ease-in-out infinite 0.5s' }}
                >
                  <Sparkles size={12} />
                </div>
              </>
            )}

            {/* Ambient glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, ${COPPER}40 0%, transparent 70%)`,
              }}
            />

            <div className="text-right relative z-10">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3 transition-all duration-300"
                style={{ color: COPPER }}
              >
                الخدمات الإلكترونية
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight mb-2">
                كل ما تحتاجه{' '}
                <span 
                  className="transition-all duration-300"
                  style={{ color: COPPER_LIGHT }}
                >
                  في مكان واحد
                </span>
              </h2>
              <p className="text-gray-300 text-sm transition-colors duration-300 group-hover:text-gray-200">
                اضغط للوصول إلى بوابة الخدمات الإلكترونية
              </p>
            </div>

            <div className="relative">
              {/* Pulse ring animation */}
              {isHovered && (
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    backgroundColor: `${COPPER}30`,
                    animation: 'pulse-ring 1.5s ease-out infinite',
                  }}
                />
              )}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 relative z-10"
                style={{
                  backgroundColor: COPPER,
                  boxShadow: isHovered 
                    ? `0 0 40px ${COPPER}60` 
                    : `0 4px 20px ${COPPER}40`,
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <ArrowLeft
                  size={24}
                  className="text-white transition-transform duration-300"
                  style={{
                    transform: isHovered ? 'translateX(-4px)' : 'translateX(0)',
                  }}
                />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}
