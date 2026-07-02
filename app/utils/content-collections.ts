import type { ContentNavigationItem } from '@nuxt/content'
import type { ActiviteSlug } from '~/utils/activites'

export const CONTENT_COLLECTIONS = ['actualites', 'evenements', 'docs'] as const
export type ContentCollectionName = typeof CONTENT_COLLECTIONS[number]

export const NAV_ORDER = ['/actualites', '/evenements', '/activites', '/presentation-du-club'] as const

/** Sections sans sous-menu dans la barre de navigation (évite le bouton chevron Nuxt UI). */
export const NAV_WITHOUT_CHILDREN = ['/actualites', '/evenements', '/presentation-du-club'] as const

export function sanitizeNavigationItems(items: ContentNavigationItem[]): ContentNavigationItem[] {
  return items.map((item) => {
    if (NAV_WITHOUT_CHILDREN.includes(item.path as (typeof NAV_WITHOUT_CHILDREN)[number])) {
      const { children: _children, ...rest } = item
      return rest
    }
    return item
  })
}

export function isActualitesNavPath(path: string): boolean {
  return path === '/actualites' || path.startsWith('/actualites/')
}

export function filterNavigationByFeatures(
  items: ContentNavigationItem[],
  actualitesEnabled = true
): ContentNavigationItem[] {
  if (actualitesEnabled) {
    return items
  }

  return items
    .filter(item => !isActualitesNavPath(item.path))
    .map((item) => {
      if (!item.children?.length) {
        return item
      }

      const children = filterNavigationByFeatures(item.children, actualitesEnabled)
      return children.length ? { ...item, children } : item
    })
}

export function getNavOrder(actualitesEnabled = true): string[] {
  return NAV_ORDER.filter(path => actualitesEnabled || path !== '/actualites')
}

export function collectionForPath(path: string): ContentCollectionName {
  if (path === '/actualites' || path.startsWith('/actualites/')) {
    return 'actualites'
  }
  if (path === '/evenements' || path.startsWith('/evenements/')) {
    return 'evenements'
  }
  return 'docs'
}

export function queryContentPage(path: string) {
  return queryCollection(collectionForPath(path)).path(path).first()
}

export function parseContentDate(value: string | Date | undefined): number {
  if (!value) return 0
  const time = new Date(value as string).getTime()
  return Number.isNaN(time) ? 0 : time
}

export function getStartOfToday(): number {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
}

/** Date locale au format AAAA-MM-JJ (alignée sur isUpcomingByDate). */
export function getTodayLocalISO(): string {
  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${today.getFullYear()}-${month}-${day}`
}

export function isUpcomingByDate(date: string | Date | undefined): boolean {
  const time = parseContentDate(date)
  return time > 0 && time >= getStartOfToday()
}

export function isPastByDate(date: string | Date | undefined): boolean {
  const time = parseContentDate(date)
  return time > 0 && time < getStartOfToday()
}

export function sortByDate<T extends { date?: string | Date }>(
  items: T[],
  direction: 'ASC' | 'DESC' = 'ASC'
): T[] {
  const sign = direction === 'ASC' ? 1 : -1
  return [...items].sort((a, b) => (parseContentDate(a.date) - parseContentDate(b.date)) * sign)
}

/** Événements : année en cours d’abord (ordre chronologique), puis les autres années. */
export function sortEvenementsByDate<T extends { date?: string | Date }>(items: T[]): T[] {
  const year = new Date().getFullYear()
  const startOfYear = new Date(year, 0, 1).getTime()
  const endOfYear = new Date(year + 1, 0, 1).getTime()

  return [...items].sort((a, b) => {
    const aDate = parseContentDate(a.date)
    const bDate = parseContentDate(b.date)
    const aInYear = aDate >= startOfYear && aDate < endOfYear
    const bInYear = bDate >= startOfYear && bDate < endOfYear

    if (aInYear !== bInYear) {
      return aInYear ? -1 : 1
    }

    return aDate - bDate
  })
}

/** Événements à venir pour une activité donnée. */
export async function queryUpcomingEvenementsForActivite(activite: ActiviteSlug) {
  const items = await queryCollection('evenements')
    .where('path', 'LIKE', '/evenements/%')
    .where('activite', '=', activite)
    .where('date', '>=', getTodayLocalISO())
    .select('path', 'title', 'description', 'date', 'activite')
    .order('date', 'ASC')
    .all()

  const upcoming = items.filter(item =>
    !item.path.endsWith('/index')
    && !item.path.includes('.navigation')
  )

  return sortEvenementsByDate(upcoming)
}

/** Liste les pages d’une section, triées par date quand c’est pertinent. */
export function queryContentList(path: string) {
  const collection = collectionForPath(path)
  let query = queryCollection(collection).where('path', 'LIKE', `${path}/%`)

  if (path === '/evenements') {
    query = query.order('date', 'ASC')
  } else if (path === '/actualites') {
    query = query.order('date', 'DESC')
  }

  return query.all()
}

export function sortNavigation(items: ContentNavigationItem[]) {
  return [...items].sort((a, b) => {
    const ai = (NAV_ORDER as readonly string[]).indexOf(a.path)
    const bi = (NAV_ORDER as readonly string[]).indexOf(b.path)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })
}

export async function queryMergedNavigation() {
  const { features } = useAppConfig()
  const actualitesEnabled = features?.actualites !== false

  const [actualites, docs, evenements] = await Promise.all([
    actualitesEnabled
      ? queryCollectionNavigation('actualites').order('date', 'DESC')
      : Promise.resolve(null),
    queryCollectionNavigation('docs'),
    queryCollectionNavigation('evenements').order('date', 'ASC')
  ])

  return sanitizeNavigationItems(sortNavigation(filterNavigationByFeatures([
    ...(actualitesEnabled && actualites ? actualites : []),
    ...(docs ?? []),
    ...(evenements ?? [])
  ], actualitesEnabled)))
}

export async function queryMergedSearchSections() {
  const { features } = useAppConfig()
  const collections = CONTENT_COLLECTIONS.filter(
    name => name !== 'actualites' || features?.actualites !== false
  )
  const sections = await Promise.all(
    collections.map(name => queryCollectionSearchSections(name))
  )
  return sections.flat()
}
