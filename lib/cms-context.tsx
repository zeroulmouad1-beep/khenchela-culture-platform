'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { institutions as defaultInstitutions, Institution } from '@/lib/institutions-data'
import { fetchCollection, addDocument, updateDocument, deleteDocument, isMockMode, FirestoreDoc } from '@/lib/firestore-helpers'

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
    iconBg: doc.iconBg || '#c9952a',
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

export interface Department {
  id: string
  title: string
  description: string
  iconName: string
  image: string
  href: string
}

// Firebase collection: departments
const defaultDepartments: Department[] = []

// Firebase collection: libraryAnnexes
const defaultAnnexes: LibraryAnnex[] = []

// Firebase collection: workshops
const defaultWorkshops: CultureHouseWorkshop[] = []

// Firebase collection: facilities
const defaultFacilities: CultureHouseFacility[] = []

// Firebase collection: khenchelaSections
const defaultKhenchelaSections: KhenchelaSection[] = []

function docToDepartment(doc: FirestoreDoc): Department {
  const displayId = doc._seedId || doc.id
  if (doc._seedId) trackDocId('departments', displayId, doc.id)
  return {
    id: displayId,
    title: doc.title || '',
    description: doc.description || '',
    iconName: doc.iconName || 'Palette',
    image: doc.image || '',
    href: doc.href || '',
  }
}
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

interface CmsContextType {
  loading: boolean

  departments: Department[]
  updateDepartment: (id: string, data: Partial<Department>) => Promise<void>

  institutions: Institution[]
  updateInstitution: (id: string, data: Partial<Institution>) => Promise<void>
  deleteInstitution: (id: string) => Promise<void>

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
  const [departments, setDepartments] = useState<Department[]>([...defaultDepartments])
  const [institutions, setInstitutions] = useState<Institution[]>([...defaultInstitutions])
  const [libraryAnnexes, setLibraryAnnexes] = useState<LibraryAnnex[]>([...defaultAnnexes])
  const [workshops, setWorkshops] = useState<CultureHouseWorkshop[]>([...defaultWorkshops])
  const [facilities, setFacilities] = useState<CultureHouseFacility[]>([...defaultFacilities])
  const [khenchelaSections, setKhenchelaSections] = useState<KhenchelaSection[]>([...defaultKhenchelaSections])
  useEffect(() => {
    // STRICT READ-ONLY: This effect only fetches data from Firestore.
    // It NEVER creates, seeds, or upserts any documents. Defaults arrays above
    // are used purely as in-memory fallbacks for display when a collection is
    // empty in Firestore. No automatic write of any kind happens here.
    async function loadFromFirestore() {
      if (isMockMode) {
        setLoading(false)
        return
      }
      try {
        const [instDocs, annexDocs, workshopDocs, facilityDocs, sectionDocs, deptDocs] = await Promise.all([
          fetchCollection('institutions', 'title'),
          fetchCollection('libraryAnnexes', 'name'),
          fetchCollection('workshops', 'name'),
          fetchCollection('facilities', 'name'),
          fetchCollection('khenchelaSections', 'title'),
          fetchCollection('departments', 'title'),
        ])

        if (deptDocs.length > 0) setDepartments(deptDocs.map(docToDepartment))
        if (instDocs.length > 0) setInstitutions(instDocs.map(docToInstitution))
        if (annexDocs.length > 0) setLibraryAnnexes(annexDocs.map(docToAnnex))
        if (workshopDocs.length > 0) setWorkshops(workshopDocs.map(docToWorkshop))
        if (facilityDocs.length > 0) setFacilities(facilityDocs.map(docToFacility))
        if (sectionDocs.length > 0) setKhenchelaSections(sectionDocs.map(docToSection))
      } catch (err) {
        console.error('Failed to load CMS data from Firestore:', err)
      } finally {
        setLoading(false)
      }
    }
    loadFromFirestore()
  }, [])

  const updateDepartment = useCallback(async (id: string, data: Partial<Department>) => {
    if (!isMockMode) {
      const docId = getFirestoreDocId('departments', id)
      await updateDocument('departments', docId, data)
    }
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, ...data } : d))
  }, [])

  const updateInstitution = useCallback(async (id: string, data: Partial<Institution>) => {
    if (!isMockMode) {
      const docId = getFirestoreDocId('institutions', id)
      await updateDocument('institutions', docId, data)
    }
    setInstitutions(prev => prev.map(inst => inst.id === id ? { ...inst, ...data } : inst))
  }, [])

  const deleteInstitution = useCallback(async (id: string) => {
    if (!isMockMode) {
      const docId = getFirestoreDocId('institutions', id)
      await deleteDocument('institutions', docId)
    }
    setInstitutions(prev => prev.filter(inst => inst.id !== id))
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
      departments, updateDepartment,
      institutions, updateInstitution, deleteInstitution,
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
