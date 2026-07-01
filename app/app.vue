<script setup lang="ts">
const { seo } = useAppConfig()
const { actualitesEnabled } = useSiteFeatures()

const { data: navigation } = await useAsyncData('navigation', () => queryMergedNavigation())
const visibleNavigation = computed(() =>
  filterNavigationByFeatures(navigation.value ?? [], actualitesEnabled)
)
const { data: files } = useLazyAsyncData('search', () => queryMergedSearchSections(), {
  server: false
})

if (import.meta.prerender) {
  type PrerenderCollection = 'docs' | 'actualites' | 'evenements'
  const collections: PrerenderCollection[] = actualitesEnabled
    ? ['docs', 'actualites', 'evenements']
    : ['docs', 'evenements']
  const pages = await Promise.all(
    collections.map(collection => queryCollection(collection).select('path').all())
  )
  prerenderRoutes(
    pages.flat()
      .map(page => page.path)
      .filter((path): path is string => !!path && !path.includes('.navigation'))
  )
}

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
  ],
  htmlAttrs: {
    lang: 'fr'
  }
})

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  ogSiteName: seo?.siteName,
  twitterCard: 'summary_large_image'
})

provide('navigation', visibleNavigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <AppHeader />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="visibleNavigation"
      />
    </ClientOnly>
  </UApp>
</template>
