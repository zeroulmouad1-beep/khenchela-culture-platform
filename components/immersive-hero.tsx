'use client'

import { useState } from 'react'
import Link from 'next/link'

const STAR_POSITIONS = [
  { x: '7%',  y: '9%',  r: 1,   d: 0.4 }, { x: '18%', y: '5%',  r: 1.3, d: 1.1 },
  { x: '28%', y: '14%', r: 0.9, d: 0.7 }, { x: '38%', y: '6%',  r: 1.1, d: 1.8 },
  { x: '52%', y: '11%', r: 0.8, d: 0.3 }, { x: '63%', y: '4%',  r: 1.4, d: 1.5 },
  { x: '75%', y: '10%', r: 1,   d: 0.9 }, { x: '85%', y: '6%',  r: 1.2, d: 0.5 },
  { x: '93%', y: '18%', r: 0.8, d: 1.3 }, { x: '11%', y: '28%', r: 1,   d: 2.0 },
  { x: '44%', y: '22%', r: 0.9, d: 0.6 }, { x: '58%', y: '30%', r: 1.1, d: 1.7 },
  { x: '79%', y: '24%', r: 0.8, d: 0.8 }, { x: '3%',  y: '40%', r: 1.3, d: 1.2 },
  { x: '22%', y: '45%', r: 0.7, d: 0.4 }, { x: '68%', y: '38%', r: 1,   d: 1.9 },
  { x: '91%', y: '44%', r: 1.2, d: 0.2 }, { x: '34%', y: '52%', r: 0.8, d: 1.4 },
  { x: '48%', y: '48%', r: 1,   d: 0.7 }, { x: '82%', y: '55%', r: 0.9, d: 1.0 },
]

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
      className={`km-root transition-all duration-700 ${isExiting ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`}
    >
      {/* ── Atmosphere ── */}
      <div className="km-bg-gradient absolute inset-0 pointer-events-none" />

      {/* ── Star field ── */}
      {STAR_POSITIONS.map((s, i) => (
        <span
          key={i}
          className="km-star absolute rounded-full pointer-events-none"
          style={{
            left: s.x,
            top: s.y,
            width: s.r * 2 + 'px',
            height: s.r * 2 + 'px',
            animationDelay: s.d + 's',
            animationDuration: (2.4 + s.d * 0.7) + 's',
          }}
        />
      ))}

      {/* ── Navbar ── */}
      <nav className="km-nav">
        <div className="flex items-center gap-3">
          <div className="km-logo-ring">
            <img
              src="/images/logo-culture.jpg"
              alt="مديرية الثقافة والفنون"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="km-brand-name block">منصة خنشلة</span>
            <span className="km-brand-sub block">KHENCHELA CULTURE</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-7">
          {[
            { label: 'الرئيسية', href: '#' },
            { label: 'المؤسسات', href: '#' },
            { label: 'الفعاليات', href: '#' },
            { label: 'التراث', href: '#' },
          ].map((item) => (
            <a key={item.label} href={item.href} className="km-nav-link">
              {item.label}
            </a>
          ))}
        </div>

        <div className="km-nav-badge hidden md:flex items-center gap-1.5">
          <span className="km-nav-badge-dot" />
          <span className="km-nav-badge-text">ولاية خنشلة</span>
        </div>
      </nav>

      {/* ── Golden rule ── */}
      <div className="km-top-rule" />

      {/* ── Main content ── */}
      <div className="km-content">

        {/* Eyebrow */}
        <div className="km-eyebrow">
          <span className="km-eyebrow-line" />
          <span className="km-eyebrow-text">البوابة الرسمية لقطاع الثقافة والفنون</span>
          <span className="km-eyebrow-line" />
        </div>

        {/* Title */}
        <h1
          className="km-title-main text-3xl md:text-4xl lg:text-[3.2rem]"
          style={{ animation: 'kmFadeUp 1s ease-out 0.65s both' }}
        >
          مديرية الثقافة والفنون
        </h1>

        {/* City name — gold gradient */}
        <span
          className="km-title-city text-5xl md:text-6xl lg:text-7xl"
          style={{ animation: 'kmFadeUp 1s ease-out 0.82s both, kmShimmer 6s linear 2.5s infinite' }}
        >
          خنشلة
        </span>

        {/* Wilaya badge */}
        <div
          className="km-wilaya-badge"
          style={{ animation: 'kmFadeIn 1s ease-out 1s both' }}
        >
          <span className="km-wilaya-dot" />
          <span className="km-wilaya-text">ولاية خنشلة — الجمهورية الجزائرية الديمقراطية الشعبية</span>
          <span className="km-wilaya-dot" />
        </div>

        {/* Tagline */}
        <p
          className="km-tagline text-sm md:text-base"
          style={{ animation: 'kmFadeUp 1s ease-out 1.05s both' }}
        >
          فضاء رقمي يُعنى بتعزيز الإبداع وصون التراث ودعم الفاعلين الثقافيين والفنيين
        </p>

        {/* CTA */}
        <div
          className="km-cta-wrap"
          style={{ animation: 'kmFadeUp 1s ease-out 1.2s both' }}
        >
          <button onClick={handleEnter} className="km-cta group">
            <span className="km-cta-text">اكتشف المنصة</span>
            <span className="km-cta-arrow">←</span>
          </button>
        </div>

        {/* Divider */}
        <div
          className="km-divider"
          style={{ animation: 'kmFadeIn 1s ease-out 1.35s both' }}
        >
          <span className="km-divider-line right" />
          <span className="km-divider-gem" />
          <span className="km-divider-gem-sm" />
          <span className="km-divider-gem" />
          <span className="km-divider-line left" />
        </div>

        {/* ── Navigation cards ── */}
        <div
          className="km-cards"
          style={{ animation: 'kmFadeUp 1s ease-out 1.45s both' }}
        >
          {/* خنشلة */}
          <Link href="/about-khenchela" className="km-card group">
            <div className="km-card-icon">
              <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
                <path d="M4 40 L12 22 L19 33 L28 14 L35 27 L44 40 Z"
                  fill="rgba(200,169,110,0.12)" stroke="#c8a96e" strokeWidth="1.5" strokeLinejoin="round"/>
                <circle cx="24" cy="11" r="2.5" fill="none" stroke="#c8a96e" strokeWidth="1.5"/>
                <path d="M24 13.5 V18" stroke="#c8a96e" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
                <path d="M8 40 Q16 36 24 37 Q32 36 40 40" stroke="#c8a96e" strokeWidth="1" opacity="0.4" fill="none"/>
              </svg>
            </div>
            <span className="km-card-label">خنشلة</span>
            <span className="km-card-sub">التعريف بالولاية</span>
          </Link>

          {/* الخريطة الأثرية */}
          <a
            href="https://www.google.com/maps/d/u/0/edit?mid=1pfr-rEbo1GhnW4Ba8v2ifv213Z79BnE&usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="km-card group"
          >
            <div className="km-card-icon">
              <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
                <path d="M8 10 L18 7 L30 12 L40 9 V38 L30 41 L18 36 L8 39 Z"
                  fill="rgba(200,169,110,0.1)" stroke="#c8a96e" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M18 7 V36 M30 12 V41" stroke="#c8a96e" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.5"/>
                <circle cx="24" cy="24" r="4.5" fill="none" stroke="#c8a96e" strokeWidth="1.2"/>
                <circle cx="24" cy="24" r="1.5" fill="#c8a96e" opacity="0.8"/>
              </svg>
            </div>
            <span className="km-card-label">الخريطة الأثرية</span>
            <span className="km-card-sub">مواقع خنشلة</span>
          </a>

          {/* الخدمات الإلكترونية */}
          <a href="/services" className="km-card group">
            <div className="km-card-icon">
              <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
                <rect x="7" y="7"  width="14" height="14" rx="2" fill="rgba(200,169,110,0.1)" stroke="#c8a96e" strokeWidth="1.5"/>
                <rect x="27" y="7"  width="14" height="14" rx="2" fill="rgba(200,169,110,0.1)" stroke="#c8a96e" strokeWidth="1.5"/>
                <rect x="7" y="27" width="14" height="14" rx="2" fill="rgba(200,169,110,0.1)" stroke="#c8a96e" strokeWidth="1.5"/>
                <rect x="27" y="27" width="14" height="14" rx="2" fill="rgba(200,169,110,0.1)" stroke="#c8a96e" strokeWidth="1.5"/>
                <circle cx="14" cy="14" r="2.5" fill="#c8a96e" opacity="0.85"/>
                <circle cx="34" cy="14" r="2.5" fill="#c8a96e" opacity="0.85"/>
                <circle cx="14" cy="34" r="2.5" fill="#c8a96e" opacity="0.85"/>
                <circle cx="34" cy="34" r="2.5" fill="#c8a96e" opacity="0.85"/>
              </svg>
            </div>
            <span className="km-card-label">الخدمات</span>
            <span className="km-card-sub">الإلكترونية</span>
          </a>

          {/* اتصل بنا */}
          <button onClick={() => setShowContact(true)} className="km-card group">
            <div className="km-card-icon">
              <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
                <path d="M13 9 C11 9 9 11 9 13 C9 27 21 39 35 39 C37 39 39 37 39 35 V30.5 C39 29 38 27.5 36 27.5 H31.5 C30 27.5 28.5 28.5 28.5 30 V31.5 C24 29.5 18.5 24 16.5 19.5 H18 C19.5 19.5 20.5 18 20.5 16.5 V12 C20.5 10.5 19 9 17.5 9 Z"
                  fill="rgba(200,169,110,0.15)" stroke="#c8a96e" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M30 9.5 C33.5 11 36.5 14.5 37.5 18.5" stroke="#c8a96e" strokeWidth="1.3" strokeLinecap="round" opacity="0.75"/>
                <path d="M26.5 13.5 C28.5 14.8 30.2 17 31 19.5" stroke="#c8a96e" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
              </svg>
            </div>
            <span className="km-card-label">اتصل بنا</span>
            <span className="km-card-sub">تواصل معنا</span>
          </button>
        </div>
      </div>

      {/* ── Landscape panorama ── */}
      <div className="km-landscape">
        <svg
          viewBox="0 0 1440 150"
          preserveAspectRatio="xMidYMax meet"
          width="100%"
          height="130"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="kmMountFar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#192030" />
              <stop offset="100%" stopColor="#0e1828" />
            </linearGradient>
            <linearGradient id="kmMountMid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#101620" />
              <stop offset="100%" stopColor="#0b0f18" />
            </linearGradient>
            <linearGradient id="kmGround" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d1218" />
              <stop offset="100%" stopColor="#0b0f18" />
            </linearGradient>
            <radialGradient id="kmMoonHalo" cx="71%" cy="0%" r="30%">
              <stop offset="0%" stopColor="rgba(200,169,110,0.07)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <linearGradient id="kmFogBottom" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="100%" stopColor="#0b0f18" stopOpacity="0.95"/>
            </linearGradient>
          </defs>

          {/* Moonlight atmospheric halo (top right) */}
          <ellipse cx="1024" cy="0" rx="280" ry="90" fill="url(#kmMoonHalo)" />

          {/* Far mountains — Djebel Chelia peak (highest 2328m, centered ~x=720) */}
          <path
            d="M0,118 C60,114 130,107 210,100 C270,95 330,86 390,78 C430,73 470,64 510,56
               C545,49 575,41 605,34 C630,28 655,22 680,17 C700,13 712,9 720,7
               C728,9 740,14 758,20 C780,27 808,36 840,46 C875,57 915,69 970,80
               C1030,92 1100,103 1180,109 C1260,115 1360,119 1440,121 L1440,150 L0,150 Z"
            fill="url(#kmMountFar)"
          />

          {/* Snow cap hint on Chelia summit */}
          <path
            d="M707,10 C711,5 717,2 720,1 C723,2 729,6 733,11 C729,8 724,7 720,8 C716,7 711,9 707,10 Z"
            fill="rgba(200,169,110,0.12)"
          />

          {/* Second range */}
          <path
            d="M0,134 C80,130 180,123 280,127 C360,130 420,118 480,113
               C520,109 555,106 590,107 C620,108 650,104 680,102
               C700,101 712,99 720,98 C728,99 740,102 760,104
               C790,107 830,112 890,117 C960,123 1040,129 1140,134
               C1260,139 1370,140 1440,141 L1440,150 L0,150 Z"
            fill="url(#kmMountMid)"
          />

          {/* Roman arch LEFT — Mascula ruins */}
          <g opacity="0.55">
            <rect x="155" y="122" width="6" height="28" fill="#0d1929" />
            <rect x="193" y="122" width="6" height="28" fill="#0d1929" />
            <path d="M155,124 Q177,102 199,124" stroke="#0d1929" strokeWidth="6" fill="none" />
            <rect x="150" y="119" width="54" height="5" rx="1" fill="#0d1929" />
            <rect x="150" y="117" width="14" height="3" fill="#0d1929" />
            <rect x="190" y="117" width="14" height="3" fill="#0d1929" />
          </g>

          {/* Lone column — far left */}
          <g opacity="0.38">
            <rect x="64" y="128" width="5" height="22" fill="#111e2c" />
            <rect x="60" y="126" width="13" height="3" rx="1" fill="#111e2c" />
          </g>

          {/* Roman arch RIGHT */}
          <g opacity="0.5">
            <rect x="1250" y="120" width="6" height="30" fill="#0d1929" />
            <rect x="1287" y="120" width="6" height="30" fill="#0d1929" />
            <path d="M1250,122 Q1272,100 1293,122" stroke="#0d1929" strokeWidth="6" fill="none" />
            <rect x="1245" y="117" width="53" height="5" rx="1" fill="#0d1929" />
            <rect x="1245" y="115" width="14" height="3" fill="#0d1929" />
            <rect x="1285" y="115" width="14" height="3" fill="#0d1929" />
          </g>

          {/* Lone column far right */}
          <g opacity="0.35">
            <rect x="1380" y="129" width="5" height="21" fill="#111e2c" />
            <rect x="1376" y="127" width="13" height="3" rx="1" fill="#111e2c" />
          </g>

          {/* Foreground ground */}
          <path
            d="M0,145 Q360,139 720,143 Q1080,147 1440,142 L1440,150 L0,150 Z"
            fill="url(#kmGround)"
          />

          {/* Fog overlay at bottom */}
          <rect x="0" y="90" width="1440" height="60" fill="url(#kmFogBottom)" />
        </svg>
      </div>

      {/* ── Bottom strip ── */}
      <div className="km-bottom-strip">
        <span className="km-bottom-text">
          مديرية الثقافة والفنون — ولاية خنشلة · Direction de la Culture et des Arts — Wilaya de Khenchela
        </span>
      </div>

      {/* ══════════════════════════════
          CONTACT MODAL
          ══════════════════════════════ */}
      {showContact && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={() => setShowContact(false)}
        >
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
          <div
            dir="rtl"
            className="km-modal relative w-full max-w-md p-8 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center km-modal-close text-sm"
            >✕</button>

            <div className="text-center mb-6">
              <div className="km-modal-icon-ring w-14 h-14 mx-auto mb-3 flex items-center justify-center">
                <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
                  <path d="M13 9 C11 9 9 11 9 13 C9 27 21 39 35 39 C37 39 39 37 39 35 V30.5 C39 29 38 27.5 36 27.5 H31.5 C30 27.5 28.5 28.5 28.5 30 V31.5 C24 29.5 18.5 24 16.5 19.5 H18 C19.5 19.5 20.5 18 20.5 16.5 V12 C20.5 10.5 19 9 17.5 9 Z"
                    fill="rgba(200,169,110,0.15)" stroke="#c8a96e" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="km-modal-title text-xl font-bold mb-1">اتصل بنا</h3>
              <p className="km-modal-sub text-sm">مديرية الثقافة والفنون — ولاية خنشلة</p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 12 19.79 19.79 0 0 1 1.04 3.33 2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
                  label: 'الهاتف',
                  content: <a href="tel:+21332712345" style={{ direction: 'ltr', display: 'block', textAlign: 'right' }}>032 71 23 45</a>
                },
                {
                  icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
                  label: 'البريد الإلكتروني',
                  content: <a href="mailto:direction.culture40k@gmail.com" className="hover:underline">direction.culture40k@gmail.com</a>
                },
                {
                  icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
                  label: 'العنوان',
                  content: <span>مديرية الثقافة والفنون، خنشلة، الجزائر</span>
                },
                {
                  icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                  label: 'أوقات العمل',
                  content: <span>الأحد — الخميس: 08:00 – 16:00</span>
                },
              ].map((item, i) => (
                <div key={i} className="km-modal-row flex items-center gap-3 p-3">
                  <div className="km-modal-row-icon flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="km-modal-row-label mb-0.5">{item.label}</p>
                    <div className="km-modal-row-val">{item.content}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 text-center">
              <a
                href="https://www.facebook.com/share/1Cb5L3zNjg/"
                target="_blank"
                rel="noopener noreferrer"
                className="km-fb-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                تابعنا على فيسبوك
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
