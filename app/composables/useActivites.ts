import type { ActiviteSlug, EditorialIconItem } from '~/utils/activites'
import {
  ACTIVITE_ICONS,
  ACTIVITE_LABELS,
  extractNavigationIcon,
  getEditorialIcon,
  isActiviteSlug,
  resolveActiviteSlug
} from '~/utils/activites'

export const ALL_ACTIVITES_FILTER = 'all' as const
export type ActiviteFilter = ActiviteSlug | typeof ALL_ACTIVITES_FILTER

export function useActivites() {
  const { data: activitePages } = useAsyncData('activites-icons', () =>
    queryCollection('docs')
      .where('path', 'LIKE', '/activites/%')
      .select('path', 'title', 'navigation')
      .all()
  )

  const iconBySlug = computed(() => {
    const map: Record<string, string> = { ...ACTIVITE_ICONS }

    for (const page of activitePages.value ?? []) {
      if (page.path === '/activites' || page.path.endsWith('/index')) {
        continue
      }

      const slug = page.path.replace('/activites/', '')
      const icon = extractNavigationIcon(page.navigation)
      if (icon) {
        map[slug] = icon
      }
    }

    return map
  })

  const options = computed(() =>
    (Object.keys(ACTIVITE_LABELS) as ActiviteSlug[]).map(slug => ({
      value: slug,
      label: ACTIVITE_LABELS[slug],
      icon: iconBySlug.value[slug] ?? ACTIVITE_ICONS[slug]
    }))
  )

  const filterOptions = computed(() => [
    {
      value: ALL_ACTIVITES_FILTER,
      label: 'Toutes les activités',
      icon: 'i-lucide-layout-grid'
    },
    ...options.value
  ])

  function getIcon(
    item: EditorialIconItem,
    fallbackIcon = 'i-lucide-calendar'
  ): string {
    return getEditorialIcon(item, {
      iconBySlug: iconBySlug.value,
      fallbackIcon
    })
  }

  function getSlug(item: EditorialIconItem): ActiviteSlug {
    return resolveActiviteSlug(item)
  }

  function matchesFilter(item: EditorialIconItem, filter: ActiviteFilter): boolean {
    if (filter === ALL_ACTIVITES_FILTER) {
      return true
    }
    return resolveActiviteSlug(item) === filter
  }

  function parseActiviteFilter(value: unknown): ActiviteFilter {
    if (typeof value === 'string' && isActiviteSlug(value)) {
      return value
    }
    return ALL_ACTIVITES_FILTER
  }

  return {
    iconBySlug,
    options,
    filterOptions,
    getIcon,
    getSlug,
    matchesFilter,
    parseActiviteFilter
  }
}
