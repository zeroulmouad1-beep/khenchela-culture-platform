'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { Shield, Lock } from 'lucide-react'

const COPPER = '#c9952a'
const COPPER_LIGHT = '#e0b060'
const BG = '#0f0a06'
const CARD_BG = '#1a100a'
const BORDER = '#2a1a0e'
const SESSION_KEY = 'admin_gate_v1'

// The access code. Set NEXT_PUBLIC_ADMIN_PIN in your environment to override.
// Falls back to this default when the env var is not present.
const ACCESS_CODE =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ADMIN_PIN) || '2691'

export function AdminAccessGate({ children }: { children: React.ReactNode }) {
  const [approved, setApproved] = useState<boolean | null>(null)
  const [digits, setDigits] = useState(['', '', '', ''])
  const [shake, setShake] = useState(false)
  const [hint, setHint] = useState('')
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY)
      setApproved(stored === 'yes')
    } catch {
      setApproved(false)
    }
  }, [])

  function handleDigit(index: number, value: string) {
    const d = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = d
    setDigits(next)
    setHint('')
    if (d && index < 3) {
      refs[index + 1].current?.focus()
    }
    if (index === 3 && d) {
      const code = [...next.slice(0, 3), d].join('')
      verify(code)
    }
  }

  function handleKey(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs[index - 1].current?.focus()
    }
    if (e.key === 'Enter') {
      const code = digits.join('')
      if (code.length === 4) verify(code)
    }
  }

  function verify(code: string) {
    if (code === ACCESS_CODE) {
      try { sessionStorage.setItem(SESSION_KEY, 'yes') } catch { /* */ }
      setApproved(true)
    } else {
      setShake(true)
      setHint('رمز الدخول غير صحيح')
      setDigits(['', '', '', ''])
      setTimeout(() => {
        setShake(false)
        refs[0].current?.focus()
      }, 600)
    }
  }

  if (approved === null) return null

  if (approved) return <>{children}</>

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        backgroundColor: BG,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Tajawal, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%', maxWidth: 380,
          backgroundColor: CARD_BG,
          border: `1px solid ${BORDER}`,
          borderRadius: 20,
          padding: '40px 36px',
          textAlign: 'center',
          animation: shake ? 'gate-shake 0.5s ease' : 'none',
        }}
      >
        <style>{`
          @keyframes gate-shake {
            0%,100% { transform: translateX(0); }
            15%      { transform: translateX(-10px); }
            30%      { transform: translateX(10px); }
            45%      { transform: translateX(-8px); }
            60%      { transform: translateX(8px); }
            75%      { transform: translateX(-4px); }
            90%      { transform: translateX(4px); }
          }
        `}</style>

        <div style={{
          width: 60, height: 60, borderRadius: '50%', margin: '0 auto 20px',
          backgroundColor: `${COPPER}18`,
          border: `1.5px solid ${COPPER}50`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Shield size={26} style={{ color: COPPER }} />
        </div>

        <div style={{ fontSize: 20, fontWeight: 700, color: '#f0e6d3', marginBottom: 6 }}>
          منصة قطاع الثقافة
        </div>
        <div style={{ fontSize: 13, color: '#7a6050', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Lock size={12} />
          أدخل رمز الدخول للمتابعة
        </div>

        <form
          onSubmit={e => { e.preventDefault(); verify(digits.join('')) }}
          style={{ margin: 0 }}
        >
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={refs[i]}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={d}
                autoComplete="one-time-code"
                onChange={e => handleDigit(i, e.target.value)}
                onKeyDown={e => handleKey(i, e)}
                autoFocus={i === 0}
                style={{
                  width: 54, height: 60,
                  borderRadius: 12,
                  border: `1.5px solid ${d ? COPPER : BORDER}`,
                  backgroundColor: '#110c07',
                  color: '#f0e6d3',
                  fontSize: 24,
                  textAlign: 'center',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  caretColor: COPPER,
                }}
              />
            ))}
          </div>

          {hint && (
            <div style={{ fontSize: 13, color: '#f87171', marginBottom: 8 }}>{hint}</div>
          )}

          <button
            type="submit"
            disabled={digits.join('').length < 4}
            style={{
              width: '100%', padding: '12px 0', borderRadius: 10,
              backgroundColor: digits.join('').length === 4 ? COPPER : '#2a1a0e',
              color: digits.join('').length === 4 ? '#0f0a06' : '#5a4030',
              fontFamily: 'Tajawal, sans-serif', fontWeight: 700, fontSize: 15,
              border: 'none', cursor: digits.join('').length === 4 ? 'pointer' : 'default',
              transition: 'background-color 0.2s, color 0.2s',
              marginTop: 4,
            }}
          >
            دخول
          </button>
        </form>

        <div style={{ marginTop: 20, fontSize: 11, color: '#3a2510' }}>
          خنشلة — مديرية الثقافة والفنون
        </div>
      </div>
    </div>
  )
}
