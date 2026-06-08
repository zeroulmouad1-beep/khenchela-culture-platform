'use client'

import { useState } from 'react'
import Link from 'next/link'

export function ImmersiveHero({ onEnter }: { onEnter: () => void }) {
  const [isExiting, setIsExiting] = useState(false)
  const [showContact, setShowContact] = useState(false)

  const handleEnter = () => {
    setIsExiting(true)
    setTimeout(() => onEnter(), 700)
  }

  return (
    <section
      dir="rtl"
      className={`amazigh-root relative w-full min-h-screen overflow-hidden flex flex-col transition-all duration-700 ${isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
    >
      {/* ═══ LAYERED BACKGROUNDS ═══ */}
      <div className="az-bg-base absolute inset-0" />
      <div className="az-bg-texture absolute inset-0 pointer-events-none" />
      <div className="az-bg-vignette absolute inset-0 pointer-events-none" />

      {/* ═══ ZARBIYA GEOMETRIC PATTERN GRID ═══ */}
      <div className="az-pattern-grid absolute inset-0 pointer-events-none" />
      <div className="az-zigzag-overlay absolute inset-0 pointer-events-none" />

      {/* ═══ FLOATING EMBER PARTICLES ═══ */}
      <div className="az-particles absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className={`ember e${i + 1}`} />
        ))}
      </div>

      {/* ═══ LANTERN WARM GLOW ═══ */}
      <div className="az-lantern absolute pointer-events-none" />
      <div className="az-lantern-inner absolute pointer-events-none" />

      {/* ═══ NAV BAR ═══ */}
      <nav className="az-nav relative z-50 flex items-center justify-between px-6 md:px-10 py-4 flex-shrink-0">
        {/* Logo + brand */}
        <div className="flex items-center gap-3">
          <div className="az-logo-ring">
            <img
              src="/images/logo-culture.jpg"
              alt="مديرية الثقافة والفنون"
              className="w-9 h-9 rounded-full object-cover"
            />
          </div>
          <div>
            <span className="az-brand-name block text-sm font-bold leading-tight">منصة خنشلة</span>
            <span className="az-brand-sub block text-[10px] leading-tight tracking-widest">KHENCHELA CULTURE</span>
          </div>
        </div>
        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {['الرئيسية', 'المؤسسات', 'الفعاليات', 'التراث', 'اتصل بنا'].map((item, i) => (
            <a key={i} href="#" className="az-nav-link text-sm">
              {item}
            </a>
          ))}
        </div>
        {/* Tifinagh decorative symbol right side */}
        <div className="az-tifi-nav hidden md:flex items-center gap-2 text-xs">
          <span className="az-tifi-glyph">⵰</span>
          <span className="az-tifi-glyph">⵫</span>
          <span className="az-tifi-glyph">⵬</span>
        </div>
      </nav>

      {/* ═══ TOP BORDER BAND ═══ */}
      <div className="az-top-band w-full flex-shrink-0" />

      {/* ═══ MAIN HERO CONTENT ═══ */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-3 text-center">

        {/* Tifinagh decorative row above title */}
        <div className="az-tifi-row flex items-center gap-4 mb-4" style={{ animation: 'azFadeDown 1s ease-out 0.2s both' }}>
          <div className="az-tifi-line" />
          <div className="az-tifi-symbols flex gap-3">
            {['ⵣ', '⵰', 'ⵜ', '⵰', 'ⵣ'].map((g, i) => (
              <span key={i} className="az-tifi-sym">{g}</span>
            ))}
          </div>
          <div className="az-tifi-line" />
        </div>

        {/* TITLE BLOCK with lantern glow behind */}
        <div className="az-title-block relative mb-4" style={{ animation: 'azFadeUp 1.1s ease-out 0.4s both' }}>
          {/* Diamond frame corners */}
          <span className="az-corner az-corner-tr" />
          <span className="az-corner az-corner-tl" />
          <span className="az-corner az-corner-br" />
          <span className="az-corner az-corner-bl" />

          <div className="az-title-inner px-8 md:px-14 py-4 md:py-6">
            <p className="az-eyebrow text-xs tracking-[0.3em] uppercase mb-3">البوابة الثقافية الرسمية</p>
            <h1 className="az-title text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-2" style={{ fontFamily: "'Amiri', serif" }}>
              منصة قطاع الثقافة
            </h1>
            <h1 className="az-title text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-2" style={{ fontFamily: "'Amiri', serif" }}>
              والفنون
            </h1>
            <div className="az-subtitle-badge inline-flex items-center gap-3 mt-2 px-6 py-2 rounded-sm">
              <span className="az-badge-sym">◆</span>
              <span className="az-badge-text text-2xl md:text-3xl" style={{ fontFamily: "'Amiri', serif" }}>خنشلة</span>
              <span className="az-badge-sym">◆</span>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p
          className="az-tagline text-sm md:text-base max-w-xl mx-auto mb-5 leading-relaxed"
          style={{ animation: 'azFadeUp 1s ease-out 0.7s both', fontFamily: "'Cairo', sans-serif" }}
        >
          فضاء رقمي متكامل يُعنى بتعزيز الإبداع ودعم الفاعلين الثقافيين والفنيين في ولاية خنشلة
        </p>

        {/* CTA BUTTON — diamond-bordered hexagonal shape */}
        <div
          className="az-cta-wrap mb-5"
          style={{ animation: 'azFadeUp 1s ease-out 1s both' }}
        >
          <button onClick={handleEnter} className="az-cta-btn group" aria-label="الدخول إلى المنصة">
            {/* Outer hexagon frame */}
            <span className="az-cta-hex-outer" />
            {/* Inner content */}
            <span className="az-cta-content relative z-10 flex flex-col items-center">
              <span className="az-cta-arabic" style={{ fontFamily: "'Amiri', serif" }}>مرحباً بكم</span>
              <span className="az-cta-sub" style={{ fontFamily: "'Cairo', sans-serif" }}>أدخل إلى المنصة</span>
            </span>
            {/* Glow ring on hover */}
            <span className="az-cta-glow-ring" />
          </button>
        </div>

        {/* ═══ ZARBIYA DIVIDER STRIP ═══ */}
        <div
          className="az-divider-strip w-full max-w-2xl mx-auto mb-5"
          style={{ animation: 'azDividerExpand 1.2s ease-out 1.2s both' }}
        >
          <div className="az-divider-inner" />
        </div>

        {/* ═══ NAVIGATION CARDS — Ceramic Tile / Stone Tablet style ═══ */}
        <div
          className="az-cards-grid grid grid-cols-2 md:flex md:items-stretch md:justify-center gap-4 md:gap-6 w-full max-w-3xl mx-auto"
          style={{ animation: 'azFadeUp 1s ease-out 1.3s both' }}
        >
          {/* Khenchela Profile */}
          <Link href="/about-khenchela" className="az-tile group">
            <div className="az-tile-border-top" />
            <div className="az-tile-border-bottom" />
            <div className="az-tile-corner-tl" />
            <div className="az-tile-corner-tr" />
            <div className="az-tile-corner-bl" />
            <div className="az-tile-corner-br" />
            <div className="az-tile-inner flex flex-col items-center gap-2 p-4">
              <div className="az-tile-icon">
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                  <path d="M6 38L14 20L20 30L28 14L34 26L42 38H6Z" fill="rgba(201,149,42,0.15)" stroke="#C9952A" strokeWidth="1.5" strokeLinejoin="round"/>
                  <circle cx="24" cy="12" r="3" fill="none" stroke="#C9952A" strokeWidth="1.5"/>
                  <path d="M24 15V20" stroke="#C9952A" strokeWidth="1" opacity="0.7"/>
                </svg>
              </div>
              <span className="az-tile-label">خنشلة</span>
            </div>
          </Link>

          {/* Archaeological Map */}
          <a
            href="https://www.google.com/maps/d/u/0/edit?mid=1pfr-rEbo1GhnW4Ba8v2ifv213Z79BnE&usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="az-tile group"
          >
            <div className="az-tile-border-top" />
            <div className="az-tile-border-bottom" />
            <div className="az-tile-corner-tl" />
            <div className="az-tile-corner-tr" />
            <div className="az-tile-corner-bl" />
            <div className="az-tile-corner-br" />
            <div className="az-tile-inner flex flex-col items-center gap-2 p-4">
              <div className="az-tile-icon">
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                  <path d="M8 12L16 8L32 14L40 10V36L32 40L16 34L8 38V12Z" fill="rgba(201,149,42,0.12)" stroke="#C9952A" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M16 8V34" stroke="#C9952A" strokeWidth="1" strokeDasharray="2 2"/>
                  <path d="M32 14V40" stroke="#C9952A" strokeWidth="1" strokeDasharray="2 2"/>
                  <circle cx="24" cy="24" r="5" fill="none" stroke="#C9952A" strokeWidth="1"/>
                  <path d="M24 19L25.2 24L24 29L22.8 24Z" fill="#C9952A"/>
                  <path d="M19 24L24 22.8L29 24L24 25.2Z" fill="#C9952A"/>
                </svg>
              </div>
              <span className="az-tile-label" style={{ fontSize: '0.75rem' }}>الخريطة الأثرية<br/>خنشلة</span>
            </div>
          </a>

          {/* Electronic Services */}
          <a href="/services" className="az-tile group">
            <div className="az-tile-border-top" />
            <div className="az-tile-border-bottom" />
            <div className="az-tile-corner-tl" />
            <div className="az-tile-corner-tr" />
            <div className="az-tile-corner-bl" />
            <div className="az-tile-corner-br" />
            <div className="az-tile-inner flex flex-col items-center gap-2 p-4">
              <div className="az-tile-icon">
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                  <rect x="8" y="8" width="13" height="13" rx="2" fill="rgba(201,149,42,0.12)" stroke="#C9952A" strokeWidth="1.5"/>
                  <rect x="27" y="8" width="13" height="13" rx="2" fill="rgba(201,149,42,0.12)" stroke="#C9952A" strokeWidth="1.5"/>
                  <rect x="8" y="27" width="13" height="13" rx="2" fill="rgba(201,149,42,0.12)" stroke="#C9952A" strokeWidth="1.5"/>
                  <rect x="27" y="27" width="13" height="13" rx="2" fill="rgba(201,149,42,0.12)" stroke="#C9952A" strokeWidth="1.5"/>
                  <circle cx="14.5" cy="14.5" r="2" fill="#C9952A" opacity="0.9"/>
                  <circle cx="33.5" cy="14.5" r="2" fill="#C9952A" opacity="0.9"/>
                  <circle cx="14.5" cy="33.5" r="2" fill="#C9952A" opacity="0.9"/>
                  <circle cx="33.5" cy="33.5" r="2" fill="#C9952A" opacity="0.9"/>
                </svg>
              </div>
              <span className="az-tile-label" style={{ fontSize: '0.75rem' }}>الخدمات<br/>الإلكترونية</span>
            </div>
          </a>

          {/* Contact Us */}
          <button onClick={() => setShowContact(true)} className="az-tile group">
            <div className="az-tile-border-top" />
            <div className="az-tile-border-bottom" />
            <div className="az-tile-corner-tl" />
            <div className="az-tile-corner-tr" />
            <div className="az-tile-corner-bl" />
            <div className="az-tile-corner-br" />
            <div className="az-tile-inner flex flex-col items-center gap-2 p-4">
              <div className="az-tile-icon">
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                  <path d="M14 10C12 10 10 12 10 14C10 26 22 38 34 38C36 38 38 36 38 34V30C38 28.5 37 27 35.5 27H31C29.5 27 28 28 28 29.5V31C24 29 19 24 17 20H18.5C20 20 21 18.5 21 17V12.5C21 11 19.5 10 18 10H14Z" fill="rgba(201,149,42,0.2)" stroke="#C9952A" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M30 10C34 12 37 16 38 20" stroke="#C9952A" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                </svg>
              </div>
              <span className="az-tile-label">اتصل بنا</span>
            </div>
          </button>
        </div>
      </div>

      {/* ═══ BOTTOM ZARBIYA STRIP ═══ */}
      <div className="az-bottom-strip relative z-10 flex-shrink-0 w-full">
        <div className="az-zarbiya-row" />
        <div className="az-zarbiya-text text-center py-2">
          <span className="az-zarbiya-caption">ⵉⴼⵙⵙ ⵏ ⵜⴰⵎⴰⵣⵉⵖⵜ — الثقافة الأمازيغية الخنشلية</span>
        </div>
      </div>

      {/* ═══ CONTACT MODAL ═══ */}
      {showContact && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" onClick={() => setShowContact(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            dir="rtl"
            className="az-modal relative w-full max-w-md rounded-sm p-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal corner ornaments */}
            <span className="az-modal-corner tl" /><span className="az-modal-corner tr" />
            <span className="az-modal-corner bl" /><span className="az-modal-corner br" />

            <button
              onClick={() => setShowContact(false)}
              className="absolute top-4 left-4 w-8 h-8 rounded-sm flex items-center justify-center az-modal-close"
            >✕</button>

            <div className="text-center mb-6">
              <div className="az-modal-icon-ring w-14 h-14 rounded-sm mx-auto mb-3 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
                  <path d="M14 10C12 10 10 12 10 14C10 26 22 38 34 38C36 38 38 36 38 34V30C38 28.5 37 27 35.5 27H31C29.5 27 28 28 28 29.5V31C24 29 19 24 17 20H18.5C20 20 21 18.5 21 17V12.5C21 11 19.5 10 18 10H14Z" fill="#2C2C2C" stroke="#2C2C2C" strokeWidth="1"/>
                </svg>
              </div>
              <h3 className="az-modal-title text-xl font-bold" style={{ fontFamily: "'Amiri', serif" }}>اتصل بنا</h3>
              <p className="az-modal-sub text-sm mt-1" style={{ fontFamily: "'Cairo', sans-serif" }}>مديرية الثقافة والفنون — ولاية خنشلة</p>
            </div>

            <div className="space-y-3">
              {[
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
                  label: 'الهاتف',
                  content: <a href="tel:+21332712345" style={{ direction: 'ltr', display: 'block', textAlign: 'right' }}>032 71 23 45</a>
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
                  label: 'البريد الإلكتروني',
                  content: <a href="mailto:direction.culture40k@gmail.com" className="hover:underline">direction.culture40k@gmail.com</a>
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
                  label: 'العنوان',
                  content: <span>مديرية الثقافة والفنون، خنشلة، الجزائر</span>
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                  label: 'أوقات العمل',
                  content: <span>الأحد - الخميس: 08:00 – 16:00</span>
                },
              ].map((item, i) => (
                <div key={i} className="az-modal-row flex items-center gap-3 p-3 rounded-sm">
                  <div className="az-modal-row-icon flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="az-modal-row-label text-xs mb-0.5" style={{ fontFamily: "'Cairo', sans-serif" }}>{item.label}</p>
                    <div className="az-modal-row-val text-sm font-medium" style={{ fontFamily: "'Cairo', sans-serif" }}>{item.content}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 text-center">
              <a
                href="https://www.facebook.com/share/1Cb5L3zNjg/"
                target="_blank"
                rel="noopener noreferrer"
                className="az-fb-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{ fontFamily: "'Cairo', sans-serif" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                تابعنا على فيسبوك
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
