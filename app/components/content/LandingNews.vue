<script setup lang="ts">
const { data: news } = useAsyncData('landing-news', () =>
  queryCollection('docs')
    .where('path', 'LIKE', '/actualites/%')
    .all()
)

const filteredNews = computed(() => {
  if (!news.value) return []

  return [...news.value]
    .filter(article =>
      !article.path.endsWith('/index')
      && !article.path.includes('.navigation')
    )
    .sort((a, b) => {
      const aDate = a.date ? new Date(a.date as string).getTime() : 0
      const bDate = b.date ? new Date(b.date as string).getTime() : 0
      return bDate - aDate
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
    title="Dernières Actualités"
  >
    <template #body>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <UCard
          v-for="article in filteredNews?.slice(0, 3)"
          :key="article.path"
          variant="subtle"
        >
          <template #header>
            <div class="space-y-2">
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
                {{ formatDate(article.date as string) }}
              </p>
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
              Lire la suite
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
