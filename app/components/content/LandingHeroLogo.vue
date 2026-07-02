<script setup lang="ts">
const { header } = useAppConfig()

const logoSrc = computed(() =>
  header?.logo?.hero
  || header?.logo?.light
)
</script>

<template>
  <img
    v-if="logoSrc"
    :src="logoSrc"
    :alt="header?.logo?.alt || header?.title || 'Cercle Amical'"
    class="mx-auto w-full max-w-64 sm:max-w-72 lg:max-w-80"
    width="320"
    height="320"
  >
</template>
