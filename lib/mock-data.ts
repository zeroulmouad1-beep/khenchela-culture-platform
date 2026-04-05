export interface MockDoc {
  id: string
  [key: string]: any
}

export const mockNews: MockDoc[] = [
  { id: 'n1', title: 'افتتاح معرض الفنون التشكيلية بخنشلة', content: 'تم افتتاح معرض الفنون التشكيلية الذي يضم أعمال فنانين محليين من ولاية خنشلة، يعرض لوحات ومنحوتات تعكس التراث الثقافي للمنطقة.', date: '2026-03-25', imageUrl: '/images/archaeological-exhibition.jpg', published: true, createdAt: '2026-03-25' },
  { id: 'n2', title: 'ندوة حول التراث الأوراسي', content: 'نظمت مديرية الثقافة ندوة علمية حول أهمية الحفاظ على التراث الثقافي لمنطقة الأوراس وطرق توثيقه وحمايته.', date: '2026-03-20', imageUrl: '/images/heritage.jpg', published: true, createdAt: '2026-03-20' },
  { id: 'n3', title: 'تسجيل المواهب الفنية الشابة', content: 'أطلقت المنصة حملة لتسجيل المواهب الفنية الشابة في مختلف المجالات الإبداعية.', date: '2026-03-15', imageUrl: '', published: false, createdAt: '2026-03-15' },
  { id: 'n4', title: 'ورشة عمل في فن الخط العربي', content: 'تنظم دار الثقافة ورشة عمل متخصصة في فن الخط العربي للمبتدئين والمحترفين.', date: '2026-03-10', imageUrl: '/images/art-workshop.jpg', published: true, createdAt: '2026-03-10' },
]

export const mockServices: MockDoc[] = [
  { id: 's1', name: 'طلب البطاقة المهنية', description: 'احصل على بطاقتك المهنية للعاملين في القطاع الثقافي', icon: 'card', url: '/services/professional-card', active: true },
  { id: 's2', name: 'بطاقة فنان', description: 'تسجيل وتوثيق المواهب الفنية والإبداعية', icon: 'palette', url: '/services/artist-card', active: true },
  { id: 's3', name: 'استفسارات القطاع', description: 'احصل على إجابات لجميع أسئلتك حول الخدمات الثقافية', icon: 'help', url: '/services/inquiries', active: true },
  { id: 's4', name: 'حجوزات الفعاليات', description: 'احجز تذاكرك للفعاليات والحفلات الثقافية', icon: 'ticket', url: '/services/bookings', active: false },
]

export const mockEvents: MockDoc[] = [
  { id: 'e1', title: 'مهرجان الفنون الخنشلي', description: 'مهرجان سنوي يجمع الفنانين من مختلف أنحاء الولاية لعرض إبداعاتهم في مختلف المجالات الفنية والإبداعية. يتضمن المهرجان عروضاً موسيقية ومسرحية ومعارض للفنون التشكيلية.', date: '2026-05-15', location: 'قصر الكاهنة', capacity: 500, imageUrl: '/images/cultural-festival.jpg', category: 'مهرجان', status: 'active', featured: true },
  { id: 'e2', title: 'معرض الآثار التاريخية', description: 'معرض يعرض القطع الأثرية المكتشفة في منطقة الأوراس، ويضم مجموعة فريدة من القطع الأثرية التي تعود إلى حقب تاريخية مختلفة.', date: '2026-06-01', location: 'متحف خنشلة', capacity: 200, imageUrl: '/images/archaeological-exhibition.jpg', category: 'معرض', status: 'active', featured: false },
  { id: 'e3', title: 'حفل الموسيقى الكلاسيكية', description: 'حفل موسيقي يضم فرقة الموسيقى الأندلسية في أمسية فنية راقية تجمع بين الأصالة والإبداع.', date: '2026-07-10', location: 'دار الثقافة', capacity: 300, imageUrl: '/images/music-concert.jpg', category: 'حفل', status: 'active', featured: false },
  { id: 'e4', title: 'المهرجانات الثقافية', description: 'المهرجانات الثقافية الوطنية والمحلية التي تحتضنها ولاية خنشلة سنوياً، تشمل المهرجان الثقافي الوطني للموسيقى والأغنية الشاوية، المهرجان الثقافي الوطني لمصلحة الطفل، المهرجان الثقافي المحلي للقراءة، والمهرجان الثقافي المحلي للنشاطات والفنون الشعبية.', date: '2026-04-20', location: 'خنشلة', capacity: 1000, imageUrl: '/images/cultural-festival.jpg', category: 'المهرجانات الثقافية', status: 'active', featured: true },
]

let newsStore = [...mockNews]
let servicesStore = [...mockServices]
let eventsStore = [...mockEvents]

function getStore(collectionName: string): MockDoc[] {
  switch (collectionName) {
    case 'news': return newsStore
    case 'services': return servicesStore
    case 'events': return eventsStore
    default: return []
  }
}

function setStore(collectionName: string, data: MockDoc[]) {
  switch (collectionName) {
    case 'news': newsStore = data; break
    case 'services': servicesStore = data; break
    case 'events': eventsStore = data; break
  }
}

export function mockFetchCollection(collectionName: string): MockDoc[] {
  return [...getStore(collectionName)]
}

export function mockAddDocument(collectionName: string, data: Record<string, any>): MockDoc {
  const store = getStore(collectionName)
  const newDoc: MockDoc = {
    id: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    ...data,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  }
  setStore(collectionName, [newDoc, ...store])
  return newDoc
}

export function mockUpdateDocument(collectionName: string, docId: string, data: Record<string, any>) {
  const store = getStore(collectionName)
  setStore(collectionName, store.map(d => d.id === docId ? { ...d, ...data, updatedAt: new Date().toISOString().split('T')[0] } : d))
}

export function mockDeleteDocument(collectionName: string, docId: string) {
  const store = getStore(collectionName)
  setStore(collectionName, store.filter(d => d.id !== docId))
}

export function mockGetCounts() {
  return {
    news: newsStore.length,
    services: servicesStore.length,
    events: eventsStore.length,
  }
}
