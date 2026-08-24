export const ACTUALITE_STATUTS = ['ouvert', 'complet', 'annule'] as const

export type ActualiteStatut = typeof ACTUALITE_STATUTS[number]

export const ACTUALITE_STATUT_LABELS: Record<ActualiteStatut, string> = {
  ouvert: 'Ouvert',
  complet: 'Complet',
  annule: 'Annulé'
}

const ACTUALITE_STATUT_BADGES: Record<
  Exclude<ActualiteStatut, 'ouvert'>,
  { label: string, color: 'error' | 'warning', icon: string }
> = {
  annule: {
    label: 'Annulé',
    color: 'error',
    icon: 'i-lucide-ban'
  },
  complet: {
    label: 'Complet',
    color: 'warning',
    icon: 'i-lucide-users'
  }
}

export function isActualiteStatut(value: string | undefined): value is ActualiteStatut {
  return !!value && ACTUALITE_STATUTS.includes(value as ActualiteStatut)
}

export function getActualiteStatutBadge(statut: string | undefined) {
  if (statut !== 'annule' && statut !== 'complet') {
    return undefined
  }

  return ACTUALITE_STATUT_BADGES[statut]
}
