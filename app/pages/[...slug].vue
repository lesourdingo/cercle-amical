<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

definePageMeta({
  layout: 'docs'
})

const route = useRoute()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const { actualitesEnabled } = useSiteFeatures()

const collection = collectionForPath(route.path)

if (collection === 'actualites' && !actualitesEnabled) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: page } = await useAsyncData(route.path, () => queryContentPage(route.path))
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  let query = queryCollectionItemSurroundings(collection, route.path, {
    fields: ['description']
  })

  if (collection === 'actualites') {
    query = query.order('date', 'ASC')
  }

  return query
})

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

const headline = computed(() => findPageHeadline(navigation?.value, page.value?.path))

const pageFallbackIcon = computed(() => {
  if (collection === 'actualites') return 'i-lucide-calendar'
  return 'i-lucide-file-text'
})

const showActiviteIcon = computed(() => collection === 'actualites')

const activiteSlug = activiteSlugFromPagePath(route.path)

const { data: upcomingEvents } = activiteSlug
  ? await useAsyncData(
      `activite-events-${activiteSlug}`,
      () => queryUpcomingActualitesForActivite(activiteSlug)
    )
  : { data: ref([]) }

const nextUpcomingEvent = computed(() => upcomingEvents.value?.[0])

const { data: galleryImages } = activiteSlug
  ? await useActiviteGallery(activiteSlug)
  : { data: ref([]) }

defineOgImageComponent('Docs', {
  headline: headline.value
})
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      :title="page.title"
      :description="activiteSlug ? undefined : page.description"
      :headline="headline"
    >
      <template
        v-if="showActiviteIcon"
        #title
      >
        <div class="flex items-center gap-3">
          <EditorialActiviteIcon
            :item="page"
            :fallback-icon="pageFallbackIcon"
          />
          <span>{{ page.title }}</span>
        </div>
      </template>
      <template #links>
        <UButton
          v-for="(link, index) in page.links"
          :key="index"
          v-bind="link"
        />
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer
        v-if="page"
        :value="page"
      />

      <ActiviteUpcomingEvents
        v-if="nextUpcomingEvent && activiteSlug"
        :event="nextUpcomingEvent"
        :activite="activiteSlug"
      />

      <ActiviteGallery
        v-if="galleryImages?.length"
        :images="galleryImages"
        :title="page.title"
      />

      <USeparator v-if="surround?.length" />

      <UContentSurround :surround="surround" />
    </UPageBody>
  </UPage>
</template>
