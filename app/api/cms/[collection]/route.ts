import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb, FieldValue } from '@/lib/firebase-admin'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { isAllowedCollection } from '../_allowed'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ collection: string }> }
) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const { collection } = await context.params
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
  try {
    const ref = await getAdminDb().collection(collection).add({
      ...body,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })
    return NextResponse.json({ id: ref.id })
  } catch (err: any) {
    return NextResponse.json({ error: 'write_failed', detail: err?.message ?? String(err) }, { status: 500 })
  }
}
