import { NextRequest } from 'next/server'
import { isValidSession } from '@/app/api/auth/_session-store'

export function isAdminAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_session')?.value
  if (!token) {
    console.log('[admin-auth] ❌ No admin_session cookie')
    return false
  }
  const valid = isValidSession(token)
  if (!valid) {
    console.log('[admin-auth] ❌ Session token invalid or expired')
  } else {
    console.log('[admin-auth] ✅ Session valid')
  }
  return valid
}
