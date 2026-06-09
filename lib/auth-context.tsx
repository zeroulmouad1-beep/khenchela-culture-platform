'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AdminUser {
  email: string
  uid: string
  displayName: string | null
}

interface AuthContextType {
  user: AdminUser | null
  loading: boolean
  configured: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

class AuthError extends Error {
  code: string
  constructor(code: string, message: string) {
    super(message)
    this.code = code
    this.name = 'AuthError'
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [configured, setConfigured] = useState(true)

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session')
        const data = await res.json()
        if (data.authenticated && data.user) {
          setUser(data.user)
        }
      } catch {
        // session check failed silently
      } finally {
        setLoading(false)
      }
    }
    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      if (data.error === 'credentials_not_configured') {
        setConfigured(false)
        throw new AuthError('auth/not-configured', 'Admin credentials not configured')
      }
      if (data.error === 'too_many_attempts') {
        throw new AuthError('auth/too-many-requests', 'Too many login attempts')
      }
      throw new AuthError('auth/invalid-credential', 'Invalid credentials')
    }

    setUser(data.user)
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // logout request failed silently
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, configured, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading, configured } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a0f0a' }}>
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#c9952a', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!configured) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#1a0f0a' }}>
        <div className="text-center max-w-md rounded-xl border p-8" style={{ backgroundColor: '#1e1610', borderColor: '#2a1e14' }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl" style={{ backgroundColor: '#c9952a20', color: '#c9952a' }}>
            ⚠
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#f0e6d3', fontFamily: 'Tajawal, sans-serif' }}>
            بيانات الدخول غير مُهيأة
          </h2>
          <p className="text-sm mb-4" style={{ color: '#a89070', fontFamily: 'Tajawal, sans-serif' }}>
            يرجى إضافة متغيرات البيئة الخاصة بالمدير لتفعيل لوحة الإدارة
          </p>
          <div className="text-left text-xs p-3 rounded-lg" style={{ backgroundColor: '#1a0f0a', color: '#a89070', fontFamily: 'monospace' }} dir="ltr">
            ADMIN_EMAIL<br/>
            ADMIN_PASSWORD
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
