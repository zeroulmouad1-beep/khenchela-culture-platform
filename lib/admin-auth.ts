import { NextRequest } from 'next/server'
import { isValidSession } from '@/app/api/auth/_session-store'

export function isAdminAuthenticated(request: NextRequest): boolean {
  if (!process.env.SESSION_SECRET) return false
  const token = request.cookies.get('admin_session')?.value
  if (!token) return false
  return isValidSession(token)
}
