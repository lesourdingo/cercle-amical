<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: 'default' | 'hero'
}>(), {
  size: 'default'
})

const saintGildasClass = computed(() =>
  props.size === 'hero' ? 'h-auto w-32 sm:w-40' : 'h-auto w-44'
)

const morbihanClass = computed(() =>
  props.size === 'hero' ? 'h-auto w-64 sm:w-72' : 'h-auto w-64'
)
</script>

<template>
  <div
    class="not-prose flex flex-wrap items-center shrink-0"
    :class="size === 'hero' ? 'gap-4 sm:gap-6' : 'gap-8 my-4'"
  >
    <img
      src="/logo-saint-gildas.jpg"
      alt="Commune de Saint-Gildas-de-Rhuys"
      :class="saintGildasClass"
      width="160"
      height="160"
    >
    <img
      src="/Morbihan_logo2022_Departement_JPG.jpg"
      alt="Conseil départemental du Morbihan"
      :class="morbihanClass"
      width="256"
      height="82"
    >
  </div>
</template>
