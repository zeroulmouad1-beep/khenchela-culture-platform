import { fetchCollection, isMockMode, FirestoreDoc } from '@/lib/firestore-helpers'

export interface Association {
  id: number
  name: string
  type: string
  president: string
  foundationDate: string
}

function docToAssociation(doc: FirestoreDoc): Association {
  return {
    id: doc._seedId ?? doc.id,
    name: doc.name || '',
    type: doc.type || '',
    president: doc.president || '',
    foundationDate: doc.foundationDate || '',
  }
}

export async function getAssociations(): Promise<Association[]> {
  try {
    if (!isMockMode) {
      const docs = await fetchCollection('associations', 'name')
      if (docs.length > 0) return docs.map(docToAssociation)
    }
  } catch (e) {
    console.error('Failed to fetch associations from Firestore:', e)
  }
  return []
}
