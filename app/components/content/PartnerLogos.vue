<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: 'default' | 'hero'
}>(), {
  size: 'default'
})

const saintGildasClass = computed(() =>
  props.size === 'hero' ? 'h-auto w-24 sm:w-28' : 'h-auto w-36'
)

const morbihanClass = computed(() =>
  props.size === 'hero' ? 'h-auto w-52 sm:w-56' : 'h-auto w-52'
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
