<script setup lang="ts">
const props = defineProps<{
  path: string
}>()

const showPastEvents = ref(false)

const isEvenements = computed(() => props.path === '/evenements')
const isActualites = computed(() => props.path === '/actualites')

const listFallbackIcon = computed(() =>
  isActualites.value ? 'i-lucide-newspaper' : 'i-lucide-calendar'
)

const dateOrder = computed(() => {
  if (props.path === '/evenements') return 'ASC' as const
  if (props.path === '/actualites') return 'DESC' as const
  return undefined
})

const { data: items } = await useAsyncData(`content-list-${props.path}`, () =>
  queryContentList(props.path)
)

const baseItems = computed(() =>
  items.value?.filter(item =>
    item.path !== props.path
    && !item.path.endsWith('/index')
    && !item.path.includes('.navigation')
  )
)

const upcomingItems = computed(() => {
  if (!isEvenements.value || !baseItems.value) return []
  const upcoming = baseItems.value.filter(item => isUpcomingByDate(item.date))
  return sortEvenementsByDate(upcoming)
})

const pastItems = computed(() => {
  if (!isEvenements.value || !baseItems.value) return []
  const past = baseItems.value.filter(item => isPastByDate(item.date))
  return sortByDate(past, 'DESC')
})

const listItems = computed(() => {
  if (!baseItems.value?.length || isEvenements.value) return []

  if (dateOrder.value) {
    return sortByDate(baseItems.value, dateOrder.value)
  }

  return baseItems.value
})
</script>

<template>
  <div
    v-if="isEvenements"
    class="space-y-6"
  >
    <div class="space-y-4">
      <EditorialListCard
        v-for="item in upcomingItems"
        :key="item.path"
        :item="item"
        link-label="En savoir plus"
        fallback-icon="i-lucide-calendar"
      />

      <p
        v-if="!upcomingItems.length"
        class="text-muted"
      >
        Aucun événement à venir pour le moment.
      </p>
    </div>

    <div
      v-if="pastItems.length"
      class="flex justify-center"
    >
      <UButton
        variant="subtle"
        :trailing-icon="showPastEvents ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
        @click="showPastEvents = !showPastEvents"
      >
        {{ showPastEvents ? 'Masquer les événements passés' : 'Voir les événements passés' }}
      </UButton>
    </div>

    <div
      v-if="showPastEvents && pastItems.length"
      class="space-y-4"
    >
      <h2 class="text-lg font-semibold text-highlighted">
        Événements passés
      </h2>

      <EditorialListCard
        v-for="item in pastItems"
        :key="item.path"
        :item="item"
        link-label="En savoir plus"
        fallback-icon="i-lucide-calendar"
        muted
      />
    </div>
  </div>

  <div
    v-else
    class="space-y-4"
  >
    <EditorialListCard
      v-for="item in listItems"
      :key="item.path"
      :item="item"
      :fallback-icon="listFallbackIcon"
    />

    <p
      v-if="!listItems?.length"
      class="text-muted"
    >
      Aucun contenu disponible.
    </p>
  </div>
</template>
