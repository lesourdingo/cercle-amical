import { isActiviteSlug } from '~/utils/activites'

export default eventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug || !isActiviteSlug(slug)) {
    throw createError({ statusCode: 404, statusMessage: 'Activité introuvable' })
  }

  const { public: { mediaUrl } } = useRuntimeConfig(event)

  return listActiviteGalleryImages(slug, mediaUrl)
})
