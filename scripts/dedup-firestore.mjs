#!/usr/bin/env node
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const COLLECTIONS = [
  { name: 'institutions', label: 'المؤسسات', titleFields: ['title'] },
  { name: 'workshops', label: 'الورشات', titleFields: ['name'] },
  { name: 'khenchelaSections', label: 'ملف خنشلة', titleFields: ['title'] },
  { name: 'libraryAnnexes', label: 'ملحقات المكتبة', titleFields: ['name'] },
  { name: 'facilities', label: 'المرافق والخدمات', titleFields: ['name'] },
  { name: 'departments', label: 'الأقسام', titleFields: ['title'] },
  { name: 'artists', label: 'الفنانون', titleFields: ['name'] },
  { name: 'associations', label: 'الجمعيات', titleFields: ['name'] },
  { name: 'directorateStats', label: 'الإحصائيات', titleFields: ['activity'] },
  { name: 'nationalMonuments', label: 'المعالم الوطنية', titleFields: ['title'] },
  { name: 'inventoryMonuments', label: 'الجرد الإضافي', titleFields: ['title'] },
  { name: 'intangibleHeritage', label: 'التراث اللامادي', titleFields: ['alt'] },
  { name: 'events', label: 'الفعاليات', titleFields: ['title'] },
  { name: 'news', label: 'الأخبار', titleFields: ['title'] },
]

const SKIP_FIELDS = new Set(['id', 'createdAt', 'updatedAt', '_seedId'])

function normalize(v) {
  return String(v ?? '').trim().toLowerCase().replace(/\s+/g, ' ')
}

function getTitleKey(d, fields) {
  for (const f of fields) {
    const v = d[f]
    if (typeof v === 'string' && v.trim()) return normalize(v)
  }
  return ''
}

function getTitle(d, fields) {
  for (const f of fields) {
    const v = d[f]
    if (typeof v === 'string' && v.trim()) return v
  }
  return '(untitled)'
}

function scoreDoc(d) {
  let s = 0
  for (const [k, v] of Object.entries(d)) {
    if (SKIP_FIELDS.has(k)) continue
    if (v == null) continue
    if (typeof v === 'string') {
      const t = v.trim()
      if (t) s += 2 + Math.min(t.length, 500) / 50
    } else if (Array.isArray(v)) {
      const filled = v.filter(x => x != null && String(x).trim()).length
      if (filled > 0) s += 3 + filled * 2
    } else if (typeof v === 'number') {
      if (v !== 0) s += 2
    } else if (typeof v === 'boolean') {
      if (v) s += 1
    } else if (typeof v === 'object') {
      s += 1
    }
  }
  if (d._seedId) s += 0.5
  return s
}

const args = new Set(process.argv.slice(2))
const EXECUTE = args.has('--execute')

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}
if (!cfg.apiKey || !cfg.projectId) {
  console.error('ERROR: NEXT_PUBLIC_FIREBASE_* env vars are not set.')
  process.exit(1)
}

const app = initializeApp(cfg)
const db = getFirestore(app)

console.log(`Mode: ${EXECUTE ? 'EXECUTE (deletions WILL be performed)' : 'DRY-RUN (no deletions)'}`)
console.log('Project:', cfg.projectId)
console.log('---')

const reportCollections = []
let totalToDelete = 0
let totalDocs = 0

