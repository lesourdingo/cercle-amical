<script setup lang="ts">
const { data: events } = useAsyncData('landing-events', () =>
  queryCollection('docs')
    .where('path', 'LIKE', '/evenements/%')
    .all()
)

const filteredEvents = computed(() => {
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  return events.value?.filter((event) => {
    if (event.path.endsWith('/index') || event.path.includes('.navigation')) {
      return false
    }

    if (!event.date) {
      return false
    }

    const eventDate = new Date(event.date as string)
    if (Number.isNaN(eventDate.getTime())) {
      return false
    }

    return eventDate >= startOfToday
  })
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
            <div class="space-y-2">
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
