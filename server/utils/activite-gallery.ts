import type { ActiviteSlug } from '~/utils/activites'
import { isImagePathname, blobPublicUrl, type ActiviteGalleryImage } from '~/utils/media'

const IMAGE_CONTENT_TYPE = /^image\//

export async function listActiviteGalleryImages(
  slug: ActiviteSlug,
  mediaBaseUrl: string,
  title?: string
): Promise<ActiviteGalleryImage[]> {
  const prefix = `studio/${slug}/`
  const images: ActiviteGalleryImage[] = []

  try {
    let cursor: string | undefined

    do {
      const { blobs, cursor: nextCursor } = await blob.list({
        prefix,
        cursor,
        limit: 100
      })

      for (const item of blobs) {
        if (item.size <= 0) {
          continue
        }

        const pathname = item.pathname
        if (!pathname || !isImagePathname(pathname)) {
          continue
        }

        if (item.contentType && !IMAGE_CONTENT_TYPE.test(item.contentType)) {
          continue
        }

        images.push({
          pathname,
          url: item.url ?? blobPublicUrl(pathname, mediaBaseUrl),
          alt: title ? `${title} — photo ${images.length + 1}` : `Photo ${images.length + 1}`
        })
      }

      cursor = nextCursor
    } while (cursor)
  } catch (error) {
    console.warn(`[activite-gallery] Unable to list images for ${slug}:`, error)
    return []
  }

  return images.sort((a, b) => a.pathname.localeCompare(b.pathname, undefined, { numeric: true }))
}
