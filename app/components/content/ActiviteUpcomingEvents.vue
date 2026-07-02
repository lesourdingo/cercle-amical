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
      Prochaine actualité
    </h2>

    <EditorialListCard
      :item="event"
      link-label="En savoir plus"
      fallback-icon="i-lucide-calendar"
    />

    <UButton
      :to="{ path: '/actualites', query: { activite } }"
      variant="subtle"
      trailing-icon="i-lucide-arrow-right"
    >
      Voir toutes les actualités
    </UButton>
  </div>
</template>
