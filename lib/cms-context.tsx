'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { institutions as defaultInstitutions, Institution } from '@/lib/institutions-data'
import { fetchCollection, addDocument, updateDocument, deleteDocument, isMockMode, FirestoreDoc } from '@/lib/firestore-helpers'
import { mockEvents, mockNews } from '@/lib/mock-data'

const firestoreDocIdMap = new Map<string, string>()

function trackDocId(collection: string, displayId: string, firestoreId: string) {
  firestoreDocIdMap.set(`${collection}:${displayId}`, firestoreId)
}

function getFirestoreDocId(collection: string, displayId: string): string {
  return firestoreDocIdMap.get(`${collection}:${displayId}`) || displayId
}

function docToInstitution(doc: FirestoreDoc): Institution {
  const displayId = doc._seedId || doc.id
  if (doc._seedId) trackDocId('institutions', displayId, doc.id)
  return {
    id: displayId,
    title: doc.title || '',
    subtitle: doc.subtitle,
    description: doc.description || '',
    fullDescription: doc.fullDescription || '',
    iconName: doc.iconName || 'palette',
    image: doc.image || '',
    gallery: doc.gallery || [],
    iconBg: doc.iconBg || '#B87333',
    ambientColor: doc.ambientColor || 'rgba(184, 115, 51, 0.15)',
    address: doc.address || '',
    phone: doc.phone || '',
    email: doc.email || '',
    workingHours: doc.workingHours || '',
  } as Institution
}

