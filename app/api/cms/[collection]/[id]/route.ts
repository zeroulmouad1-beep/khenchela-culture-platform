import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb, FieldValue } from '@/lib/firebase-admin'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { isAllowedCollection } from '../../_allowed'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ collection: string; id: string }> }
) {
  const authOk = isAdminAuthenticated(request)
  console.log(`[CMS PUT] auth=${authOk}, cookie=${!!request.cookies.get('admin_session')?.value}`)
  if (!authOk) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { collection, id } = await context.params
  console.log(`[CMS PUT] collection="${collection}", id="${id}"`)

  if (!isAllowedCollection(collection)) {
    return NextResponse.json({ error: 'forbidden_collection' }, { status: 403 })
  }
  if (!id) {
    return NextResponse.json({ error: 'missing_id' }, { status: 400 })
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

  const payload = { ...body, updatedAt: FieldValue.serverTimestamp() }
  console.log(`[CMS PUT] writing to Firestore: ${collection}/${id}, keys=${Object.keys(payload).join(',')}`)

  try {
    const db = getAdminDb()
    const ref = db.collection(collection).doc(id)

    // Use set+merge so the write succeeds even if the doc was deleted
    await ref.set(payload, { merge: true })
    console.log(`[CMS PUT] Firestore write done. Verifying...`)

    const snap = await ref.get()
    if (snap.exists) {
      const saved = snap.data()
      console.log(`[CMS PUT] ✅ Verified — doc exists, totalEvents=${saved?.totalEvents ?? '(not a stats doc)'}`)
    } else {
      console.error(`[CMS PUT] ❌ Doc not found after write — this should not happen`)
    }

    return NextResponse.json({ id })
  } catch (err: any) {
    console.error(`[CMS PUT] ❌ Firestore write failed:`, err?.message ?? err)
    return NextResponse.json({ error: 'write_failed', detail: err?.message ?? String(err) }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ collection: string; id: string }> }
) {
  const authOk = isAdminAuthenticated(request)
  console.log(`[CMS DELETE] auth=${authOk}`)
  if (!authOk) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const { collection, id } = await context.params
  if (!isAllowedCollection(collection)) {
    return NextResponse.json({ error: 'forbidden_collection' }, { status: 403 })
  }
  if (!id) {
    return NextResponse.json({ error: 'missing_id' }, { status: 400 })
  }
  try {
    await getAdminDb().collection(collection).doc(id).delete()
    return NextResponse.json({ id })
  } catch (err: any) {
    return NextResponse.json({ error: 'delete_failed', detail: err?.message ?? String(err) }, { status: 500 })
  }
}
