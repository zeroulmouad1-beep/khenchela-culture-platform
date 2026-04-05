import { fetchCollection, isMockMode, FirestoreDoc } from '@/lib/firestore-helpers'

export interface NationalMonument {
  id: number
  title: string
  image: string
  description: string
  classificationDate: string
}

export interface InventoryMonument {
  id: number
  title: string
  image: string
  description: string
  inventoryNumber: string
}

export interface IntangibleHeritageItem {
  id: number
  image: string
  alt: string
}

export const nationalMonumentsData: NationalMonument[] = [
  {
    id: 1,
    title: 'قصر الكاهنة',
    image: '/images/palais-kahina.jpg',
    description: 'قصر تاريخي يعود إلى عهد الملكة الأمازيغية ديهيا (الكاهنة)، يقع في قلب مدينة خنشلة ويُعتبر من أبرز المعالم الأثرية في المنطقة. يشهد القصر على حضارة عريقة وتاريخ مقاومة بطولية ضد الغزاة.',
    classificationDate: '1968-03-15',
  },
  {
    id: 2,
    title: 'جبل شلية',
    image: '/images/chelia.jpg',
    description: 'أعلى قمة في سلسلة جبال الأوراس وشمال إفريقيا بارتفاع 2328 متر. يتميز بتنوعه البيئي الفريد وغاباته الكثيفة من أشجار الأرز الأطلسي، ويُعد موقعاً طبيعياً مصنفاً ذا أهمية وطنية.',
    classificationDate: '1972-06-20',
  },
  {
    id: 3,
    title: 'المتحف العمومي الوطني (الاخوة الشهداء بولعزيز)',
    image: '/images/museum-khenchela.jpg',
    description: 'متحف يضم مجموعة غنية من القطع الأثرية التي تعود إلى مختلف الحقب التاريخية، من العصر الروماني إلى الفترة الإسلامية. يحتوي على فسيفساء نادرة ومنحوتات وأدوات تاريخية تروي قصة المنطقة.',
    classificationDate: '1985-11-02',
  },
  {
    id: 4,
    title: 'الحمامات الرومانية',
    image: '/images/archaeological-exhibition.jpg',
    description: 'آثار حمامات رومانية تعود إلى القرن الثاني الميلادي، تقع بالقرب من مدينة خنشلة القديمة (ماسكولا). تُظهر البقايا المعمارية مستوى عالياً من الهندسة والتخطيط العمراني الروماني.',
    classificationDate: '1970-09-10',
  },
  {
    id: 5,
    title: 'موقع تازولت الأثري',
    image: '/images/heritage.jpg',
    description: 'مدينة رومانية قديمة تُعرف باسم "لامبيز" أو "لامباسيس"، كانت مقراً للفيلق الثالث الأوغسطي. تضم بقايا معسكر روماني ومعابد ومسرح وقوس نصر، وتُعد من أهم المواقع الأثرية في الجزائر.',
    classificationDate: '1954-01-25',
  },
]

export const inventoryMonumentsData: InventoryMonument[] = [
  {
    id: 1,
    title: 'قاعة السينيماتيك خنشلة',
    image: '/images/cinema-interior.jpg',
    description: 'قاعة سينما تاريخية تعود إلى الحقبة الاستعمارية، أُعيد ترميمها للحفاظ على طابعها المعماري الأصلي. تُستخدم حالياً لعرض الأفلام والأنشطة الثقافية المحلية.',
    inventoryNumber: 'INV-KHN-2020-001',
  },
  {
    id: 2,
    title: 'المركز الثقافي الإسلامي',
    image: '/images/cultural-festival.jpg',
    description: 'مركز ثقافي يحتضن مكتبة عامة وقاعات للمحاضرات والندوات العلمية. يُعد منارة للعلم والمعرفة في ولاية خنشلة ويستقبل آلاف الزوار سنوياً.',
    inventoryNumber: 'INV-KHN-2020-002',
  },
  {
    id: 3,
    title: 'معرض الصناعات التقليدية',
    image: '/images/art-workshop.jpg',
    description: 'فضاء عرض دائم للصناعات التقليدية المحلية يضم أعمال الزربية الشاوية والفخار والنقش على الخشب والنحاس. يُبرز المهارات الحرفية الموروثة عبر الأجيال.',
    inventoryNumber: 'INV-KHN-2021-003',
  },
  {
    id: 4,
    title: 'قاعة العروض الموسيقية',
    image: '/images/music-concert.jpg',
    description: 'قاعة مجهزة بأحدث التقنيات الصوتية والبصرية، تحتضن الحفلات الموسيقية والمهرجانات الفنية المحلية والوطنية. تتسع لأكثر من 500 متفرج.',
    inventoryNumber: 'INV-KHN-2022-004',
  },
]

