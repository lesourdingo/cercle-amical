<script setup lang="ts">
import type { EditorialIconItem } from '~/utils/activites'

defineProps<{
  item: EditorialIconItem & { path: string, title?: string, description?: string, date?: string | Date }
  linkLabel?: string
  fallbackIcon?: string
  muted?: boolean
}>()

function formatDate(date: string | Date | undefined): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div
    class="border border-default rounded-lg p-4 hover:bg-elevated transition-colors"
    :class="{ 'opacity-90': muted }"
  >
    <div class="flex items-start gap-4">
      <EditorialActiviteIcon
        :item="item"
        :fallback-icon="fallbackIcon"
      />
      <div class="flex flex-1 items-start justify-between gap-4 min-w-0">
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-highlighted">
            {{ item.title }}
          </h3>
          <p
            v-if="item.description"
            class="text-muted mt-1 text-sm"
          >
            {{ item.description }}
          </p>
        </div>
        <p
          v-if="item.date"
          class="text-muted text-xs whitespace-nowrap shrink-0"
        >
          {{ formatDate(item.date) }}
        </p>
      </div>
    </div>
    <NuxtLink
      :to="item.path"
      class="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-1 mt-3 ml-[52px]"
    >
      {{ linkLabel ?? 'Lire la suite' }}
      <UIcon name="i-lucide-arrow-right" />
    </NuxtLink>
  </div>
</template>
