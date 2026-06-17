<script setup lang="ts">
import type { ActiviteFilter } from '~/composables/useActivites'
import { ALL_ACTIVITES_FILTER } from '~/composables/useActivites'

const props = defineProps<{
  path: string
}>()

const route = useRoute()
const { filterOptions, matchesFilter, parseActiviteFilter } = useActivites()

const showPastEvents = ref(false)
const selectedActivite = ref<ActiviteFilter>(parseActiviteFilter(route.query.activite))

const isEvenements = computed(() => props.path === '/evenements')
const isActualites = computed(() => props.path === '/actualites')
const isActivites = computed(() => props.path === '/activites')
const showActiviteFilter = computed(() => isEvenements.value || isActualites.value)

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

function filterItems<T extends { activite?: string, title?: string, description?: string }>(list: T[]): T[] {
  return list.filter(item => matchesFilter(item, selectedActivite.value))
}

const upcomingItems = computed(() => {
  if (!isEvenements.value || !baseItems.value) return []
  const upcoming = baseItems.value.filter(item => isUpcomingByDate(item.date))
  return filterItems(sortEvenementsByDate(upcoming))
})

const pastItems = computed(() => {
  if (!isEvenements.value || !baseItems.value) return []
  const past = baseItems.value.filter(item => isPastByDate(item.date))
  return filterItems(sortByDate(past, 'DESC'))
})

const listItems = computed(() => {
  if (!baseItems.value?.length || isEvenements.value) return []

  let result = baseItems.value
  if (dateOrder.value) {
    result = sortByDate(result, dateOrder.value)
  }

  return filterItems(result)
})

const isFiltered = computed(() => selectedActivite.value !== ALL_ACTIVITES_FILTER)

watch(() => route.query.activite, (value) => {
  selectedActivite.value = parseActiviteFilter(value)
})

watch(selectedActivite, (value) => {
  if (value === parseActiviteFilter(route.query.activite)) {
    return
  }

  const nextQuery = { ...route.query }

  if (value === ALL_ACTIVITES_FILTER) {
    delete nextQuery.activite
  } else {
    nextQuery.activite = value
  }

  navigateTo({ path: route.path, query: nextQuery }, { replace: true })
})
</script>

<template>
  <div class="space-y-6">
    <USelectMenu
      v-if="showActiviteFilter"
      v-model="selectedActivite"
      :items="filterOptions"
      value-key="value"
      label-key="label"
      placeholder="Filtrer par activité"
      :search-input="false"
      class="w-full sm:w-72"
    />

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
          {{ isFiltered ? 'Aucun événement à venir pour cette activité.' : 'Aucun événement à venir pour le moment.' }}
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
      v-else-if="isActivites"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <EditorialActiviteCard
        v-for="item in listItems"
        :key="item.path"
        :item="item"
      />

      <p
        v-if="!listItems?.length"
        class="text-muted col-span-full"
      >
        Aucune activité disponible.
      </p>
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
        {{ isFiltered ? 'Aucune actualité pour cette activité.' : 'Aucun contenu disponible.' }}
      </p>
    </div>
  </div>
</template>
