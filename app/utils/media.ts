const IMAGE_EXTENSION = /\.(jpe?g|png|webp|gif|avif)$/i

export type ActiviteGalleryImage = {
  url: string
  pathname: string
  alt: string
}

export function isImagePathname(pathname: string): boolean {
  return IMAGE_EXTENSION.test(pathname)
}

export function blobPublicUrl(pathname: string, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, '')
  const path = pathname.replace(/^\//, '')
  return `${base}/${path}`
}
