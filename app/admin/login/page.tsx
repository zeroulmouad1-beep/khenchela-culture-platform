'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, user, configured } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) router.replace('/admin')
  }, [user, router])

  if (user) return null

  if (!configured) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0F172A' }}>
        <div className="text-center max-w-md rounded-xl border p-8" style={{ backgroundColor: '#1E293B', borderColor: '#334155' }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl" style={{ backgroundColor: '#B8733320', color: '#B87333' }}>
            ⚠
          </div>
          <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            بيانات الدخول غير مُهيأة
          </h2>
          <p className="text-sm" style={{ color: '#94A3B8', fontFamily: 'Tajawal, sans-serif' }}>
            يرجى إضافة متغيرات البيئة الخاصة بالمدير لتفعيل تسجيل الدخول
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await login(email, password)
      router.replace('/admin')
    } catch (err: unknown) {
      const code = err instanceof Error && 'code' in err ? (err as { code: string }).code : ''
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      } else if (code === 'auth/too-many-requests') {
        setError('تم تجاوز عدد المحاولات المسموح بها. يرجى المحاولة لاحقاً')
      } else if (code === 'auth/not-configured') {
        setError('بيانات الدخول غير مُهيأة في الخادم')
      } else {
        setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0F172A' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: '#B87333' }}>
            خ
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            لوحة الإدارة
          </h1>
          <p className="mt-2 text-sm" style={{ color: '#94A3B8', fontFamily: 'Amiri, serif' }}>
            منصة قطاع الثقافة والفنون - خنشلة
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl p-8 border" style={{ backgroundColor: '#1E293B', borderColor: '#334155' }}>
          <h2 className="text-xl font-bold text-white mb-6 text-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            تسجيل الدخول
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm" style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#FCA5A5', fontFamily: 'Tajawal, sans-serif' }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#D4956A', fontFamily: 'Tajawal, sans-serif' }}>
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-lg text-white text-sm outline-none transition-all"
                style={{ backgroundColor: '#0F172A', border: '1px solid #334155', fontFamily: 'Tajawal, sans-serif' }}
                onFocus={(e) => e.target.style.borderColor = '#B87333'}
                onBlur={(e) => e.target.style.borderColor = '#334155'}
                placeholder="admin@example.com"
                required
                dir="ltr"
              />
              <Mail size={16} className="absolute top-1/2 -translate-y-1/2 right-3" style={{ color: '#64748B' }} />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: '#D4956A', fontFamily: 'Tajawal, sans-serif' }}>
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 pl-10 rounded-lg text-white text-sm outline-none transition-all"
                style={{ backgroundColor: '#0F172A', border: '1px solid #334155', fontFamily: 'Tajawal, sans-serif' }}
                onFocus={(e) => e.target.style.borderColor = '#B87333'}
                onBlur={(e) => e.target.style.borderColor = '#334155'}
                placeholder="••••••••"
                required
                dir="ltr"
              />
              <Lock size={16} className="absolute top-1/2 -translate-y-1/2 right-3" style={{ color: '#64748B' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 -translate-y-1/2 left-3 cursor-pointer"
                style={{ color: '#64748B' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg text-white font-bold transition-all duration-300 disabled:opacity-50"
            style={{ backgroundColor: '#B87333', fontFamily: 'Tajawal, sans-serif' }}
            onMouseEnter={(e) => { if (!isLoading) (e.target as HTMLElement).style.backgroundColor = '#D4956A' }}
            onMouseLeave={(e) => { if (!isLoading) (e.target as HTMLElement).style.backgroundColor = '#B87333' }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري تسجيل الدخول...
              </span>
            ) : 'دخول'}
          </button>
        </form>

        <p className="text-center mt-6 text-xs" style={{ color: '#64748B', fontFamily: 'Tajawal, sans-serif' }}>
          © {new Date().getFullYear()} منصة قطاع الثقافة والفنون - خنشلة
        </p>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return <LoginForm />
}
