'use client'

import Link from 'next/link'
import { Palette, Film, BookOpen, Music, Drama, LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useCms } from '@/lib/cms-context'
import type { IconName } from '@/lib/institutions-data'

const COPPER = '#c9952a'
const COPPER_LIGHT = '#e0b060'
const INDIGO_DEEP = '#1a0f0a'
const INDIGO_LIGHT = '#2a1e14'

const bentoIconMap: Record<IconName, LucideIcon> = {
  'palette': Palette,
  'film': Film,
  'book-open': BookOpen,
  'music': Music,
  'drama': Drama,
}

export function BentoGrid() {
  const { institutions } = useCms()
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="bento-section" 
      className="py-20 relative overflow-hidden" 
      aria-label="المؤسسات الثقافية"
      style={{ backgroundColor: INDIGO_DEEP }}
    >
      <style jsx>{`
        @keyframes ambient-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes glow-border {
          0%, 100% { box-shadow: 0 0 20px rgba(201, 149, 42, 0.3); }
          50% { box-shadow: 0 0 40px rgba(201, 149, 42, 0.5); }
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-1/4 w-[400px] h-[600px] opacity-20"
          style={{
            background: `radial-gradient(ellipse at center, ${COPPER}30 0%, transparent 70%)`,
            animation: 'ambient-pulse 6s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[300px] h-[400px] opacity-15"
          style={{
            background: `radial-gradient(ellipse at center, ${INDIGO_LIGHT}50 0%, transparent 70%)`,
            animation: 'ambient-pulse 8s ease-in-out infinite 2s',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div 
          className={`mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            المؤسسات الثقافية
          </h2>
          <p className="text-lg max-w-2xl font-light" style={{ color: COPPER_LIGHT }}>
            استكشف مؤسساتنا المتخصصة في الفنون والتراث والثقافة
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
          {institutions.map((inst, idx) => {
            const Icon = bentoIconMap[inst.iconName] || Palette
            const isHovered = hoveredIndex === idx
            
            return (
              <Link
                href={`/institution/${inst.id}`}
                key={inst.id || idx}
                className={`relative overflow-hidden rounded-2xl group cursor-pointer transition-all duration-500 flex-shrink-0 w-[280px] h-[320px] snap-center md:w-auto md:h-[320px] block ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{
                  transitionDelay: `${idx * 100}ms`,
                  boxShadow: isHovered 
                    ? `0 20px 50px -10px ${inst.ambientColor}, 0 0 30px ${inst.ambientColor}` 
                    : '0 4px 20px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={inst.image}
                    alt={inst.title}
                    className="absolute w-full h-full object-cover transition-all duration-700"
                    style={{
                      transform: isHovered ? 'scale(1.1)' : 'scale(1.02)',
                    }}
                  />
                </div>

                <div 
                  className="absolute inset-0 transition-all duration-500"
                  style={{
                    background: isHovered
                      ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.2) 100%)'
                      : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                  }}
                />

                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 80%, ${inst.ambientColor} 0%, transparent 60%)`,
                  }}
                />

                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                  style={{
                    border: `2px solid ${COPPER}50`,
                    animation: isHovered ? 'glow-border 2s ease-in-out infinite' : 'none',
                  }}
                />

                {inst.title === 'قاعة السينيماتيك' && (
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-full opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, transparent 60%)',
                      filter: 'blur(20px)',
                    }}
                  />
                )}

                {inst.title === 'المكتبة الرئيسية للمطالعة العمومية' && (
                  <div
                    className="absolute bottom-0 right-0 w-[150px] h-[150px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 200, 100, 0.4) 0%, transparent 70%)',
                      filter: 'blur(15px)',
                    }}
                  />
                )}

                <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-7 z-10">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                    style={{ 
                      backgroundColor: inst.iconBg,
                      boxShadow: isHovered ? `0 0 25px ${inst.iconBg}60` : '0 4px 15px rgba(0,0,0,0.2)',
                    }}
                  >
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <div className="transition-all duration-300 group-hover:translate-y-[-4px]">
                    <h3 
                      className="text-lg font-bold mb-2 leading-snug text-right transition-colors duration-300"
                      style={{ color: isHovered ? COPPER_LIGHT : 'white' }}
                    >
                      {inst.title}
                    </h3>
                    <p className="text-gray-200 text-sm leading-relaxed text-right transition-colors duration-300 group-hover:text-white">
                      {inst.description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
