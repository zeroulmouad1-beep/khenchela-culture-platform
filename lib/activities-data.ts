import { fetchCollection, isMockMode, FirestoreDoc } from '@/lib/firestore-helpers'

export interface Association {
  id: number
  name: string
  type: string
  president: string
  foundationDate: string
}

export interface Statistic {
  id: number
  activity: string
  value: number
  target: number
  progress: number
  period: string
}

export const associationsData: Association[] = [
  { id: 1, name: 'جمعية النور الثقافية', type: 'جمعية ثقافية', president: 'عبد القادر بن سالم', foundationDate: '2015-03-12' },
  { id: 2, name: 'جمعية الإبداع للفنون', type: 'جمعية فنية', president: 'سمية بوعزيز', foundationDate: '2018-07-20' },
  { id: 3, name: 'جمعية أوراس للتراث', type: 'جمعية تراثية', president: 'محمد الصالح حمادي', foundationDate: '2010-01-05' },
  { id: 4, name: 'جمعية الأمل للشباب', type: 'جمعية شبانية', president: 'خالد مرزوقي', foundationDate: '2020-09-15' },
  { id: 5, name: 'جمعية المسرح الحر', type: 'جمعية فنية', president: 'نادية بن عمر', foundationDate: '2016-11-30' },
  { id: 6, name: 'جمعية القلم الذهبي', type: 'جمعية أدبية', president: 'رشيد بوزيان', foundationDate: '2012-04-22' },
  { id: 7, name: 'جمعية الموسيقى الشاوية', type: 'جمعية فنية', president: 'فريدة تواتي', foundationDate: '2014-08-10' },
  { id: 8, name: 'جمعية حماية التراث المحلي', type: 'جمعية تراثية', president: 'عمار شريف', foundationDate: '2019-02-28' },
  { id: 9, name: 'جمعية الفجر للثقافة والعلوم', type: 'جمعية ثقافية', president: 'ياسمين حداد', foundationDate: '2021-06-01' },
  { id: 10, name: 'جمعية ألوان الإبداع', type: 'جمعية فنية', president: 'بلال بن ناصر', foundationDate: '2017-12-14' },
]

export const statisticsData: Statistic[] = [
  { id: 1, activity: 'عدد النشاطات الثقافية المنظمة', value: 47, target: 60, progress: 78, period: 'السنة الجارية 2026' },
  { id: 2, activity: 'عدد المشاركين في الفعاليات', value: 3200, target: 5000, progress: 64, period: 'السنة الجارية 2026' },
  { id: 3, activity: 'المعارض الفنية المقامة', value: 12, target: 15, progress: 80, period: 'السنة الجارية 2026' },
  { id: 4, activity: 'الورشات التكوينية المنجزة', value: 8, target: 20, progress: 40, period: 'السنة الجارية 2026' },
  { id: 5, activity: 'الأيام الدراسية والملتقيات', value: 5, target: 10, progress: 50, period: 'السنة الجارية 2026' },
  { id: 6, activity: 'المسابقات الثقافية المنظمة', value: 3, target: 8, progress: 38, period: 'السنة الجارية 2026' },
  { id: 7, activity: 'عدد الجمعيات النشطة', value: 10, target: 10, progress: 100, period: 'الفصل الأول 2026' },
  { id: 8, activity: 'نسبة رضا المشاركين', value: 85, target: 100, progress: 85, period: 'آخر استبيان' },
]

function docToAssociation(doc: FirestoreDoc): Association {
  return {
    id: doc._seedId ?? doc.id,
    name: doc.name || '',
    type: doc.type || '',
    president: doc.president || '',
    foundationDate: doc.foundationDate || '',
  }
}

function docToStatistic(doc: FirestoreDoc): Statistic {
  return {
    id: doc._seedId ?? doc.id,
    activity: doc.activity || '',
    value: doc.value ?? 0,
    target: doc.target ?? 0,
    progress: doc.progress ?? 0,
    period: doc.period || '',
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
  return associationsData
}

export async function getStatistics(): Promise<Statistic[]> {
  try {
    if (!isMockMode) {
      const docs = await fetchCollection('directorateStats', 'activity')
      if (docs.length > 0) return docs.map(docToStatistic)
    }
  } catch (e) {
    console.error('Failed to fetch statistics from Firestore:', e)
  }
  return statisticsData
}
