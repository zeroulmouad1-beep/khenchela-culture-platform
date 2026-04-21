export const ALLOWED_COLLECTIONS = new Set<string>([
  'institutions',
  'workshops',
  'facilities',
  'libraryAnnexes',
  'khenchelaSections',
  'departments',
  'events',
  'news',
  'artists',
  'associations',
  'directorateStats',
  'nationalMonuments',
  'inventoryMonuments',
  'intangibleHeritage',
])

export function isAllowedCollection(name: string): boolean {
  return ALLOWED_COLLECTIONS.has(name)
}
