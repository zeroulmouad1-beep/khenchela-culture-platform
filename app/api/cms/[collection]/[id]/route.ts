import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb, FieldValue } from '@/lib/firebase-admin'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { isAllowedCollection } from '../../_allowed'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ collection: string; id: string }> }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const { collection, id } = await context.params
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
  try {
    await getAdminDb().collection(collection).doc(id).update({
      ...body,
      updatedAt: FieldValue.serverTimestamp(),
    })
    return NextResponse.json({ id })
  } catch (err: any) {
    return NextResponse.json({ error: 'write_failed', detail: err?.message ?? String(err) }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ collection: string; id: string }> }
) {
  if (!isAdminAuthenticated(request)) {
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