function extractDocId(docRef: { id?: string } | undefined | null): string {
  if (docRef && typeof docRef === 'object' && 'id' in docRef && typeof docRef.id === 'string') {
    return docRef.id
  }
  return `cms-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

export interface LibraryAnnex {
  id: string
  name: string
  type: 'شبه حضارية' | 'ريفية'
}

export interface CultureHouseWorkshop {
  id: string
  name: string
  iconName: string
}

export interface CultureHouseFacility {
  id: string
  name: string
  subtitle?: string
  iconName: string
}

export interface KhenchelaSection {
  id: string
  title: string
  subtitle: string
  paragraphs: string[]
}

const defaultAnnexes: LibraryAnnex[] = [
  { id: 'a1', name: 'الحامة', type: 'شبه حضارية' },
  { id: 'a2', name: 'أولاد رشاش', type: 'شبه حضارية' },
  { id: 'a3', name: 'ششار', type: 'شبه حضارية' },
  { id: 'a4', name: 'عين الطويلة', type: 'شبه حضارية' },
  { id: 'a5', name: 'بوحمامة', type: 'شبه حضارية' },
  { id: 'a6', name: 'بابار', type: 'شبه حضارية' },
  { id: 'a7', name: 'قايس', type: 'شبه حضارية' },
  { id: 'a8', name: 'يابوس', type: 'ريفية' },
  { id: 'a9', name: 'المصارة', type: 'ريفية' },
]

const defaultWorkshops: CultureHouseWorkshop[] = [
  { id: 'w1', name: 'ورشة المسرح', iconName: 'Theater' },
  { id: 'w2', name: 'ورشة الفنون التشكيلية', iconName: 'Paintbrush' },
  { id: 'w3', name: 'النادي الأدبي', iconName: 'BookText' },
  { id: 'w4', name: 'ورشة السمعي البصري', iconName: 'Video' },
  { id: 'w5', name: 'ورشة الموسيقى', iconName: 'Music' },
  { id: 'w6', name: 'ورشة التراث الشعبي', iconName: 'Landmark' },
]

const defaultFacilities: CultureHouseFacility[] = [
  { id: 'f1', name: 'مدرسة تعليم الموسيقى', iconName: 'GraduationCap' },
  { id: 'f2', name: 'مكتبة الصغار', iconName: 'BookOpen' },
  { id: 'f3', name: 'مكتبة الكبار', iconName: 'BookText' },
  { id: 'f4', name: 'القاعة متعددة النشاطات', iconName: 'Users' },
  { id: 'f5', name: 'الرواق التشكيلي', subtitle: '(حكار لزهر)', iconName: 'Palette' },
  { id: 'f6', name: 'المقهى الثقافي', iconName: 'Coffee' },
]

const defaultKhenchelaSections: KhenchelaSection[] = [
  {
    id: 'ks1',
    title: 'الجذور التاريخية',
    subtitle: 'ماسكولا القديمة وملحمة الكاهنة',
    paragraphs: [
      'تعود جذور خنشلة إلى مدينة "ماسكولا" (Mascula) الرومانية التي كانت من أبرز المراكز الحضرية في شمال إفريقيا القديمة. شهدت المدينة تعاقب حضارات عريقة من النوميديين والرومان والبيزنطيين، تاركةً إرثاً أثرياً غنياً لا يزال شاهداً على عظمة تلك الحقب.',
      'ارتبط اسم خنشلة ارتباطاً وثيقاً بالملكة الأمازيغية ديهيا (الكاهنة)، تلك المرأة الاستثنائية التي قادت المقاومة ضد الفتح الأموي في أواخر القرن السابع الميلادي. تُعدّ الكاهنة رمزاً للصمود والبطولة في ذاكرة الأوراس والجزائر بأسرها، وتُخلّد ذكراها في المعالم والتماثيل المنتشرة في ربوع الولاية.',
    ],
  },
  {
    id: 'ks2',
    title: 'الهوية الثقافية',
    subtitle: 'تراث الأوراس الأمازيغي الشاوي',
    paragraphs: [
      'تنبض خنشلة بروح الثقافة الأمازيغية الشاوية الأصيلة، حيث يحافظ سكانها على تقاليدهم العريقة في اللغة والفنون والعادات الاجتماعية. تُعدّ منطقة الأوراس حاضنة لهذا التراث الغني الذي يمتد لآلاف السنين.',
      'يتميز الفن الموسيقي الخنشلي بأنماط فريدة أبرزها موسيقى "العبادي" (Obadi) و"الرحابة" (Rahaba)، وهي أشكال تعبيرية أصيلة تمزج بين الشعر الشاوي والإيقاعات التقليدية في مناسبات الأفراح والاحتفالات الجماعية. كما تشتهر المنطقة بالصناعات الحرفية التقليدية من نسيج الزرابي (السجاد الأوراسي) وصناعة الفخار والحلي الفضية التي تعكس ذوقاً فنياً رفيعاً.',
    ],
  },
  {
    id: 'ks3',
    title: 'المعالم الطبيعية والثقافية',
    subtitle: 'قمة الشلية وحمّام الصالحين',
    paragraphs: [
      'تحتضن ولاية خنشلة جبل الشلية (Chelia) الذي يُعدّ أعلى قمة في شمال الجزائر بارتفاع يبلغ 2,328 متراً. يُشكّل هذا الجبل الشامخ جزءاً من سلسلة جبال الأوراس، ويتميز بغطائه الغابي الكثيف من أشجار الأرز الأطلسي النادرة وتساقط الثلوج الكثيفة شتاءً، مما يجعله وجهة سياحية فريدة.',
      'من أبرز معالم الولاية أيضاً حمّام الصالحين (Hammam Essalihine)، وهو حمّام روماني حراري يعود تاريخه إلى العهد الروماني. تتدفق مياهه المعدنية الساخنة عند درجة حرارة تصل إلى 70 درجة مئوية، وقد ظل مقصداً للاستشفاء منذ أكثر من ألفي عام. يُصنّف هذا الموقع ضمن المعالم الأثرية المحمية في الجزائر.',
    ],
  },
]

function docToAnnex(doc: FirestoreDoc): LibraryAnnex {
  const displayId = doc._seedId || doc.id
  if (doc._seedId) trackDocId('libraryAnnexes', displayId, doc.id)
  return { id: displayId, name: doc.name || '', type: doc.type || 'شبه حضارية' }
}
function docToWorkshop(doc: FirestoreDoc): CultureHouseWorkshop {
  const displayId = doc._seedId || doc.id
  if (doc._seedId) trackDocId('workshops', displayId, doc.id)
  return { id: displayId, name: doc.name || '', iconName: doc.iconName || 'Theater' }
}
function docToFacility(doc: FirestoreDoc): CultureHouseFacility {
  const displayId = doc._seedId || doc.id
  if (doc._seedId) trackDocId('facilities', displayId, doc.id)
  return { id: displayId, name: doc.name || '', subtitle: doc.subtitle, iconName: doc.iconName || 'Home' }
}
function docToSection(doc: FirestoreDoc): KhenchelaSection {
  const displayId = doc._seedId || doc.id
  if (doc._seedId) trackDocId('khenchelaSections', displayId, doc.id)
  return { id: displayId, title: doc.title || '', subtitle: doc.subtitle || '', paragraphs: doc.paragraphs || [] }
}

async function seedCollection<T extends { id: string }>(collectionName: string, defaults: T[]): Promise<void> {
  for (const item of defaults) {
    const { id, ...data } = item as Record<string, unknown>
    await addDocument(collectionName, { ...data, _seedId: id })
  }
}

interface CmsContextType {
  loading: boolean

  institutions: Institution[]
  updateInstitution: (id: string, data: Partial<Institution>) => Promise<void>

  libraryAnnexes: LibraryAnnex[]
  addAnnex: (annex: Omit<LibraryAnnex, 'id'>) => Promise<void>
  updateAnnex: (id: string, data: Partial<LibraryAnnex>) => Promise<void>
  deleteAnnex: (id: string) => Promise<void>

  workshops: CultureHouseWorkshop[]
  addWorkshop: (w: Omit<CultureHouseWorkshop, 'id'>) => Promise<void>
  updateWorkshop: (id: string, data: Partial<CultureHouseWorkshop>) => Promise<void>
  deleteWorkshop: (id: string) => Promise<void>

  facilities: CultureHouseFacility[]
  addFacility: (f: Omit<CultureHouseFacility, 'id'>) => Promise<void>
  updateFacility: (id: string, data: Partial<CultureHouseFacility>) => Promise<void>
  deleteFacility: (id: string) => Promise<void>

  khenchelaSections: KhenchelaSection[]
  updateKhenchelaSection: (id: string, data: Partial<KhenchelaSection>) => Promise<void>
}

const CmsContext = createContext<CmsContextType | undefined>(undefined)

export function CmsProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [institutions, setInstitutions] = useState<Institution[]>([...defaultInstitutions])
  const [libraryAnnexes, setLibraryAnnexes] = useState<LibraryAnnex[]>([...defaultAnnexes])
  const [workshops, setWorkshops] = useState<CultureHouseWorkshop[]>([...defaultWorkshops])
  const [facilities, setFacilities] = useState<CultureHouseFacility[]>([...defaultFacilities])
  const [khenchelaSections, setKhenchelaSections] = useState<KhenchelaSection[]>([...defaultKhenchelaSections])
  const [seeded, setSeeded] = useState(false)

  useEffect(() => {
    async function loadFromFirestore() {
      if (isMockMode) {
        setSeeded(true)
        setLoading(false)
        return
      }
      try {
        const [instDocs, annexDocs, workshopDocs, facilityDocs, sectionDocs, eventDocs, newsDocs] = await Promise.all([
          fetchCollection('institutions', 'title'),
          fetchCollection('libraryAnnexes', 'name'),
          fetchCollection('workshops', 'name'),
          fetchCollection('facilities', 'name'),
          fetchCollection('khenchelaSections', 'title'),
          fetchCollection('events', 'date'),
          fetchCollection('news', 'date'),
        ])

        const hasCmsData = instDocs.length > 0 || annexDocs.length > 0 || workshopDocs.length > 0 || facilityDocs.length > 0 || sectionDocs.length > 0

        if (eventDocs.length === 0) {
          try {
            const seedEvents = mockEvents.map(e => {
              const { id, ...data } = e
              return { ...data, _seedId: id }
            })
            for (const ev of seedEvents) {
              await addDocument('events', ev)
            }
          } catch (seedErr) {
            console.error('Failed to seed events:', seedErr)
          }
        }

        if (newsDocs.length === 0) {
          try {
            const seedNews = mockNews.map(n => {
              const { id, ...data } = n
              return { ...data, _seedId: id }
            })
            for (const nw of seedNews) {
              await addDocument('news', nw)
            }
          } catch (seedErr) {
            console.error('Failed to seed news:', seedErr)
          }
        }

        if (!hasCmsData) {
          try {
            await Promise.all([
              seedCollection('institutions', defaultInstitutions),
              seedCollection('libraryAnnexes', defaultAnnexes),
              seedCollection('workshops', defaultWorkshops),
              seedCollection('facilities', defaultFacilities),
              seedCollection('khenchelaSections', defaultKhenchelaSections),
            ])
            const [si, sa, sw, sf, ss] = await Promise.all([
              fetchCollection('institutions', 'title'),
              fetchCollection('libraryAnnexes', 'name'),
              fetchCollection('workshops', 'name'),
              fetchCollection('facilities', 'name'),
              fetchCollection('khenchelaSections', 'title'),
            ])
            if (si.length > 0) setInstitutions(si.map(docToInstitution))
            if (sa.length > 0) setLibraryAnnexes(sa.map(docToAnnex))
            if (sw.length > 0) setWorkshops(sw.map(docToWorkshop))
            if (sf.length > 0) setFacilities(sf.map(docToFacility))
            if (ss.length > 0) setKhenchelaSections(ss.map(docToSection))
          } catch (seedErr) {
            console.error('Failed to seed Firestore:', seedErr)
          }
        } else {
          if (instDocs.length > 0) {
            const firestoreInsts = instDocs.map(docToInstitution)
            const firestoreIds = new Set(firestoreInsts.map(i => i.id))
            const merged = [
              ...firestoreInsts,
              ...defaultInstitutions.filter(d => !firestoreIds.has(d.id)),
            ]
            setInstitutions(merged)
          }
          if (annexDocs.length > 0) setLibraryAnnexes(annexDocs.map(docToAnnex))
          if (workshopDocs.length > 0) setWorkshops(workshopDocs.map(docToWorkshop))
          if (facilityDocs.length > 0) setFacilities(facilityDocs.map(docToFacility))
          if (sectionDocs.length > 0) setKhenchelaSections(sectionDocs.map(docToSection))
        }
        setSeeded(true)
      } catch (err) {
        console.error('Failed to load CMS data from Firestore:', err)
        setSeeded(true)
      } finally {
        setLoading(false)
      }
    }
    loadFromFirestore()
  }, [])

  const updateInstitution = useCallback(async (id: string, data: Partial<Institution>) => {
    if (!isMockMode) {
      const docId = getFirestoreDocId('institutions', id)
      await updateDocument('institutions', docId, data)
    }
    setInstitutions(prev => prev.map(inst => inst.id === id ? { ...inst, ...data } : inst))
  }, [])

  const addAnnex = useCallback(async (annex: Omit<LibraryAnnex, 'id'>) => {
    if (isMockMode) {
      const id = `cms-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      setLibraryAnnexes(prev => [...prev, { ...annex, id }])
    } else {
      const docRef = await addDocument('libraryAnnexes', annex)
      setLibraryAnnexes(prev => [...prev, { ...annex, id: extractDocId(docRef) }])
    }
  }, [])

  const updateAnnex = useCallback(async (id: string, data: Partial<LibraryAnnex>) => {
    if (!isMockMode) await updateDocument('libraryAnnexes', getFirestoreDocId('libraryAnnexes', id), data)
    setLibraryAnnexes(prev => prev.map(a => a.id === id ? { ...a, ...data } : a))
  }, [])

  const deleteAnnex = useCallback(async (id: string) => {
    if (!isMockMode) await deleteDocument('libraryAnnexes', getFirestoreDocId('libraryAnnexes', id))
    setLibraryAnnexes(prev => prev.filter(a => a.id !== id))
  }, [])

  const addWorkshop = useCallback(async (w: Omit<CultureHouseWorkshop, 'id'>) => {
    if (isMockMode) {
      const id = `cms-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      setWorkshops(prev => [...prev, { ...w, id }])
    } else {
      const docRef = await addDocument('workshops', w)
      setWorkshops(prev => [...prev, { ...w, id: extractDocId(docRef) }])
    }
  }, [])

  const updateWorkshop = useCallback(async (id: string, data: Partial<CultureHouseWorkshop>) => {
    if (!isMockMode) await updateDocument('workshops', getFirestoreDocId('workshops', id), data)
    setWorkshops(prev => prev.map(w => w.id === id ? { ...w, ...data } : w))
  }, [])

  const deleteWorkshop = useCallback(async (id: string) => {
    if (!isMockMode) await deleteDocument('workshops', getFirestoreDocId('workshops', id))
    setWorkshops(prev => prev.filter(w => w.id !== id))
  }, [])

  const addFacility = useCallback(async (f: Omit<CultureHouseFacility, 'id'>) => {
    if (isMockMode) {
      const id = `cms-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      setFacilities(prev => [...prev, { ...f, id }])
    } else {
      const docRef = await addDocument('facilities', f)
      setFacilities(prev => [...prev, { ...f, id: extractDocId(docRef) }])
    }
  }, [])

  const updateFacility = useCallback(async (id: string, data: Partial<CultureHouseFacility>) => {
    if (!isMockMode) await updateDocument('facilities', getFirestoreDocId('facilities', id), data)
    setFacilities(prev => prev.map(f => f.id === id ? { ...f, ...data } : f))
  }, [])

  const deleteFacility = useCallback(async (id: string) => {
    if (!isMockMode) await deleteDocument('facilities', getFirestoreDocId('facilities', id))
    setFacilities(prev => prev.filter(f => f.id !== id))
  }, [])

  const updateKhenchelaSection = useCallback(async (id: string, data: Partial<KhenchelaSection>) => {
    if (!isMockMode) await updateDocument('khenchelaSections', getFirestoreDocId('khenchelaSections', id), data)
    setKhenchelaSections(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
  }, [])

  return (
    <CmsContext.Provider value={{
      loading,
      institutions, updateInstitution,
      libraryAnnexes, addAnnex, updateAnnex, deleteAnnex,
      workshops, addWorkshop, updateWorkshop, deleteWorkshop,
      facilities, addFacility, updateFacility, deleteFacility,
      khenchelaSections, updateKhenchelaSection,
    }}>
      {children}
    </CmsContext.Provider>
  )
}

export function useCms() {
  const context = useContext(CmsContext)
  if (context === undefined) {
    throw new Error('useCms must be used within CmsProvider')
  }
  return context
}
