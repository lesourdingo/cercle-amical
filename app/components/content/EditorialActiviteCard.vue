<script setup lang="ts">
import type { EditorialIconItem } from '~/utils/activites'

defineProps<{
  item: EditorialIconItem & { path: string, title?: string, image?: string }
}>()
</script>

<template>
  <NuxtLink
    :to="item.path"
    class="block group h-full"
  >
    <UCard
      variant="subtle"
      class="overflow-hidden h-full transition-colors hover:bg-elevated"
      :ui="{ body: 'p-0 sm:p-0' }"
    >
      <div class="aspect-16/10 overflow-hidden relative bg-elevated">
        <NuxtImg
          v-if="item.image"
          :src="item.image"
          :alt="item.title ?? ''"
          class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div
          v-else
          class="size-full flex items-center justify-center bg-linear-to-br from-primary/10 to-primary/5"
        >
          <EditorialActiviteIcon
            :item="item"
            fallback-icon="i-lucide-calendar-clock"
          />
        </div>
      </div>

      <div class="p-4 space-y-2">
        <h3 class="text-lg font-semibold text-highlighted group-hover:text-primary transition-colors">
          {{ item.title }}
        </h3>
        <span class="text-primary text-sm font-medium inline-flex items-center gap-1 pt-1">
          En savoir plus
          <UIcon
            name="i-lucide-arrow-right"
            class="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </UCard>
  </NuxtLink>
</template>
