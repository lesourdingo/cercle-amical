<script setup lang="ts">
import type { ActiviteFilter } from '~/composables/useActivites'
import { ALL_ACTIVITES_FILTER } from '~/composables/useActivites'

const props = defineProps<{
  path: string
}>()

const route = useRoute()
const { filterOptions, matchesFilter, parseActiviteFilter } = useActivites()

const selectedActivite = ref<ActiviteFilter>(parseActiviteFilter(route.query.activite))

const isActualites = computed(() => props.path === '/actualites')
const isActivites = computed(() => props.path === '/activites')
const showActiviteFilter = computed(() => isActualites.value)

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
  if (!isActualites.value || !baseItems.value) return []
  const upcoming = baseItems.value.filter(item => isUpcomingByDate(item.date))
  return filterItems(sortActualitesByDate(upcoming))
})

const listItems = computed(() => {
  if (!baseItems.value?.length || isActualites.value) return []
  return filterItems(baseItems.value)
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
      v-if="isActualites"
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
          {{ isFiltered ? 'Aucune actualité à venir pour cette activité.' : 'Aucune actualité à venir pour le moment.' }}
        </p>
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
        fallback-icon="i-lucide-file-text"
      />

      <p
        v-if="!listItems?.length"
        class="text-muted"
      >
        Aucun contenu disponible.
      </p>
    </div>
  </div>
</template>
