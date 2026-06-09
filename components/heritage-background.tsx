'use client'

export function HeritageBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <style>{`
        /* Zarbiya diamond tile pattern */
        .hb-zarbiya-tile {
          position: absolute;
          opacity: 0.045;
        }
        .hb-zarbiya-tile-1 {
          top: -80px; right: -80px;
          width: 420px; height: 420px;
          animation: hb-zarbiya-drift 38s ease-in-out infinite;
        }
        .hb-zarbiya-tile-2 {
          bottom: 10%; left: -60px;
          width: 340px; height: 340px;
          animation: hb-zarbiya-drift-2 44s ease-in-out infinite;
        }
        .hb-zarbiya-tile-3 {
          top: 40%; left: 50%;
          width: 260px; height: 260px;
          transform: translateX(-50%);
          animation: hb-fade-pulse 20s ease-in-out infinite;
          opacity: 0.025;
        }

        /* Pottery */
        .hb-pottery {
          position: absolute;
          color: #c9952a;
        }
        .hb-pottery-1 {
          bottom: 5%; right: 3%;
          width: 90px; opacity: 0.12;
          animation: hb-bob 14s ease-in-out infinite;
        }
        .hb-pottery-2 {
          top: 12%; left: 4%;
          width: 70px; opacity: 0.09;
          animation: hb-bob-2 18s ease-in-out infinite 3s;
        }
        .hb-pottery-3 {
          bottom: 18%; left: 28%;
          width: 55px; opacity: 0.07;
          animation: hb-bob-3 22s ease-in-out infinite 6s;
        }

        /* Mizmaar / flute */
        .hb-mizmaar {
          position: absolute;
          color: #c9952a;
        }
        .hb-mizmaar-1 {
          top: 8%; right: 18%;
          width: 130px; opacity: 0.08;
          animation: hb-rotate-drift 28s ease-in-out infinite;
        }
        .hb-mizmaar-2 {
          bottom: 28%; left: 8%;
          width: 100px; opacity: 0.06;
          animation: hb-rotate-drift-2 35s ease-in-out infinite 5s;
        }

        /* Radial ambient glows */
        .hb-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .hb-glow-1 {
          top: -10%;
          right: -5%;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(201,149,42,0.06) 0%, transparent 65%);
          animation: hb-drift-1 50s ease-in-out infinite;
        }
        .hb-glow-2 {
          bottom: -15%;
          left: -10%;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(139,58,42,0.07) 0%, transparent 65%);
          animation: hb-drift-2 60s ease-in-out infinite 8s;
        }
        .hb-glow-3 {
          top: 45%;
          left: 40%;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(201,149,42,0.04) 0%, transparent 60%);
          animation: hb-drift-3 45s ease-in-out infinite 15s;
        }
      `}</style>

      {/* Ambient glows */}
      <div className="hb-glow hb-glow-1" />
      <div className="hb-glow hb-glow-2" />
      <div className="hb-glow hb-glow-3" />

      {/* Zarbiya geometric diamond tile patterns */}
      <svg className="hb-zarbiya-tile hb-zarbiya-tile-1" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" fill="none">
        <defs>
          <pattern id="zarbiya1" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="#c9952a" strokeWidth="1.2"/>
            <polygon points="20,8 32,20 20,32 8,20" fill="none" stroke="#c9952a" strokeWidth="0.6"/>
            <circle cx="20" cy="20" r="2" fill="#c9952a" opacity="0.6"/>
            <line x1="20" y1="2" x2="20" y2="38" stroke="#c9952a" strokeWidth="0.4" opacity="0.4"/>
            <line x1="2" y1="20" x2="38" y2="20" stroke="#c9952a" strokeWidth="0.4" opacity="0.4"/>
          </pattern>
        </defs>
        <rect width="400" height="400" fill="url(#zarbiya1)"/>
      </svg>

      <svg className="hb-zarbiya-tile hb-zarbiya-tile-2" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg" fill="none">
        <defs>
          <pattern id="zarbiya2" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <polygon points="25,3 47,25 25,47 3,25" fill="none" stroke="#e0b060" strokeWidth="1.4"/>
            <polygon points="25,11 39,25 25,39 11,25" fill="none" stroke="#e0b060" strokeWidth="0.7"/>
            <polygon points="25,18 32,25 25,32 18,25" fill="#e0b060" opacity="0.5"/>
            <line x1="3" y1="3" x2="47" y2="47" stroke="#e0b060" strokeWidth="0.3" opacity="0.3"/>
            <line x1="47" y1="3" x2="3" y2="47" stroke="#e0b060" strokeWidth="0.3" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="340" height="340" fill="url(#zarbiya2)"/>
      </svg>

      <svg className="hb-zarbiya-tile hb-zarbiya-tile-3" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg" fill="none">
        <defs>
          <pattern id="zarbiya3" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <polygon points="16,2 30,16 16,30 2,16" fill="none" stroke="#c9952a" strokeWidth="1"/>
            <polygon points="16,7 25,16 16,25 7,16" fill="none" stroke="#c9952a" strokeWidth="0.5"/>
            <circle cx="16" cy="16" r="1.5" fill="#c9952a" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="260" height="260" fill="url(#zarbiya3)"/>
      </svg>

      {/* Clay Pottery Jar 1 — bottom right */}
      <svg className="hb-pottery hb-pottery-1" viewBox="0 0 70 100" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="35" cy="13" rx="14" ry="4.5" fill="currentColor" opacity="0.9"/>
        <rect x="29" y="9" width="12" height="8" fill="currentColor"/>
        <ellipse cx="35" cy="17" rx="14" ry="4" fill="currentColor"/>
        <path d="M21 17 Q12 36 11 52 Q11 72 35 76 Q59 72 59 52 Q58 36 49 17 Z" fill="currentColor" opacity="0.85"/>
        <path d="M21 32 Q9 38 10 50 Q11 56 18 52" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        <path d="M49 32 Q61 38 60 50 Q59 56 52 52" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        <ellipse cx="35" cy="75" rx="16" ry="4" fill="currentColor" opacity="0.6"/>
        <line x1="28" y1="38" x2="42" y2="38" stroke="rgba(26,15,10,0.3)" strokeWidth="1"/>
        <line x1="26" y1="46" x2="44" y2="46" stroke="rgba(26,15,10,0.3)" strokeWidth="0.8"/>
        <line x1="27" y1="54" x2="43" y2="54" stroke="rgba(26,15,10,0.25)" strokeWidth="0.6"/>
      </svg>

      {/* Clay Pottery Jar 2 — top left */}
      <svg className="hb-pottery hb-pottery-2" viewBox="0 0 60 88" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="30" cy="11" rx="11" ry="3.5" fill="currentColor" opacity="0.9"/>
        <rect x="25" y="8" width="10" height="7" fill="currentColor"/>
        <ellipse cx="30" cy="15" rx="11" ry="3.5" fill="currentColor"/>
        <path d="M19 15 Q11 30 10 45 Q10 64 30 67 Q50 64 50 45 Q49 30 41 15 Z" fill="currentColor" opacity="0.85"/>
        <path d="M19 28 Q9 33 10 43 Q11 48 17 45" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M41 28 Q51 33 50 43 Q49 48 43 45" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <ellipse cx="30" cy="66" rx="13" ry="3.5" fill="currentColor" opacity="0.6"/>
        <line x1="24" y1="33" x2="36" y2="33" stroke="rgba(26,15,10,0.3)" strokeWidth="0.8"/>
        <line x1="22" y1="40" x2="38" y2="40" stroke="rgba(26,15,10,0.25)" strokeWidth="0.6"/>
      </svg>

      {/* Clay Pottery Jar 3 — bottom center-left */}
      <svg className="hb-pottery hb-pottery-3" viewBox="0 0 50 72" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="25" cy="9" rx="9" ry="3" fill="currentColor" opacity="0.9"/>
        <rect x="21" y="7" width="8" height="6" fill="currentColor"/>
        <path d="M16 12 Q9 24 8 36 Q8 52 25 55 Q42 52 42 36 Q41 24 34 12 Z" fill="currentColor" opacity="0.85"/>
        <ellipse cx="25" cy="54" rx="11" ry="2.8" fill="currentColor" opacity="0.6"/>
        <line x1="20" y1="27" x2="30" y2="27" stroke="rgba(26,15,10,0.28)" strokeWidth="0.7"/>
        <line x1="19" y1="33" x2="31" y2="33" stroke="rgba(26,15,10,0.22)" strokeWidth="0.5"/>
      </svg>

      {/* Mizmaar / Berber Flute 1 — top right */}
      <svg className="hb-mizmaar hb-mizmaar-1" viewBox="0 0 160 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="9" width="140" height="6" rx="3" fill="currentColor" opacity="0.9"/>
        <ellipse cx="12" cy="12" rx="8" ry="8" fill="currentColor" opacity="0.9"/>
        <ellipse cx="8" cy="12" rx="3" ry="6" fill="currentColor" opacity="0.7"/>
        <circle cx="45" cy="12" r="2.2" fill="#1a0f0a" opacity="0.6"/>
        <circle cx="63" cy="12" r="2.2" fill="#1a0f0a" opacity="0.6"/>
        <circle cx="81" cy="12" r="2.2" fill="#1a0f0a" opacity="0.6"/>
        <circle cx="99" cy="12" r="2.2" fill="#1a0f0a" opacity="0.6"/>
        <circle cx="117" cy="12" r="2.2" fill="#1a0f0a" opacity="0.6"/>
        <circle cx="135" cy="12" r="1.8" fill="#1a0f0a" opacity="0.5"/>
        <rect x="150" y="10" width="6" height="4" rx="2" fill="currentColor" opacity="0.7"/>
        <line x1="14" y1="6" x2="14" y2="18" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
      </svg>

      {/* Mizmaar / Berber Flute 2 — bottom left */}
      <svg className="hb-mizmaar hb-mizmaar-2" viewBox="0 0 130 20" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="7" width="112" height="6" rx="3" fill="currentColor" opacity="0.9"/>
        <ellipse cx="10" cy="10" rx="7" ry="7" fill="currentColor" opacity="0.9"/>
        <ellipse cx="6" cy="10" rx="2.5" ry="5" fill="currentColor" opacity="0.7"/>
        <circle cx="36" cy="10" r="2" fill="#1a0f0a" opacity="0.6"/>
        <circle cx="52" cy="10" r="2" fill="#1a0f0a" opacity="0.6"/>
        <circle cx="68" cy="10" r="2" fill="#1a0f0a" opacity="0.6"/>
        <circle cx="84" cy="10" r="2" fill="#1a0f0a" opacity="0.6"/>
        <circle cx="100" cy="10" r="2" fill="#1a0f0a" opacity="0.5"/>
        <rect x="120" y="8" width="4" height="4" rx="2" fill="currentColor" opacity="0.6"/>
      </svg>
    </div>
  )
}
