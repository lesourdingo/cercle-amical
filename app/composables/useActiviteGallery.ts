import type { ActiviteSlug } from '~/utils/activites'
import type { ActiviteGalleryImage } from '~/utils/media'

export function useActiviteGallery(slug: ActiviteSlug | undefined) {
  return useAsyncData(
    slug ? `activite-gallery-${slug}` : 'activite-gallery-none',
    async () => {
      if (!slug) {
        return [] as ActiviteGalleryImage[]
      }

      try {
        return await $fetch<ActiviteGalleryImage[]>(`/api/activites/${slug}/gallery`)
      } catch {
        return [] as ActiviteGalleryImage[]
      }
    },
    { default: () => [] as ActiviteGalleryImage[], server: false }
  )
}
