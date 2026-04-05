'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { auth, isConfigured } from '@/lib/firebase'
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

const DEV_MODE = process.env.NODE_ENV !== 'production'
const MOCK_MODE = DEV_MODE
const MOCK_EMAIL = 'admin'
const MOCK_PASSWORD = 'admin'

class AuthError extends Error {
  code: string
  constructor(code: string, message: string) {
    super(message)
    this.code = code
    this.name = 'AuthError'
  }
}

interface MockUser {
  email: string
  uid: string
  displayName: string | null
}

interface AuthContextType {
  user: User | MockUser | null
  loading: boolean
  configured: boolean
  mockMode: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | MockUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (MOCK_MODE) {
      const saved = typeof window !== 'undefined' && sessionStorage.getItem('mock_admin_auth')
      if (saved === 'true') {
        setUser({ email: 'admin@mock.local', uid: 'mock-admin', displayName: 'مدير النظام' })
      }
      setLoading(false)
      return
    }
    if (!auth) {
      setLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    if (MOCK_MODE) {
      if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
        const mockUser: MockUser = { email: 'admin@mock.local', uid: 'mock-admin', displayName: 'مدير النظام' }
        setUser(mockUser)
        if (typeof window !== 'undefined') sessionStorage.setItem('mock_admin_auth', 'true')
        return
      }
      throw new AuthError('auth/invalid-credential', 'Invalid credentials')
    }
    if (!auth) throw new Error('Firebase not configured')
    await signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    if (MOCK_MODE) {
      setUser(null)
      if (typeof window !== 'undefined') sessionStorage.removeItem('mock_admin_auth')
      return
    }
    if (!auth) return
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, configured: isConfigured || MOCK_MODE, mockMode: MOCK_MODE, login, logout }}>
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F172A' }}>
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#B87333', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!configured) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0F172A' }}>
        <div className="text-center max-w-md rounded-xl border p-8" style={{ backgroundColor: '#1E293B', borderColor: '#334155' }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl" style={{ backgroundColor: '#B8733320', color: '#B87333' }}>
            ⚠
          </div>
          <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            Firebase غير مُهيأ
          </h2>
          <p className="text-sm mb-4" style={{ color: '#94A3B8', fontFamily: 'Tajawal, sans-serif' }}>
            يرجى إضافة متغيرات البيئة الخاصة بـ Firebase لتفعيل لوحة الإدارة
          </p>
          <div className="text-left text-xs p-3 rounded-lg" style={{ backgroundColor: '#0F172A', color: '#64748B', fontFamily: 'monospace' }} dir="ltr">
            NEXT_PUBLIC_FIREBASE_API_KEY<br/>
            NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN<br/>
            NEXT_PUBLIC_FIREBASE_PROJECT_ID<br/>
            NEXT_PUBLIC_FIREBASE_APP_ID
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
