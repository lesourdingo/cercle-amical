import type { ActiviteSlug } from '~/utils/activites'
import {
  ACTIVITE_ICONS,
  ACTIVITE_LABELS,
  extractNavigationIcon,
  getEditorialIcon,
  isActiviteSlug,
  type EditorialIconItem
} from '~/utils/activites'

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
    if (isActiviteSlug(item.activite)) {
      return item.activite
    }
    return 'autre'
  }

  return {
    iconBySlug,
    options,
    getIcon,
    getSlug
  }
}