for (const c of COLLECTIONS) {
  let docs = []
  try {
    const snap = await getDocs(collection(db, c.name))
    docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (e) {
    console.error(`  [${c.name}] FAILED to read:`, e.message)
    reportCollections.push({ name: c.name, label: c.label, error: String(e.message), totalBefore: 0, groups: [] })
    continue
  }
  totalDocs += docs.length

  const buckets = new Map()
  for (const d of docs) {
    const k = getTitleKey(d, c.titleFields)
    if (!k) continue
    const arr = buckets.get(k) || []
    arr.push(d)
    buckets.set(k, arr)
  }

  const groups = []
  let toDeleteCount = 0
  for (const [titleKey, arr] of buckets.entries()) {
    if (arr.length < 2) continue
    const sorted = [...arr].sort((a, b) => scoreDoc(b) - scoreDoc(a))
    const keeper = sorted[0]
    const toDelete = sorted.slice(1)
    if (toDelete.length === 0) continue
    groups.push({
      titleKey,
      title: getTitle(keeper, c.titleFields),
      keeper: { id: keeper.id, score: +scoreDoc(keeper).toFixed(2), seedId: keeper._seedId ?? null },
      toDelete: toDelete.map(d => ({ id: d.id, score: +scoreDoc(d).toFixed(2), seedId: d._seedId ?? null })),
    })
    toDeleteCount += toDelete.length
  }
  totalToDelete += toDeleteCount

  reportCollections.push({
    name: c.name,
    label: c.label,
    totalBefore: docs.length,
    duplicateGroups: groups.length,
    toDeleteCount,
    sampleTitles: docs.slice(0, 5).map(d => getTitle(d, c.titleFields)),
    groups,
  })

  console.log(`  [${c.name.padEnd(22)}] docs=${String(docs.length).padStart(4)}  groups=${String(groups.length).padStart(3)}  delete=${toDeleteCount}`)
}

console.log('---')
console.log(`TOTAL: ${totalDocs} docs, ${totalToDelete} to delete`)

const ts = new Date().toISOString().replace(/[:.]/g, '-')
mkdirSync('.local/dedup-reports', { recursive: true })
const reportPath = join('.local/dedup-reports', `dedup-${EXECUTE ? 'execute' : 'dryrun'}-${ts}.json`)

const report = {
  generatedAt: new Date().toISOString(),
  mode: EXECUTE ? 'execute' : 'dry-run',
  projectId: cfg.projectId,
  totals: { docs: totalDocs, toDelete: totalToDelete },
  collections: reportCollections,
}

if (!EXECUTE) {
  writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`\nDry-run report written: ${reportPath}`)
  console.log('Re-run with --execute to perform deletions.')
  process.exit(0)
}

if (totalToDelete === 0) {
  writeFileSync(reportPath, JSON.stringify({ ...report, postExecution: { deleted: 0, failed: 0 } }, null, 2))
  console.log('Nothing to delete. Report:', reportPath)
  process.exit(0)
}

console.log(`\nExecuting ${totalToDelete} deletions...`)
let deleted = 0
let failed = 0
const failures = []

for (const c of reportCollections) {
  for (const g of c.groups) {
    for (const d of g.toDelete) {
      if (d.id === g.keeper.id) continue
      try {
        await deleteDoc(doc(db, c.name, d.id))
        deleted++
      } catch (e) {
        failed++
        failures.push({ collection: c.name, id: d.id, error: String(e.message) })
      }
    }
  }
  process.stdout.write(`  ${c.name}: done\n`)
}

console.log(`\nDeleted: ${deleted}  Failed: ${failed}`)

const after = []
for (const c of COLLECTIONS) {
  try {
    const snap = await getDocs(collection(db, c.name))
    after.push({
      name: c.name,
      countAfter: snap.size,
      sampleTitles: snap.docs.slice(0, 5).map(d => getTitle({ id: d.id, ...d.data() }, c.titleFields)),
    })
  } catch (e) {
    after.push({ name: c.name, error: String(e.message) })
  }
}

const finalReport = {
  ...report,
  postExecution: { deleted, failed, failures, after },
}
writeFileSync(reportPath, JSON.stringify(finalReport, null, 2))

console.log('\nBefore/after summary:')
for (const c of reportCollections) {
  const a = after.find(x => x.name === c.name)
  const ac = a?.countAfter ?? '?'
  console.log(`  [${c.name.padEnd(22)}] before=${String(c.totalBefore).padStart(4)}  after=${String(ac).padStart(4)}`)
}
console.log(`\nExecution report written: ${reportPath}`)
process.exit(failed > 0 ? 1 : 0)
