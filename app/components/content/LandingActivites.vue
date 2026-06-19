<script setup lang="ts">
const { data: items } = await useAsyncData('landing-activites', () =>
  queryContentList('/activites')
)

const activites = computed(() =>
  items.value?.filter(item =>
    item.path !== '/activites'
    && !item.path.endsWith('/index')
    && !item.path.includes('.navigation')
  ) ?? []
)
</script>

<template>
  <UPageSection
    title="Découvrez nos activités"
    description="Le Cercle Amical propose une variété d'activités pour tous les goûts et tous les âges."
  >
    <template #body>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <EditorialActiviteCard
          v-for="item in activites"
          :key="item.path"
          :item="item"
        />
      </div>

      <div class="text-center">
        <UButton
          to="/activites"
          variant="subtle"
          trailing-icon="i-lucide-arrow-right"
        >
          Voir toutes les activités
        </UButton>
      </div>
    </template>
  </UPageSection>
</template>
