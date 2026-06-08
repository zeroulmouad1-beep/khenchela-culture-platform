import { fetchCollection, isMockMode, FirestoreDoc } from '@/lib/firestore-helpers'

export type ArtistStatus = 'نشط' | 'معلق' | 'غير نشط'

export interface Artist {
  id: number
  name: string
  specialty: string
  municipality: string
  status: ArtistStatus
  cardId: string
  nationalId: string
}

export const artistsData: Artist[] = [
  { id: 1, name: 'محمد بن عيسى', specialty: 'فنون تشكيلية', municipality: 'خنشلة', status: 'نشط', cardId: 'B-2026-0001', nationalId: '19850312400127' },
  { id: 2, name: 'فاطمة الزهراء بوزيد', specialty: 'خط عربي', municipality: 'قايس', status: 'نشط', cardId: 'B-2026-0002', nationalId: '19900715400234' },
  { id: 3, name: 'عبد الرحمن شريف', specialty: 'نحت', municipality: 'بغاي', status: 'معلق', cardId: 'B-2026-0003', nationalId: '19880923400345' },
  { id: 4, name: 'نورة بن حمادي', specialty: 'رسم زيتي', municipality: 'خنشلة', status: 'نشط', cardId: 'B-2026-0004', nationalId: '19920508400456' },
  { id: 5, name: 'يوسف مرابط', specialty: 'تصوير فوتوغرافي', municipality: 'الحامة', status: 'غير نشط', cardId: 'B-2026-0005', nationalId: '19870114400567' },
  { id: 6, name: 'أمينة تواتي', specialty: 'فنون تشكيلية', municipality: 'ششار', status: 'نشط', cardId: 'B-2026-0006', nationalId: '19950621400678' },
  { id: 7, name: 'كريم بوعلام', specialty: 'أدب وشعر', municipality: 'طامزة', status: 'معلق', cardId: 'B-2026-0007', nationalId: '19830409400789' },
  { id: 8, name: 'سارة بلخير', specialty: 'خزف تقليدي', municipality: 'أولاد رشاش', status: 'نشط', cardId: 'B-2026-0008', nationalId: '19960217400890' },
  { id: 9, name: 'عمار حداد', specialty: 'موسيقى تراثية', municipality: 'خنشلة', status: 'نشط', cardId: 'B-2026-0009', nationalId: '19810830400901' },
  { id: 10, name: 'ليلى بن ناصر', specialty: 'مسرح', municipality: 'عين الطويلة', status: 'غير نشط', cardId: 'B-2026-0010', nationalId: '19941105400012' },
]

function docToArtist(doc: FirestoreDoc): Artist {
  return {
    id: doc._seedId ?? doc.id,
    name: doc.name || '',
    specialty: doc.specialty || '',
    municipality: doc.municipality || '',
    status: doc.status || 'نشط',
    cardId: doc.cardId || '',
    nationalId: doc.nationalId || '',
  }
}

export async function getArtists(): Promise<Artist[]> {
  // Firebase collection: artists
  try {
    if (!isMockMode) {
      const docs = await fetchCollection('artists', 'name')
      if (docs.length > 0) return docs.map(docToArtist)
    }
  } catch (e) {
    console.error('Failed to fetch artists from Firestore:', e)
  }
  return []
}
