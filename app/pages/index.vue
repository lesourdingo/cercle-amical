<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('landing').path('/').first())
if (!page.value?.hero || !page.value?.cta) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = page.value.seo?.title
const description = page.value.seo?.description

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

defineOgImageComponent('Docs', {
  title,
  description
})
</script>

<template>
  <UPageHero
    :title="page.hero.title"
    :description="page.hero.description"
    orientation="horizontal"
  >
    <LandingHeroLogo />

    <template #footer>
      <LandingHeroFooter />
    </template>
  </UPageHero>

  <LandingNews />

  <LandingActivites />

  <UPageSection
    :title="page.cta.title"
    :description="page.cta.description"
    :links="page.cta.links"
  />
</template>
