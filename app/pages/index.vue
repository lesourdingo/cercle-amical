<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('landing').path('/').first())
if (!page.value?.hero || !page.value?.cta) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const landing = page.value

const title = landing.seo?.title
const description = landing.seo?.description

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
  <div>
    <UPageHero
      :title="landing.hero.title"
      :description="landing.hero.description"
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
      :title="landing.cta.title"
      :description="landing.cta.description"
      :links="landing.cta.links"
    />
  </div>
</template>
