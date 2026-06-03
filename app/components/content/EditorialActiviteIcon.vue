<script setup lang="ts">
import type { EditorialIconItem } from '~/utils/activites'

const props = defineProps<{
  item: EditorialIconItem
  fallbackIcon?: string
  size?: 'sm' | 'md'
}>()

const { getIcon } = useActivites()

const icon = computed(() => getIcon(props.item, props.fallbackIcon ?? 'i-lucide-calendar'))

const sizeClass = computed(() =>
  props.size === 'sm' ? 'size-4' : 'size-5'
)

const boxClass = computed(() =>
  props.size === 'sm' ? 'p-1.5' : 'p-2'
)
</script>

<template>
  <div
    class="flex items-center justify-center border border-default rounded-lg shrink-0 bg-elevated/50"
    :class="boxClass"
  >
    <UIcon
      :name="icon"
      :class="[sizeClass, 'text-primary']"
    />
  </div>
</template>
