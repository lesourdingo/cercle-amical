import type { BulletinPdf } from '~/utils/media'

export function useAdhesionBulletin() {
  return useAsyncData(
    'bulletin-adhesion',
    async () => {
      try {
        return await $fetch<BulletinPdf | null>('/api/bulletin-adhesion')
      } catch {
        return null
      }
    },
    {
      default: () => null,
      server: false
    }
  )
}
