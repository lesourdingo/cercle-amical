<script setup lang="ts">
const props = defineProps<{
  path: string
}>()

const { data: items } = await useAsyncData(`content-list-${props.path}`, () =>
  queryCollection('docs')
    .where('path', 'LIKE', `${props.path}/%`)
    .all()
)

const filteredItems = computed(() => {
  const filtered = items.value?.filter(item =>
    item.path !== props.path
    && !item.path.endsWith('/index')
    && !item.path.includes('.navigation')
  )

  // Sort by date if items have dates (for events)
  if (filtered && filtered.some(item => item.date)) {
    return [...filtered].sort((a, b) => {
      const aDate = a.date ? new Date(a.date as string).getTime() : 0
      const bDate = b.date ? new Date(b.date as string).getTime() : 0
      return aDate - bDate // Sort ascending (earliest first)
    })
  }

  return filtered
})
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="item in filteredItems"
      :key="item.path"
      class="border border-default rounded-lg p-4 hover:bg-elevated transition-colors"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-highlighted">
            {{ item.title }}
          </h3>
          <p
            v-if="item.description"
            class="text-muted mt-1 text-sm"
          >
            {{ item.description }}
          </p>
        </div>
        <p
          v-if="item.date"
          class="text-muted text-xs whitespace-nowrap"
        >
          {{ new Date(item.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) }}
        </p>
      </div>
      <NuxtLink
        :to="item.path"
        class="text-primary hover:text-primary/80 transition-colors text-sm font-medium flex items-center gap-1 mt-3"
      >
        Lire la suite
        <UIcon name="i-lucide-arrow-right" />
      </NuxtLink>
    </div>
    <p
      v-if="!filteredItems?.length"
      class="text-muted"
    >
      Aucun contenu disponible.
    </p>
  </div>
</template>
