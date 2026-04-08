'use client'

import { useState } from 'react'
import Link from 'next/link'

export function ImmersiveHero({ onEnter }: { onEnter: () => void }) {
  const [isExiting, setIsExiting] = useState(false)
  const [showContact, setShowContact] = useState(false)

  const handleEnter = () => {
    setIsExiting(true)
    setTimeout(() => {
      onEnter()
    }, 600)
  }

  return (
    <section
      dir="rtl"
      className={`relative w-full min-h-screen overflow-hidden flex items-center justify-center transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
      }}
    >
      {/* Animated Aurès/Berber pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0z' fill='none' stroke='%23C5A059' stroke-width='1'/%3E%3Cpath d='M30 10L50 30L30 50L10 30L30 10z' fill='none' stroke='%23C5A059' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='5' fill='none' stroke='%23C5A059' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow accent */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(197, 160, 89, 0.15) 0%, transparent 60%)',
        }}
      />

      {/* Glassmorphism Navigation Bar */}
      <nav
        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(197, 160, 89, 0.2)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
            style={{
              background: 'linear-gradient(135deg, #C5A059 0%, #8B6914 100%)',
              color: '#1a1a2e',
            }}
          >
            خ
          </div>
          <span
            className="text-lg font-semibold"
            style={{ color: '#C5A059', fontFamily: "'Cairo', sans-serif" }}
          >
            منصة خنشلة
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['الرئيسية', 'المؤسسات', 'الفعاليات', 'التراث', 'اتصل بنا'].map((item, i) => (
            <a
              key={i}
              href="#"
              className="text-sm transition-colors duration-300 hover:text-[#C5A059]"
              style={{ color: 'rgba(255, 255, 255, 0.7)', fontFamily: "'Cairo', sans-serif" }}
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Decorative top accent */}
        <div
          className="mx-auto mb-8 w-24 h-1 rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #C5A059, transparent)',
          }}
        />

        {/* Main Headline */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          style={{
            color: '#FFFFFF',
            fontFamily: "'Amiri', serif",
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            animation: 'fadeInUp 1s ease-out forwards',
          }}
        >
          منصة قطاع الثقافة والفنون
          <span
            className="block mt-2"
            style={{ color: '#C5A059' }}
          >
            خنشلة
          </span>
        </h1>

        {/* Welcome Statement */}
        <p
          className="text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto"
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontFamily: "'Cairo', sans-serif",
            animation: 'fadeInUp 1s ease-out 0.3s forwards',
            opacity: 0,
            animationFillMode: 'forwards',
          }}
        >
          منصة قطاع الثقافة والفنون هو فضاء رقمي متكامل يُعنى بتعزيز الإبداع ودعم الفاعلين الثقافيين والفنيين
        </p>

        {/* CTA Button with glow effect */}
        <button
          onClick={handleEnter}
          className="group relative px-12 py-4 text-xl font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #C5A059 0%, #8B6914 100%)',
            color: '#1a1a2e',
            fontFamily: "'Cairo', sans-serif",
            boxShadow: '0 4px 20px rgba(197, 160, 89, 0.4)',
            animation: 'fadeInUp 1s ease-out 0.6s forwards, pulse 2s ease-in-out infinite',
            opacity: 0,
            animationFillMode: 'forwards',
          }}
        >
          <span className="relative z-10">مرحبا</span>
          {/* Glow effect on hover */}
          <div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(135deg, #C5A059 0%, #D4AF37 100%)',
              boxShadow: '0 0 40px rgba(197, 160, 89, 0.8), 0 0 80px rgba(197, 160, 89, 0.4)',
            }}
          />
        </button>

        {/* Decorative bottom accent */}
        <div
          className="mx-auto mt-12 w-32 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(197, 160, 89, 0.5), transparent)',
          }}
        />

        {/* Bottom Action Buttons */}
        <div
          className="mt-10 grid grid-cols-2 md:flex md:items-center md:justify-center gap-6 md:gap-16 max-w-xs md:max-w-none mx-auto"
          style={{
            animation: 'fadeInUp 1s ease-out 0.9s forwards',
            opacity: 0,
            animationFillMode: 'forwards',
          }}
        >
          {/* Khenchela Profile Button */}
          <Link
            href="/about-khenchela"
            className="group flex flex-col items-center gap-3 transition-transform duration-300 hover:scale-110 cursor-pointer"
          >
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-lg"
              style={{
                background: 'linear-gradient(145deg, rgba(197, 160, 89, 0.15) 0%, rgba(139, 105, 20, 0.1) 100%)',
                border: '1px solid rgba(197, 160, 89, 0.3)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:scale-110"
              >
                <path
                  d="M6 38L14 20L20 30L28 14L34 26L42 38H6Z"
                  fill="rgba(197, 160, 89, 0.2)"
                  stroke="#C5A059"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="24" cy="12" r="3" fill="none" stroke="#C5A059" strokeWidth="1.5" />
                <path d="M24 15V20" stroke="#C5A059" strokeWidth="1" opacity="0.6" />
                <path d="M10 38C10 38 14 34 18 34C22 34 26 38 30 38C34 38 38 34 38 34" stroke="#C5A059" strokeWidth="1" opacity="0.4" />
              </svg>
            </div>
            <span
              className="text-sm md:text-base font-medium text-center leading-tight"
              style={{ color: '#FFFFFF', fontFamily: "'Cairo', sans-serif" }}
            >
              خنشلة
            </span>
          </Link>

          {/* Archaeological Map Button - External Link */}
          <a
            href="https://www.google.com/maps/d/u/0/edit?mid=1pfr-rEbo1GhnW4Ba8v2ifv213Z79BnE&usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 transition-transform duration-300 hover:scale-110 cursor-pointer"
          >
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-lg"
              style={{
                background: 'linear-gradient(145deg, rgba(197, 160, 89, 0.15) 0%, rgba(139, 105, 20, 0.1) 100%)',
                border: '1px solid rgba(197, 160, 89, 0.3)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:scale-110"
              >
                {/* Unrolled map base */}
                <path
                  d="M8 12L16 8L32 14L40 10V36L32 40L16 34L8 38V12Z"
                  fill="rgba(197, 160, 89, 0.2)"
                  stroke="#C5A059"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                {/* Map fold lines */}
                <path d="M16 8V34" stroke="#C5A059" strokeWidth="1" strokeDasharray="2 2" />
                <path d="M32 14V40" stroke="#C5A059" strokeWidth="1" strokeDasharray="2 2" />
                {/* Compass rose */}
                <circle cx="24" cy="24" r="6" fill="none" stroke="#C5A059" strokeWidth="1" />
                <path d="M24 18L25 24L24 30L23 24L24 18Z" fill="#C5A059" />
                <path d="M18 24L24 23L30 24L24 25L18 24Z" fill="#C5A059" />
                {/* Ruin symbol markers */}
                <rect x="11" y="18" width="3" height="4" fill="#C5A059" opacity="0.7" />
                <rect x="34" y="26" width="3" height="4" fill="#C5A059" opacity="0.7" />
              </svg>
            </div>
            <span
              className="text-sm md:text-base font-medium text-center leading-tight"
              style={{ color: '#FFFFFF', fontFamily: "'Cairo', sans-serif" }}
            >
              الخريطة الأثرية
              <br />
              خنشلة
            </span>
          </a>

          {/* Electronic Services Button */}
          <a
            href="/services"
            className="group flex flex-col items-center gap-3 transition-transform duration-300 hover:scale-110 cursor-pointer"
          >
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-lg"
              style={{
                background: 'linear-gradient(145deg, rgba(197, 160, 89, 0.15) 0%, rgba(139, 105, 20, 0.1) 100%)',
                border: '1px solid rgba(197, 160, 89, 0.3)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:scale-110"
              >
                <rect x="8" y="8" width="13" height="13" rx="3" fill="rgba(197, 160, 89, 0.2)" stroke="#C5A059" strokeWidth="1.5" />
                <rect x="27" y="8" width="13" height="13" rx="3" fill="rgba(197, 160, 89, 0.2)" stroke="#C5A059" strokeWidth="1.5" />
                <rect x="8" y="27" width="13" height="13" rx="3" fill="rgba(197, 160, 89, 0.2)" stroke="#C5A059" strokeWidth="1.5" />
                <rect x="27" y="27" width="13" height="13" rx="3" fill="rgba(197, 160, 89, 0.2)" stroke="#C5A059" strokeWidth="1.5" />
                <circle cx="14.5" cy="14.5" r="2" fill="#C5A059" opacity="0.8" />
                <circle cx="33.5" cy="14.5" r="2" fill="#C5A059" opacity="0.8" />
                <circle cx="14.5" cy="33.5" r="2" fill="#C5A059" opacity="0.8" />
                <circle cx="33.5" cy="33.5" r="2" fill="#C5A059" opacity="0.8" />
              </svg>
            </div>
            <span
              className="text-sm md:text-base font-medium text-center leading-tight"
              style={{ color: '#FFFFFF', fontFamily: "'Cairo', sans-serif" }}
            >
              الخدمات
              <br />
              الإلكترونية
            </span>
          </a>

          {/* Contact Us Button */}
          <button
            className="group flex flex-col items-center gap-3 transition-transform duration-300 hover:scale-110 cursor-pointer"
            onClick={() => setShowContact(true)}
          >
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-lg"
              style={{
                background: 'linear-gradient(145deg, rgba(197, 160, 89, 0.15) 0%, rgba(139, 105, 20, 0.1) 100%)',
                border: '1px solid rgba(197, 160, 89, 0.3)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:scale-110"
              >
                <path
                  d="M14 10C12 10 10 12 10 14C10 26 22 38 34 38C36 38 38 36 38 34L38 30C38 28.5 37 27 35.5 27L31 27C29.5 27 28 28 28 29.5L28 31C24 29 19 24 17 20L18.5 20C20 20 21 18.5 21 17L21 12.5C21 11 19.5 10 18 10L14 10Z"
                  fill="rgba(197, 160, 89, 0.3)"
                  stroke="#C5A059"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M30 10C34 12 37 16 38 20"
                  stroke="#C5A059"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                <path
                  d="M26 14C28.5 15.5 30.5 18 31.5 21"
                  stroke="#C5A059"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                <path
                  d="M22 18C24 19 25.5 21 26 23"
                  stroke="#C5A059"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.4"
                />
              </svg>
            </div>
            <span
              className="text-sm md:text-base font-medium text-center leading-tight"
              style={{ color: '#FFFFFF', fontFamily: "'Cairo', sans-serif" }}
            >
              اتصل
              <br />
              بنا
            </span>
          </button>
        </div>
      </div>

      {/* Side decorative element - 3D styled card */}
      <div
        className="absolute bottom-10 left-10 hidden lg:block w-48 h-64 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(197, 160, 89, 0.1) 0%, rgba(139, 105, 20, 0.05) 100%)',
          border: '1px solid rgba(197, 160, 89, 0.2)',
          backdropFilter: 'blur(8px)',
          transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="p-4 h-full flex flex-col justify-end">
          <div className="w-8 h-8 rounded-full mb-3" style={{ background: 'linear-gradient(135deg, #C5A059, #8B6914)' }} />
          <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)', fontFamily: "'Cairo', sans-serif" }}>
            تراث الأوراس
          </p>
          <p className="text-sm font-semibold" style={{ color: '#C5A059', fontFamily: "'Cairo', sans-serif" }}>
            اكتشف ثقافتنا
          </p>
        </div>
      </div>

      {/* Right side decorative element */}
      <div
        className="absolute top-1/3 right-10 hidden lg:block w-32 h-32 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(197, 160, 89, 0.1) 0%, transparent 70%)',
          border: '1px solid rgba(197, 160, 89, 0.15)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />

      {/* Contact Modal */}
      {showContact && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={() => setShowContact(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            dir="rtl"
            className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)',
              border: '1px solid rgba(197, 160, 89, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <div
                className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #C5A059 0%, #8B6914 100%)' }}
              >
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                  <path
                    d="M14 10C12 10 10 12 10 14C10 26 22 38 34 38C36 38 38 36 38 34L38 30C38 28.5 37 27 35.5 27L31 27C29.5 27 28 28 28 29.5L28 31C24 29 19 24 17 20L18.5 20C20 20 21 18.5 21 17L21 12.5C21 11 19.5 10 18 10L14 10Z"
                    fill="#1a1a2e"
                    stroke="#1a1a2e"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <h3
                className="text-xl font-bold"
                style={{ color: '#C5A059', fontFamily: "'Amiri', serif" }}
              >
                اتصل بنا
              </h3>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Cairo', sans-serif" }}>
                مديرية الثقافة والفنون - ولاية خنشلة
              </p>
            </div>

            <div className="space-y-4">
              <div
                className="flex items-center gap-4 p-3 rounded-xl"
                style={{ background: 'rgba(197, 160, 89, 0.08)', border: '1px solid rgba(197, 160, 89, 0.15)' }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(197, 160, 89, 0.15)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Cairo', sans-serif" }}>الهاتف</p>
                  <a href="tel:+21332712345" className="text-sm font-medium" style={{ color: '#FFFFFF', fontFamily: "'Cairo', sans-serif", direction: 'ltr', display: 'block', textAlign: 'right' }}>
                    032 71 23 45
                  </a>
                </div>
              </div>

              <div
                className="flex items-center gap-4 p-3 rounded-xl"
                style={{ background: 'rgba(197, 160, 89, 0.08)', border: '1px solid rgba(197, 160, 89, 0.15)' }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(197, 160, 89, 0.15)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Cairo', sans-serif" }}>البريد الإلكتروني</p>
                  <a href="mailto:direction.culture40k@gmail.com" className="text-sm font-medium hover:text-[#C5A059] transition-colors" style={{ color: '#FFFFFF', fontFamily: "'Cairo', sans-serif" }}>
                    direction.culture40k@gmail.com
                  </a>
                </div>
              </div>

              <div
                className="flex items-center gap-4 p-3 rounded-xl"
                style={{ background: 'rgba(197, 160, 89, 0.08)', border: '1px solid rgba(197, 160, 89, 0.15)' }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(197, 160, 89, 0.15)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Cairo', sans-serif" }}>العنوان</p>
                  <p className="text-sm font-medium" style={{ color: '#FFFFFF', fontFamily: "'Cairo', sans-serif" }}>
                    مديرية الثقافة والفنون، خنشلة، الجزائر
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-4 p-3 rounded-xl"
                style={{ background: 'rgba(197, 160, 89, 0.08)', border: '1px solid rgba(197, 160, 89, 0.15)' }}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(197, 160, 89, 0.15)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Cairo', sans-serif" }}>أوقات العمل</p>
                  <p className="text-sm font-medium" style={{ color: '#FFFFFF', fontFamily: "'Cairo', sans-serif" }}>
                    الأحد - الخميس: 08:00 - 16:00
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="https://www.facebook.com/share/1Cb5L3zNjg/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(197, 160, 89, 0.15)',
                  border: '1px solid rgba(197, 160, 89, 0.3)',
                  color: '#C5A059',
                  fontFamily: "'Cairo', sans-serif",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                تابعنا على فيسبوك
              </a>
            </div>
          </div>
        </div>
      )}

      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 4px 20px rgba(197, 160, 89, 0.4);
          }
          50% {
            box-shadow: 0 4px 30px rgba(197, 160, 89, 0.6), 0 0 60px rgba(197, 160, 89, 0.3);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </section>
  )
}
