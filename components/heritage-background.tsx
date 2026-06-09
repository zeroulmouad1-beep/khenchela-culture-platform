export function HeritageBackground() {
  return (
    <>
      {/* ── Layer 1: Zarbiya pattern + ambient glow (behind all content) ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Zarbiya drifting carpet pattern */}
        <div style={{
          position: 'absolute',
          inset: '-15%',
          width: '130%',
          height: '130%',
          opacity: 0.08,
          willChange: 'transform',
          animation: 'hbgZarbiyaDrift 50s linear infinite',
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="hbgZarbiyaTile" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
                <polygon points="32,2 62,32 32,62 2,32"   fill="none" stroke="#c9952a" strokeWidth="1.6" />
                <polygon points="32,14 50,32 32,50 14,32" fill="none" stroke="#c9952a" strokeWidth="1.0" />
                <polygon points="32,22 42,32 32,42 22,32" fill="none" stroke="#e0b060" strokeWidth="0.7" />
                <line x1="32" y1="2"  x2="32" y2="9"  stroke="#c9952a" strokeWidth="1.2" />
                <line x1="32" y1="55" x2="32" y2="62" stroke="#c9952a" strokeWidth="1.2" />
                <line x1="2"  y1="32" x2="9"  y2="32" stroke="#c9952a" strokeWidth="1.2" />
                <line x1="55" y1="32" x2="62" y2="32" stroke="#c9952a" strokeWidth="1.2" />
                <circle cx="32" cy="2"  r="2" fill="#c9952a" />
                <circle cx="62" cy="32" r="2" fill="#c9952a" />
                <circle cx="32" cy="62" r="2" fill="#c9952a" />
                <circle cx="2"  cy="32" r="2" fill="#c9952a" />
                <polyline points="2,32 11,23 20,32 11,41 2,32"   fill="none" stroke="#e0b060" strokeWidth="0.7" />
                <polyline points="62,32 53,23 44,32 53,41 62,32" fill="none" stroke="#e0b060" strokeWidth="0.7" />
                <polyline points="32,2 23,11 32,20 41,11 32,2"   fill="none" stroke="#e0b060" strokeWidth="0.7" />
                <polyline points="32,62 23,53 32,44 41,53 32,62" fill="none" stroke="#e0b060" strokeWidth="0.7" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hbgZarbiyaTile)" />
          </svg>
        </div>

        {/* Ambient candlelight glow */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vmax', height: '90vmax',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,149,42,0.32) 0%, rgba(201,149,42,0.14) 28%, rgba(139,58,42,0.07) 52%, transparent 70%)',
          willChange: 'opacity, transform',
          animation: 'hbgAmbientPulse 8s ease-in-out infinite',
        }} />
      </div>

      {/* ── Layer 2: Heritage objects + embers (screen blend — brightens, never covers) ──
          mix-blend-mode: screen means these objects LIGHTEN whatever is below them.
          At 18% opacity this is a subtle gold shimmer that never obscures text.        */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
          overflow: 'hidden',
          mixBlendMode: 'screen',
        }}
      >
        {/* Pottery jar — bottom-left corner */}
        <div style={{
          position: 'absolute', bottom: '2%', left: '1%',
          opacity: 0.18, willChange: 'transform',
          animation: 'hbgBob1 11s ease-in-out infinite',
        }}>
          {/* 30% smaller: 140→98, 194→136 */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 72" width="98" height="136" fill="#c9952a">
            <ellipse cx="26" cy="8"  rx="9"  ry="3.2" />
            <path d="M17,8 C15,9 14,11 14,14 L38,14 C38,11 37,9 35,8 Z" />
            <path d="M14,14 C7,21 5,32 7,43 C9,54 16,62 26,63 C36,62 43,54 45,43 C47,32 45,21 38,14 Z" />
            <ellipse cx="26" cy="63" rx="11" ry="3.2" opacity="0.8" />
            <path d="M14,26 C9,26 7,31 9,36 C10,38 13,38 14,36"
              fill="none" stroke="#c9952a" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M38,26 C43,26 45,31 43,36 C42,38 39,38 38,36"
              fill="none" stroke="#c9952a" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M10,34 Q26,30 42,34" fill="none" stroke="#e0b060" strokeWidth="1.4" opacity="0.6" />
            <path d="M10,40 Q26,36 42,40" fill="none" stroke="#e0b060" strokeWidth="1.1" opacity="0.5" />
            <path d="M11,46 Q26,43 41,46" fill="none" stroke="#e0b060" strokeWidth="0.9" opacity="0.4" />
          </svg>
        </div>

        {/* Pottery jar — top-right corner */}
        <div style={{
          position: 'absolute', top: '3%', right: '1%',
          opacity: 0.18, willChange: 'transform',
          animation: 'hbgBob2 14s ease-in-out infinite 2s',
        }}>
          {/* 30% smaller: 115→80, 162→113 */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 62" width="80" height="113" fill="#e0b060">
            <ellipse cx="22" cy="7"  rx="8"  ry="2.8" />
            <path d="M14,7 C12,8 12,10 12,12 L32,12 C32,10 32,8 30,7 Z" />
            <path d="M12,12 C5,19 4,30 6,40 C8,50 14,56 22,57 C30,56 36,50 38,40 C40,30 39,19 32,12 Z" />
            <ellipse cx="22" cy="57" rx="9"  ry="2.8" opacity="0.8" />
            <path d="M14,26 C10,26 8,30 10,34 C11,36 13,36 14,34"
              fill="none" stroke="#e0b060" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M30,26 C34,26 36,30 34,34 C33,36 31,36 30,34"
              fill="none" stroke="#e0b060" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M9,30 Q22,26 35,30" fill="none" stroke="#c9952a" strokeWidth="1.1" opacity="0.55" />
            <path d="M8,36 Q22,32 36,36" fill="none" stroke="#c9952a" strokeWidth="0.9" opacity="0.45" />
            <path d="M9,42 Q22,38 35,42" fill="none" stroke="#c9952a" strokeWidth="0.7" opacity="0.35" />
          </svg>
        </div>

        {/* Mizmaar (reed flute) — bottom-right corner */}
        <div style={{
          position: 'absolute', bottom: '2%', right: '2%',
          opacity: 0.18, willChange: 'transform',
          transformOrigin: '50% 80%',
          animation: 'hbgMizmaar 20s ease-in-out infinite',
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 112" width="36" height="182" fill="#c9952a">
            <path d="M7,2 C7,2 9,1 11,2 C13,1 15,2 15,4 L14,10 L8,10 Z" />
            <rect x="8" y="10" width="6" height="94" rx="3" />
            <circle cx="11" cy="26" r="2" fill="#3d1a00" opacity="0.8" />
            <circle cx="11" cy="36" r="2" fill="#3d1a00" opacity="0.8" />
            <circle cx="11" cy="46" r="2" fill="#3d1a00" opacity="0.8" />
            <circle cx="11" cy="56" r="2" fill="#3d1a00" opacity="0.8" />
            <circle cx="11" cy="66" r="2" fill="#3d1a00" opacity="0.8" />
            <circle cx="11" cy="76" r="2" fill="#3d1a00" opacity="0.8" />
            <ellipse cx="11" cy="104" rx="3" ry="1.4" />
          </svg>
        </div>

        {/* 8-pointed geometric star — top-left corner */}
        <div style={{
          position: 'absolute', top: '3%', left: '2%',
          opacity: 0.18, willChange: 'transform',
          transformOrigin: '50% 50%',
          animation: 'hbgStarSpin 70s linear infinite',
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100" height="100">
            <rect x="14" y="14" width="36" height="36" fill="#c9952a" />
            <rect x="14" y="14" width="36" height="36" fill="#c9952a" transform="rotate(45 32 32)" />
            <circle cx="32" cy="32" r="9" fill="#000" />
            <polygon
              points="32,25 34.5,30 40,30 35.5,33.5 37.5,39 32,35.5 26.5,39 28.5,33.5 24,30 29.5,30"
              fill="#c9952a"
            />
          </svg>
        </div>

        {/* Zarbiya shimmer overlay */}
        <div style={{
          position: 'absolute',
          inset: '-15%',
          width: '130%',
          height: '130%',
          opacity: 0.08,
          willChange: 'transform',
          animation: 'hbgZarbiyaDrift 50s linear infinite',
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="hbgZarbiyaScreen" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
                <polygon points="32,2 62,32 32,62 2,32"   fill="none" stroke="#c9952a" strokeWidth="1.6" />
                <polygon points="32,14 50,32 32,50 14,32" fill="none" stroke="#c9952a" strokeWidth="1.0" />
                <circle cx="32" cy="2"  r="2" fill="#c9952a" />
                <circle cx="62" cy="32" r="2" fill="#c9952a" />
                <circle cx="32" cy="62" r="2" fill="#c9952a" />
                <circle cx="2"  cy="32" r="2" fill="#c9952a" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hbgZarbiyaScreen)" />
          </svg>
        </div>

        {/* Ember particles */}
        {([
          { left: '12%', size: 5, dur: '5.8s', delay: '0s'   },
          { left: '22%', size: 4, dur: '7.2s', delay: '1.4s' },
          { left: '34%', size: 5, dur: '6.1s', delay: '2.8s' },
          { left: '45%', size: 4, dur: '8.4s', delay: '0.6s' },
          { left: '56%', size: 6, dur: '5.4s', delay: '3.2s' },
          { left: '66%', size: 4, dur: '7.8s', delay: '1.9s' },
          { left: '76%', size: 5, dur: '6.6s', delay: '4.1s' },
          { left: '84%', size: 4, dur: '9.0s', delay: '0.3s' },
          { left: '28%', size: 4, dur: '6.9s', delay: '5.0s' },
          { left: '61%', size: 5, dur: '7.5s', delay: '2.2s' },
        ] as { left: string; size: number; dur: string; delay: string }[]).map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: '2%',
              left: p.left,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: '#f0c060',
              boxShadow: `0 0 ${p.size * 4}px ${p.size * 2}px rgba(240,192,96,0.85)`,
              willChange: 'transform, opacity',
              animation: `hbgEmber ${p.dur} ease-in infinite ${p.delay}`,
            }}
          />
        ))}
      </div>
    </>
  )
}
