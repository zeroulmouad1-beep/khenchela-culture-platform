import { NextRequest, NextResponse } from 'next/server'
import { isValidSession } from '../_session-store'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value

  if (!process.env.SESSION_SECRET) {
    return NextResponse.json({ authenticated: false })
  }

  if (token && isValidSession(token)) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin'
    return NextResponse.json({
      authenticated: true,
      user: { email: adminEmail, uid: 'admin', displayName: 'مدير النظام' }
    })
  }

  return NextResponse.json({ authenticated: false })
}
