'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { institutions as defaultInstitutions, Institution } from '@/lib/institutions-data'

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

function generateId() {
  return `cms-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

interface CmsContextType {
  institutions: Institution[]
  updateInstitution: (id: string, data: Partial<Institution>) => void

  libraryAnnexes: LibraryAnnex[]
  addAnnex: (annex: Omit<LibraryAnnex, 'id'>) => void
  updateAnnex: (id: string, data: Partial<LibraryAnnex>) => void
  deleteAnnex: (id: string) => void

  workshops: CultureHouseWorkshop[]
  addWorkshop: (w: Omit<CultureHouseWorkshop, 'id'>) => void
  updateWorkshop: (id: string, data: Partial<CultureHouseWorkshop>) => void
  deleteWorkshop: (id: string) => void

  facilities: CultureHouseFacility[]
  addFacility: (f: Omit<CultureHouseFacility, 'id'>) => void
  updateFacility: (id: string, data: Partial<CultureHouseFacility>) => void
  deleteFacility: (id: string) => void

  khenchelaSections: KhenchelaSection[]
  updateKhenchelaSection: (id: string, data: Partial<KhenchelaSection>) => void
}

const CmsContext = createContext<CmsContextType | undefined>(undefined)

export function CmsProvider({ children }: { children: ReactNode }) {
  const [institutions, setInstitutions] = useState<Institution[]>([...defaultInstitutions])
  const [libraryAnnexes, setLibraryAnnexes] = useState<LibraryAnnex[]>([...defaultAnnexes])
  const [workshops, setWorkshops] = useState<CultureHouseWorkshop[]>([...defaultWorkshops])
  const [facilities, setFacilities] = useState<CultureHouseFacility[]>([...defaultFacilities])
  const [khenchelaSections, setKhenchelaSections] = useState<KhenchelaSection[]>([...defaultKhenchelaSections])

  const updateInstitution = (id: string, data: Partial<Institution>) => {
    setInstitutions(prev => prev.map(inst => inst.id === id ? { ...inst, ...data } : inst))
  }

  const addAnnex = (annex: Omit<LibraryAnnex, 'id'>) => {
    setLibraryAnnexes(prev => [...prev, { ...annex, id: generateId() }])
  }
  const updateAnnex = (id: string, data: Partial<LibraryAnnex>) => {
    setLibraryAnnexes(prev => prev.map(a => a.id === id ? { ...a, ...data } : a))
  }
  const deleteAnnex = (id: string) => {
    setLibraryAnnexes(prev => prev.filter(a => a.id !== id))
  }

  const addWorkshop = (w: Omit<CultureHouseWorkshop, 'id'>) => {
    setWorkshops(prev => [...prev, { ...w, id: generateId() }])
  }
  const updateWorkshop = (id: string, data: Partial<CultureHouseWorkshop>) => {
    setWorkshops(prev => prev.map(w => w.id === id ? { ...w, ...data } : w))
  }
  const deleteWorkshop = (id: string) => {
    setWorkshops(prev => prev.filter(w => w.id !== id))
  }

  const addFacility = (f: Omit<CultureHouseFacility, 'id'>) => {
    setFacilities(prev => [...prev, { ...f, id: generateId() }])
  }
  const updateFacility = (id: string, data: Partial<CultureHouseFacility>) => {
    setFacilities(prev => prev.map(f => f.id === id ? { ...f, ...data } : f))
  }
  const deleteFacility = (id: string) => {
    setFacilities(prev => prev.filter(f => f.id !== id))
  }

  const updateKhenchelaSection = (id: string, data: Partial<KhenchelaSection>) => {
    setKhenchelaSections(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
  }

  return (
    <CmsContext.Provider value={{
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
