<script setup lang="ts">
import type { ActiviteSlug, EditorialIconItem } from '~/utils/activites'

defineProps<{
  event: EditorialIconItem & { path: string, title?: string, description?: string, date?: string | Date }
  activite: ActiviteSlug
}>()
</script>

<template>
  <div class="space-y-4 not-prose">
    <USeparator />

    <h2 class="text-lg font-semibold text-highlighted">
      Prochain événement
    </h2>

    <EditorialListCard
      :item="event"
      link-label="En savoir plus"
      fallback-icon="i-lucide-calendar"
    />

    <UButton
      :to="{ path: '/evenements', query: { activite } }"
      variant="subtle"
      trailing-icon="i-lucide-arrow-right"
    >
      Voir tous les événements
    </UButton>
  </div>
</template>
