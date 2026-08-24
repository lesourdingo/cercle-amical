<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

type AlertTone = 'normal' | 'rouge'
type UiColor = 'primary' | 'error'

const props = defineProps<{
  title: string
  description?: string
  color?: AlertTone
  link?: {
    label: string
    to: string
  } | null
}>()

const uiColor = computed<UiColor>(() =>
  props.color === 'rouge' ? 'error' : 'primary'
)

const icon = computed(() =>
  uiColor.value === 'error' ? 'i-lucide-circle-alert' : 'i-lucide-info'
)

const actions = computed<ButtonProps[] | undefined>(() => {
  if (!props.link?.label || !props.link?.to) {
    return undefined
  }
  return [{
    label: props.link.label,
    to: props.link.to,
    color: uiColor.value,
    variant: 'solid',
    size: 'xs',
    trailingIcon: 'i-lucide-arrow-right'
  }]
})
</script>

<template>
  <UContainer class="pt-6 sm:pt-8">
    <UAlert
      :title="title"
      :description="description"
      :icon="icon"
      :color="uiColor"
      variant="subtle"
      orientation="horizontal"
      :actions="actions"
    />
  </UContainer>
</template>
