<script setup lang="ts">
const { data: events } = useAsyncData('landing-events', () =>
  queryCollection('evenements')
    .where('path', 'LIKE', '/evenements/%')
    .order('date', 'ASC')
    .all()
)

const filteredEvents = computed(() => {
  const upcoming = events.value?.filter((event) => {
    if (event.path.endsWith('/index') || event.path.includes('.navigation')) {
      return false
    }
    return isUpcomingByDate(event.date)
  })

  return upcoming ? sortEvenementsByDate(upcoming) : []
})

function formatDate(dateString: string | undefined): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
</script>

<template>
  <UPageSection
    title="Événements à venir"
  >
    <template #body>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <UCard
          v-for="event in filteredEvents?.slice(0, 3)"
          :key="event.path"
          variant="subtle"
        >
          <template #header>
            <div class="flex items-start gap-3">
              <EditorialActiviteIcon
                :item="event"
                fallback-icon="i-lucide-calendar"
                size="sm"
              />
              <div class="space-y-2 min-w-0 flex-1">
                <h3 class="text-lg font-semibold text-highlighted">
                  {{ event.title }}
                </h3>
              <p
                v-if="event.date"
                class="text-xs text-muted flex items-center gap-1.5"
              >
                <UIcon
                  name="i-lucide-calendar"
                  class="size-3.5"
                />
                {{ formatDate(event.date as string) }}
              </p>
              </div>
            </div>
          </template>

          <p
            v-if="event.description"
            class="text-muted text-sm"
          >
            {{ event.description }}
          </p>

          <template #footer>
            <ULink
              :to="event.path"
              class="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-1"
            >
              En savoir plus
              <UIcon name="i-lucide-arrow-right" />
            </ULink>
          </template>
        </UCard>
      </div>

      <div class="text-center">
        <UButton
          to="/evenements"
          variant="subtle"
          trailing-icon="i-lucide-arrow-right"
        >
          Voir tous les événements
        </UButton>
      </div>
    </template>
  </UPageSection>
</template>
