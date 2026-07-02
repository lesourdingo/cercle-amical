<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: 'default' | 'hero'
}>(), {
  size: 'default'
})

const imageClass = computed(() =>
  props.size === 'hero' ? 'h-auto w-32 sm:w-36' : 'h-auto w-28'
)
</script>

<template>
  <div
    class="not-prose flex flex-wrap items-center gap-6"
    :class="size === 'hero' ? 'justify-center' : 'my-4'"
  >
    <img
      src="/logo-saint-gildas.jpg"
      alt="Commune de Saint-Gildas-de-Rhuys"
      :class="imageClass"
      width="144"
      height="144"
    >
    <img
      src="/Morbihan_logo2022_Departement_JPG.jpg"
      alt="Conseil départemental du Morbihan"
      :class="imageClass"
      width="144"
      height="144"
    >
  </div>
</template>
