<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

useHead({
  htmlAttrs: {
    lang: 'fr'
  }
})

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})

const { data: navigation } = await useAsyncData('navigation', () => queryMergedNavigation())
const visibleNavigation = computed(() => navigation.value ?? [])
const { data: files } = useLazyAsyncData('search', () => queryMergedSearchSections(), {
  server: false
})

provide('navigation', visibleNavigation)
</script>

<template>
  <UApp>
    <AppHeader />

    <UError :error="error" />

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="visibleNavigation"
      />
    </ClientOnly>
  </UApp>
</template>
