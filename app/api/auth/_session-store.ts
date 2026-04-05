const activeSessions = new Map<string, number>()
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000

export function addSession(token: string) {
  cleanExpired()
  activeSessions.set(token, Date.now())
}

export function isValidSession(token: string): boolean {
  const created = activeSessions.get(token)
  if (!created) return false
  if (Date.now() - created > SESSION_MAX_AGE) {
    activeSessions.delete(token)
    return false
  }
  return true
}

export function removeSession(token: string) {
  activeSessions.delete(token)
}

function cleanExpired() {
  const now = Date.now()
  for (const [t, created] of activeSessions) {
    if (now - created > SESSION_MAX_AGE) {
      activeSessions.delete(t)
    }
  }
}