export const intangibleHeritageData: IntangibleHeritageItem[] = [
  { id: 1, image: '/images/heritage.jpg', alt: 'التراث المعماري التقليدي' },
  { id: 2, image: '/images/art-workshop.jpg', alt: 'الصناعات الحرفية التقليدية' },
  { id: 3, image: '/images/cultural-festival.jpg', alt: 'الاحتفالات الثقافية الشعبية' },
  { id: 4, image: '/images/music-concert.jpg', alt: 'الموسيقى الشاوية التراثية' },
  { id: 5, image: '/images/palais-kahina.jpg', alt: 'العمارة التاريخية' },
  { id: 6, image: '/images/chelia.jpg', alt: 'المناظر الطبيعية والتراث البيئي' },
  { id: 7, image: '/images/archaeological-exhibition.jpg', alt: 'المعارض الأثرية' },
  { id: 8, image: '/images/museum-khenchela.jpg', alt: 'المتاحف والمعالم التراثية' },
]

function docToNationalMonument(doc: FirestoreDoc): NationalMonument {
  return {
    id: doc._seedId ?? doc.id,
    title: doc.title || '',
    image: doc.image || '',
    description: doc.description || '',
    classificationDate: doc.classificationDate || '',
  }
}

function docToInventoryMonument(doc: FirestoreDoc): InventoryMonument {
  return {
    id: doc._seedId ?? doc.id,
    title: doc.title || '',
    image: doc.image || '',
    description: doc.description || '',
    inventoryNumber: doc.inventoryNumber || '',
  }
}

function docToIntangibleHeritage(doc: FirestoreDoc): IntangibleHeritageItem {
  return {
    id: doc._seedId ?? doc.id,
    image: doc.image || '',
    alt: doc.alt || '',
  }
}

export async function getNationalMonuments(): Promise<NationalMonument[]> {
  try {
    if (!isMockMode) {
      const docs = await fetchCollection('nationalMonuments', 'title')
      if (docs.length > 0) return docs.map(docToNationalMonument)
    }
  } catch (e) {
    console.error('Failed to fetch national monuments from Firestore:', e)
  }
  return nationalMonumentsData
}

export async function getInventoryMonuments(): Promise<InventoryMonument[]> {
  try {
    if (!isMockMode) {
      const docs = await fetchCollection('inventoryMonuments', 'title')
      if (docs.length > 0) return docs.map(docToInventoryMonument)
    }
  } catch (e) {
    console.error('Failed to fetch inventory monuments from Firestore:', e)
  }
  return inventoryMonumentsData
}

export async function getIntangibleHeritage(): Promise<IntangibleHeritageItem[]> {
  try {
    if (!isMockMode) {
      const docs = await fetchCollection('intangibleHeritage', 'alt')
      if (docs.length > 0) return docs.map(docToIntangibleHeritage)
    }
  } catch (e) {
    console.error('Failed to fetch intangible heritage from Firestore:', e)
  }
  return intangibleHeritageData
}
