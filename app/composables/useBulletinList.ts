import type { BulletinPdf } from '~/utils/media'

export function useBulletinList() {
  return useAsyncData(
    'bulletin-list',
    async () => {
      try {
        return await $fetch<BulletinPdf[]>('/api/bulletins')
      } catch {
        return [] as BulletinPdf[]
      }
    },
    {
      default: () => [] as BulletinPdf[],
      server: false
    }
  )
}
