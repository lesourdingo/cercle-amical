import { blobPublicUrl, type BulletinPdf } from '~/utils/media'

const PDF_EXTENSION = /\.pdf$/i
const PDF_CONTENT_TYPE = /^application\/pdf/

function bulletinTitleFromPathname(pathname: string): string {
  const filename = pathname.split('/').pop() ?? 'Bulletin'
  return decodeURIComponent(filename.replace(/\.pdf$/i, '').trim())
}

function bulletinSortKey(pathname: string): string {
  const filename = pathname.split('/').pop() ?? ''
  const datedMatch = filename.match(/(\d+)\s*(\d{4})/)
  if (datedMatch?.[1] && datedMatch[2]) {
    return `${datedMatch[2]}-${datedMatch[1].padStart(2, '0')}`
  }
  const yearMatch = filename.match(/(\d{4})/)
  if (yearMatch?.[1]) {
    return yearMatch[1]
  }
  return filename
}

async function listPdfsInPrefix(prefix: string, mediaBaseUrl: string): Promise<BulletinPdf[]> {
  const bulletins: BulletinPdf[] = []

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
      if (!pathname || !PDF_EXTENSION.test(pathname)) {
        continue
      }

      if (item.contentType && !PDF_CONTENT_TYPE.test(item.contentType)) {
        continue
      }

      bulletins.push({
        pathname,
        url: item.url ?? blobPublicUrl(pathname, mediaBaseUrl),
        title: bulletinTitleFromPathname(pathname),
        sortKey: bulletinSortKey(pathname)
      })
    }

    cursor = nextCursor
  } while (cursor)

  return bulletins.sort((a, b) => b.sortKey.localeCompare(a.sortKey, undefined, { numeric: true }))
}

export async function listBulletinPdfs(mediaBaseUrl: string): Promise<BulletinPdf[]> {
  try {
    return await listPdfsInPrefix('studio/bulletin-information/', mediaBaseUrl)
  } catch (error) {
    console.warn('[bulletin-list] Unable to list bulletins from R2:', error)
    return []
  }
}

export async function getAdhesionBulletinPdf(mediaBaseUrl: string): Promise<BulletinPdf | null> {
  try {
    const bulletins = await listPdfsInPrefix('studio/bulletin-adhesion/', mediaBaseUrl)
    return bulletins[0] ?? null
  } catch (error) {
    console.warn('[bulletin-list] Unable to fetch adhesion bulletin from R2:', error)
    return null
  }
}
