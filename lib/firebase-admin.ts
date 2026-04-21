import { getApps, initializeApp, cert, App } from 'firebase-admin/app'
import { getFirestore, FieldValue, Firestore } from 'firebase-admin/firestore'

let cachedApp: App | null = null
let cachedDb: Firestore | null = null

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!raw) throw new Error('FIREBASE_SERVICE_ACCOUNT is not set')
  let parsed: any
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('FIREBASE_SERVICE_ACCOUNT is not valid JSON')
  }
  if (parsed.private_key && typeof parsed.private_key === 'string') {
    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n')
  }
  return parsed
}

export function getAdminApp(): App {
  if (cachedApp) return cachedApp
  const existing = getApps()
  if (existing.length > 0) {
    cachedApp = existing[0]!
    return cachedApp
  }
  const sa = getServiceAccount()
  cachedApp = initializeApp({
    credential: cert({
      projectId: sa.project_id,
      clientEmail: sa.client_email,
      privateKey: sa.private_key,
    }),
    projectId: sa.project_id,
  })
  return cachedApp
}

export function getAdminDb(): Firestore {
  if (cachedDb) return cachedDb
  cachedDb = getFirestore(getAdminApp())
  return cachedDb
}

export { FieldValue }
