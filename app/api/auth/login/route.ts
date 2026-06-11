import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken } from '../_session-store'

const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
    const attempts = loginAttempts.get(clientIp)
    if (attempts && attempts.count >= MAX_ATTEMPTS) {
      const elapsed = Date.now() - attempts.lastAttempt
      if (elapsed < LOCKOUT_DURATION) {
        return NextResponse.json({ error: 'too_many_attempts' }, { status: 429 })
      }
      loginAttempts.delete(clientIp)
    }

    const { email, password } = await request.json()

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    const sessionSecret = process.env.SESSION_SECRET

    if (!adminEmail || !adminPassword || !sessionSecret) {
      console.error('[login] Missing env vars — ADMIN_EMAIL:', !!adminEmail, 'ADMIN_PASSWORD:', !!adminPassword, 'SESSION_SECRET:', !!sessionSecret)
      return NextResponse.json({ error: 'credentials_not_configured' }, { status: 500 })
    }

    if (email === adminEmail && password === adminPassword) {
      loginAttempts.delete(clientIp)

      const token = createSessionToken()
      console.log('[login] ✅ Login success — stateless token created (no in-memory store)')

      const response = NextResponse.json({
        success: true,
        user: { email: adminEmail, uid: 'admin', displayName: 'مدير النظام' }
      })
      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      })
      return response
    }

    const current = loginAttempts.get(clientIp) || { count: 0, lastAttempt: 0 }
    loginAttempts.set(clientIp, { count: current.count + 1, lastAttempt: Date.now() })
    console.log('[login] ❌ Invalid credentials for:', email)

    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 })
  } catch (err: any) {
    console.error('[login] server_error:', err?.message)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
