<script setup lang="ts">
const { seo } = useAppConfig()

const { data: navigation } = await useAsyncData('navigation', () => queryMergedNavigation())
const { data: files } = useLazyAsyncData('search', () => queryMergedSearchSections(), {
  server: false
})

if (import.meta.prerender) {
  const collections = ['docs', 'actualites', 'evenements'] as const
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
    { rel: 'icon', href: '/favicon.ico' }
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

provide('navigation', navigation)
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
        :navigation="navigation"
      />
    </ClientOnly>
  </UApp>
</template>
