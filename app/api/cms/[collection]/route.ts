import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb, FieldValue } from '@/lib/firebase-admin'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { isAllowedCollection } from '../_allowed'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ collection: string }> }
) {
  const authOk = isAdminAuthenticated(request)
  if (!authOk) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { collection } = await context.params
  if (!isAllowedCollection(collection)) {
    return NextResponse.json({ error: 'forbidden_collection' }, { status: 403 })
  }

  try {
    const db = getAdminDb()
    // Order by updatedAt desc so docs[0] is always the most recently saved document
    let snapshot
    try {
      snapshot = await db.collection(collection).orderBy('updatedAt', 'desc').get()
    } catch {
      snapshot = await db.collection(collection).get()
    }
    const docs = snapshot.docs.map(d => {
      const data = d.data()
      // Convert Firestore Timestamps to ISO strings so they serialise cleanly
      const cleaned: Record<string, any> = { id: d.id }
      for (const [k, v] of Object.entries(data)) {
        cleaned[k] = v && typeof v === 'object' && 'toDate' in v ? v.toDate().toISOString() : v
      }
      return cleaned
    })
    console.log(`[CMS GET] collection="${collection}" — returned ${docs.length} docs`)
    return NextResponse.json({ docs })
  } catch (err: any) {
    console.error(`[CMS GET] ❌ read failed:`, err?.message ?? err)
    return NextResponse.json({ error: 'read_failed', detail: err?.message ?? String(err) }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ collection: string }> }
) {
  const authOk = isAdminAuthenticated(request)
  console.log(`[CMS POST] auth=${authOk}, cookie=${!!request.cookies.get('admin_session')?.value}`)
  if (!authOk) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { collection } = await context.params
  console.log(`[CMS POST] collection="${collection}"`)

  if (!isAllowedCollection(collection)) {
    return NextResponse.json({ error: 'forbidden_collection' }, { status: 403 })
  }

  let body: Record<string, any>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const payload = {
    ...body,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }
  console.log(`[CMS POST] writing to Firestore collection="${collection}", keys=${Object.keys(payload).join(',')}`)

  try {
    const ref = await getAdminDb().collection(collection).add(payload)
    console.log(`[CMS POST] ✅ created doc id="${ref.id}"`)

    const snap = await ref.get()
    if (snap.exists) {
      const saved = snap.data()
      console.log(`[CMS POST] ✅ Verified — doc exists, totalEvents=${saved?.totalEvents ?? '(not a stats doc)'}`)
    } else {
      console.error(`[CMS POST] ❌ Doc not found after write`)
    }

    return NextResponse.json({ id: ref.id })
  } catch (err: any) {
    console.error(`[CMS POST] ❌ Firestore write failed:`, err?.message ?? err)
    return NextResponse.json({ error: 'write_failed', detail: err?.message ?? String(err) }, { status: 500 })
  }
}
