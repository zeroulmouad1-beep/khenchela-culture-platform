const SESSION_MAX_AGE = 24 * 60 * 60 * 1000

declare global {
  // eslint-disable-next-line no-var
  var _activeSessions: Map<string, number> | undefined
}

function getSessions(): Map<string, number> {
  if (!global._activeSessions) {
    global._activeSessions = new Map<string, number>()
  }
  return global._activeSessions
}

export function addSession(token: string) {
  const sessions = getSessions()
  cleanExpired(sessions)
  sessions.set(token, Date.now())
}

export function isValidSession(token: string): boolean {
  const sessions = getSessions()
  const created = sessions.get(token)
  if (!created) return false
  if (Date.now() - created > SESSION_MAX_AGE) {
    sessions.delete(token)
    return false
  }
  return true
}

export function removeSession(token: string) {
  getSessions().delete(token)
}

function cleanExpired(sessions: Map<string, number>) {
  const now = Date.now()
  for (const [t, created] of sessions) {
    if (now - created > SESSION_MAX_AGE) {
      sessions.delete(t)
    }
  }
}
