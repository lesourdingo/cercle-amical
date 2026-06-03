export const ACTIVITE_SLUGS = [
  'belote',
  'tarot',
  'petanque',
  'boule-bretonne',
  'loto',
  'repas',
  'sorties',
  'voyages',
  'association',
  'autre'
] as const

export type ActiviteSlug = typeof ACTIVITE_SLUGS[number]

/** Libellés pour le formulaire Studio (enum). */
export const ACTIVITE_LABELS: Record<ActiviteSlug, string> = {
  belote: 'Belote',
  tarot: 'Tarot',
  petanque: 'Pétanque',
  'boule-bretonne': 'Boule bretonne',
  loto: 'Loto',
  repas: 'Repas & convivialité',
  sorties: 'Sorties',
  voyages: 'Voyages',
  association: 'Vie de l\'association',
  autre: 'Autre'
}

/** Icônes alignées sur les pages Activités (repli si non chargées depuis le contenu). */
export const ACTIVITE_ICONS: Record<ActiviteSlug, string> = {
  belote: 'i-lucide-spade',
  tarot: 'i-lucide-club',
  petanque: 'i-lucide-circle',
  'boule-bretonne': 'i-lucide-circle-dot',
  loto: 'i-lucide-ticket',
  repas: 'i-lucide-utensils',
  sorties: 'i-lucide-map-pin',
  voyages: 'i-lucide-plane',
  association: 'i-lucide-users',
  autre: 'i-lucide-calendar'
}

const INFER_ORDER: ActiviteSlug[] = [
  'boule-bretonne',
  'association',
  'belote',
  'tarot',
  'petanque',
  'loto',
  'repas',
  'sorties',
  'voyages'
]

const INFER_KEYWORDS: Partial<Record<ActiviteSlug, string[]>> = {
  'boule-bretonne': ['boule bretonne'],
  association: ['assemblee', 'assemblée', 'ag ordinaire', 'ag extraordinaire'],
  belote: ['belote', 'bélote'],
  tarot: ['tarot'],
  petanque: ['petanque', 'pétanque'],
  loto: ['loto'],
  repas: ['repas', 'chandeleur', 'galette', 'noel', 'noël', 'beaujolais', 'voeux', 'vœux'],
  sorties: ['sortie'],
  voyages: ['voyage']
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

export function isActiviteSlug(value: string | undefined): value is ActiviteSlug {
  return !!value && ACTIVITE_SLUGS.includes(value as ActiviteSlug)
}

export function inferActiviteFromText(
  title = '',
  description = ''
): ActiviteSlug | undefined {
  const text = normalizeText(`${title} ${description}`)

  for (const slug of INFER_ORDER) {
    const keywords = INFER_KEYWORDS[slug]
    if (keywords?.some(keyword => text.includes(normalizeText(keyword)))) {
      return slug
    }
  }

  return undefined
}

export type EditorialIconItem = {
  activite?: string
  title?: string
  description?: string
}

export function resolveActiviteSlug(
  item: EditorialIconItem,
  fallback: ActiviteSlug = 'autre'
): ActiviteSlug {
  if (isActiviteSlug(item.activite)) {
    return item.activite
  }
  return inferActiviteFromText(item.title, item.description) ?? fallback
}

export function getActiviteIcon(
  slug: ActiviteSlug,
  iconBySlug?: Partial<Record<string, string>>
): string {
  return iconBySlug?.[slug] ?? ACTIVITE_ICONS[slug]
}

export function getEditorialIcon(
  item: EditorialIconItem,
  options: {
    iconBySlug?: Partial<Record<string, string>>
    defaultSlug?: ActiviteSlug
    fallbackIcon?: string
  } = {}
): string {
  const slug = resolveActiviteSlug(item, options.defaultSlug ?? 'autre')
  const fromActivite = getActiviteIcon(slug, options.iconBySlug)

  if (slug !== 'autre' || options.defaultSlug) {
    return fromActivite
  }

  return options.fallbackIcon ?? fromActivite
}

export function extractNavigationIcon(navigation: unknown): string | undefined {
  if (navigation && typeof navigation === 'object' && 'icon' in navigation) {
    const icon = (navigation as { icon?: string }).icon
    return typeof icon === 'string' ? icon : undefined
  }
  return undefined
}
