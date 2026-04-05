'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { fetchCollection, isMockMode } from '@/lib/firestore-helpers'

const COPPER = '#B87333'
const COPPER_LIGHT = '#D4956A'
const INDIGO_DEEP = '#0F172A'
const INDIGO_MEDIUM = '#1E293B'

interface EventItem {
  id: string
  title: string
  date: string
  image: string
  category: string
  href?: string
}

const defaultEvents: EventItem[] = [
  {
    id: '1',
    title: 'مهرجان الفنون الخنشلي',
    date: 'مايو 2024',
    image: '/images/cultural-festival.jpg',
    category: 'المهرجانات الثقافية',
    href: '/festivals',
  },
  {
    id: '2',
    title: 'معرض الآثار التاريخية',
    date: 'يونيو 2024',
    image: '/images/archaeological-exhibition.jpg',
    category: 'معرض',
  },
  {
    id: '3',
    title: 'حفل الموسيقى الكلاسيكية',
    date: 'يوليو 2024',
    image: '/images/music-concert.jpg',
    category: 'حفل',
  },
  {
    id: '4',
    title: 'ورشة الفنون التشكيلية',
    date: 'أغسطس 2024',
    image: '/images/art-workshop.jpg',
    category: 'ورشة',
  },
]

export function EventsSlider() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [events, setEvents] = useState<EventItem[]>(defaultEvents)

  useEffect(() => {
    async function loadEvents() {
      try {
        const docs = await fetchCollection('events', 'date')
        const active = docs.filter((d: Record<string, unknown>) => d.active !== false)
        if (active.length > 0) {
          setEvents(active.map((d: Record<string, unknown>) => ({
            id: d.id as string,
            title: (d.title as string) || '',
            date: (d.date as string) || '',
            image: (d.imageUrl as string) || (d.image as string) || '/images/cultural-festival.jpg',
            category: (d.category as string) || (d.type as string) || 'فعالية',
            href: (d.href as string) || undefined,
          })))
        }
      } catch (err) {
        console.error('Failed to load events from Firestore:', err)
      }
    }
    loadEvents()
  }, [])

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

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 400
      containerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section ref={sectionRef} className="py-20 relative overflow-hidden" style={{ backgroundColor: INDIGO_DEEP }}>
      <style jsx>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 15px rgba(184, 115, 51, 0.4); }
          50% { box-shadow: 0 0 30px rgba(184, 115, 51, 0.6); }
        }
      `}</style>

      {/* Ambient background */}
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${COPPER} 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`mb-12 flex justify-between items-end transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              الفعاليات القادمة
            </h2>
            <p className="text-lg font-light" style={{ color: COPPER_LIGHT }}>
              اكتشف الأحداث الثقافية والفنية المميزة
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-3 rounded-full border-2 transition-all duration-300 hover:scale-105"
              style={{
                borderColor: COPPER,
                color: COPPER,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.backgroundColor = COPPER
                el.style.color = 'white'
                el.style.boxShadow = `0 0 20px ${COPPER}50`
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.backgroundColor = 'transparent'
                el.style.color = COPPER
                el.style.boxShadow = 'none'
              }}
              aria-label="Scroll left"
            >
              <ChevronRight size={24} className="rotate-180" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 rounded-full border-2 transition-all duration-300 hover:scale-105"
              style={{
                borderColor: COPPER,
                color: COPPER,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.backgroundColor = COPPER
                el.style.color = 'white'
                el.style.boxShadow = `0 0 20px ${COPPER}50`
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.backgroundColor = 'transparent'
                el.style.color = COPPER
                el.style.boxShadow = 'none'
              }}
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="overflow-x-auto flex gap-6 pb-4 scrollbar-hide scroll-smooth"
        >
          {events.map((event, index) => {
            const cardClassName = `flex-shrink-0 w-96 group transition-all duration-700 block ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }${event.href ? ' cursor-pointer' : ''}`
            const cardStyle = { transitionDelay: `${index * 100}ms` }
            const cardHandlers = {
              onMouseEnter: () => setHoveredId(event.id),
              onMouseLeave: () => setHoveredId(null),
            }

            const cardContent = (
              <div 
                className="relative h-56 rounded-2xl overflow-hidden transition-all duration-500"
                style={{
                  boxShadow: hoveredId === event.id 
                    ? `0 25px 50px -10px rgba(0,0,0,0.5), 0 0 30px ${COPPER}30`
                    : '0 10px 30px rgba(0,0,0,0.3)',
                  transform: hoveredId === event.id ? 'translateY(-8px)' : 'translateY(0)',
                }}
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700"
                  style={{
                    transform: hoveredId === event.id ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
                
                {/* Gradient overlay with atmospheric effect */}
                <div 
                  className="absolute inset-0 transition-all duration-500"
                  style={{
                    background: hoveredId === event.id
                      ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
                      : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                  }}
                />

                {/* Ambient glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 100%, ${COPPER}30 0%, transparent 60%)`,
                  }}
                />

                {/* Glowing border */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    border: `2px solid ${COPPER}50`,
                  }}
                />

                <div 
                  className="absolute top-4 right-4 px-4 py-2 text-white rounded-full text-sm font-semibold transition-all duration-300"
                  style={{ 
                    backgroundColor: COPPER,
                    boxShadow: hoveredId === event.id ? `0 0 20px ${COPPER}60` : 'none',
                    animation: hoveredId === event.id ? 'glow 2s ease-in-out infinite' : 'none',
                  }}
                >
                  {event.category}
                </div>

                <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                  <h3 
                    className="text-lg font-bold mb-2 transition-all duration-300"
                    style={{
                      color: hoveredId === event.id ? COPPER_LIGHT : 'white',
                      transform: hoveredId === event.id ? 'translateX(-4px)' : 'translateX(0)',
                    }}
                  >
                    {event.title}
                  </h3>
                  <p className="text-sm text-white/80">{event.date}</p>
                </div>
              </div>
            )

            if (event.href) {
              return (
                <Link key={event.id} href={event.href} className={cardClassName} style={cardStyle} {...cardHandlers}>
                  {cardContent}
                </Link>
              )
            }

            return (
              <div key={event.id} className={cardClassName} style={cardStyle} {...cardHandlers}>
                {cardContent}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
