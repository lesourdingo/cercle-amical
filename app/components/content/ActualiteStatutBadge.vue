<script setup lang="ts">
const props = withDefaults(defineProps<{
  statut?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  size: 'sm'
})

const badge = computed(() => getActualiteStatutBadge(props.statut))
</script>

<template>
  <UBadge
    v-if="badge"
    :label="badge.label"
    :color="badge.color"
    :icon="badge.icon"
    :size="size"
    variant="solid"
    class="align-middle"
  />
</template>
