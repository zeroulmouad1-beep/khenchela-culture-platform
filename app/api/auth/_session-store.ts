/**
 * Stateless session verification using HMAC-signed cookies.
 *
 * Cookie value = base64url( JSON { payload: "admin:<expires_ms>", sig: "<hmac>" } )
 *
 * No in-memory store needed — the server verifies the signature on every request.
 * Survives process restarts and works across multiple server instances.
 */

import crypto from 'crypto'

const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24 h

function getSecret(): string {
  const s = process.env.SESSION_SECRET
  if (!s) throw new Error('SESSION_SECRET is not configured')
  return s
}

export function createSessionToken(): string {
  const expires = Date.now() + SESSION_MAX_AGE_MS
  const payload = `admin:${expires}`
  const sig = crypto.createHmac('sha256', getSecret()).update(payload).digest('hex')
  return Buffer.from(JSON.stringify({ payload, sig })).toString('base64')
}

export function isValidSession(token: string): boolean {
  try {
    const secret = getSecret()
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const { payload, sig } = JSON.parse(decoded)
    if (typeof payload !== 'string' || typeof sig !== 'string') return false

    // Constant-time comparison to prevent timing attacks
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    const sigBuf = Buffer.from(sig, 'hex')
    const expBuf = Buffer.from(expected, 'hex')
    if (sigBuf.length !== expBuf.length) return false
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false

    // Check expiry
    const [, expiresStr] = payload.split(':')
    const expires = parseInt(expiresStr, 10)
    if (isNaN(expires) || Date.now() > expires) return false

    return true
  } catch {
    return false
  }
}

// Legacy no-ops kept so nothing else breaks during the transition
export function addSession(_token: string): void { /* stateless — no-op */ }
export function removeSession(_token: string): void { /* stateless — no-op */ }
