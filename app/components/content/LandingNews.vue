<script setup lang="ts">
const { actualitesEnabled } = useSiteFeatures()

const { data: news } = await useAsyncData('landing-news', () => {
  if (!actualitesEnabled) {
    return Promise.resolve([])
  }

  return queryCollection('actualites')
    .where('path', 'LIKE', '/actualites/%')
    .where('date', '>=', getTodayLocalISO())
    .select('path', 'title', 'description', 'date', 'activite')
    .order('date', 'ASC')
    .limit(3)
    .all()
})

const filteredNews = computed(() => {
  const upcoming = news.value?.filter(article =>
    !article.path.endsWith('/index')
    && !article.path.includes('.navigation')
    && isUpcomingByDate(article.date)
  )

  return upcoming ? sortActualitesByDate(upcoming) : []
})

function formatDate(dateValue: string | Date | undefined): string {
  if (!dateValue) return ''
  const date = new Date(dateValue)
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
    v-if="actualitesEnabled"
    title="Actualités à venir"
  >
    <template #body>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <UCard
          v-for="article in filteredNews"
          :key="article.path"
          variant="subtle"
        >
          <template #header>
            <div class="flex items-start gap-3">
              <EditorialActiviteIcon
                :item="article"
                fallback-icon="i-lucide-calendar"
                size="sm"
              />
              <div class="space-y-2 min-w-0 flex-1">
                <h3 class="text-lg font-semibold text-highlighted">
                  {{ article.title }}
                </h3>
                <p
                  v-if="article.date"
                  class="text-xs text-muted flex items-center gap-1.5"
                >
                  <UIcon
                    name="i-lucide-calendar"
                    class="size-3.5"
                  />
                  {{ formatDate(article.date) }}
                </p>
              </div>
            </div>
          </template>

          <p
            v-if="article.description"
            class="text-muted text-sm"
          >
            {{ article.description }}
          </p>

          <template #footer>
            <ULink
              :to="article.path"
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
          to="/actualites"
          variant="subtle"
          trailing-icon="i-lucide-arrow-right"
        >
          Voir toutes les actualités
        </UButton>
      </div>
    </template>
  </UPageSection>
</template>
