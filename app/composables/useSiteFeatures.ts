export function useSiteFeatures() {
  const { features } = useAppConfig()

  return {
    /** Section actualités (menu, accueil, pages, recherche). */
    actualitesEnabled: features?.actualites !== false
  }
}
