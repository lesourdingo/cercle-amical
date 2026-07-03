<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: 'default' | 'hero'
}>(), {
  size: 'default'
})

const saintGildasClass = computed(() =>
  props.size === 'hero' ? 'h-auto w-16 sm:w-20' : 'h-auto w-28'
)

const morbihanClass = computed(() =>
  props.size === 'hero' ? 'h-auto w-28 sm:w-32' : 'h-auto w-28'
)
</script>

<template>
  <div
    class="not-prose flex flex-wrap items-center shrink-0"
    :class="size === 'hero' ? 'gap-3 sm:gap-4' : 'gap-6 my-4'"
  >
    <img
      src="/logo-saint-gildas.jpg"
      alt="Commune de Saint-Gildas-de-Rhuys"
      :class="saintGildasClass"
      width="144"
      height="144"
    >
    <img
      src="/Morbihan_logo2022_Departement_JPG.jpg"
      alt="Conseil départemental du Morbihan"
      :class="morbihanClass"
      width="144"
      height="144"
    >
  </div>
</template>
