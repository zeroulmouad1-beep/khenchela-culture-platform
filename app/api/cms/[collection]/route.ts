import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb, FieldValue } from '@/lib/firebase-admin'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { isAllowedCollection } from '../_allowed'

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
