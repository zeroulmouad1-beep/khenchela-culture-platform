import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'

const PUBLIC_COLLECTIONS = new Set([
  'culturalStats',
  'events',
  'news',
  'institutions',
  'workshops',
  'facilities',
  'libraryAnnexes',
  'khenchelaSections',
  'associations',
  'directorateStats',
  'nationalMonuments',
  'inventoryMonuments',
  'intangibleHeritage',
])

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ collection: string }> }
) {
  const { collection } = await context.params

  if (!PUBLIC_COLLECTIONS.has(collection)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  try {
    const db = getAdminDb()
    let snapshot
    try {
      snapshot = await db.collection(collection).orderBy('updatedAt', 'desc').get()
    } catch {
      snapshot = await db.collection(collection).get()
    }

    const docs = snapshot.docs.map(d => {
      const data = d.data()
      const cleaned: Record<string, any> = { id: d.id }
      for (const [k, v] of Object.entries(data)) {
        cleaned[k] = v && typeof v === 'object' && 'toDate' in v
          ? (v as any).toDate().toISOString()
          : v
      }
      return cleaned
    })

    console.log(`[public GET] collection="${collection}" — returned ${docs.length} docs`)
    return NextResponse.json({ docs }, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err: any) {
    console.error(`[public GET] ❌ read failed for "${collection}":`, err?.message ?? err)
    return NextResponse.json(
      { error: 'read_failed', detail: err?.message ?? String(err) },
      { status: 500 }
    )
  }
}
