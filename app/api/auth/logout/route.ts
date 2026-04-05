import { NextRequest, NextResponse } from 'next/server'
import { removeSession } from '../_session-store'

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value
  if (token) {
    removeSession(token)
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return response
}
