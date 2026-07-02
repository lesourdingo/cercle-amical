<script setup lang="ts">
import type { FooterColumn } from '@nuxt/ui'

const { footer, header } = useAppConfig()
const { actualitesEnabled } = useSiteFeatures()

const columns = computed((): FooterColumn[] => {
  if (!footer.columns?.length) {
    return []
  }

  return footer.columns.map((column) => {
    if (column.label !== 'Navigation') {
      return column
    }

    return {
      ...column,
      children: column.children?.filter(link =>
        actualitesEnabled || link.to !== '/actualites'
      )
    }
  })
})
</script>

<template>
  <UFooter>
    <template
      v-if="columns.length"
      #top
    >
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #left>
            <div class="flex flex-col gap-3 max-w-xs">
              <NuxtLink
                :to="header?.to || '/'"
                class="block font-semibold text-highlighted hover:text-primary transition-colors"
              >
                {{ header?.title || 'Cercle Amical' }}
              </NuxtLink>
              <p
                v-if="footer.tagline"
                class="text-sm text-muted"
              >
                {{ footer.tagline }}
              </p>
            </div>
          </template>
        </UFooterColumns>

        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-muted mt-8 pt-8 border-t border-default">
          <p>{{ footer.credits }}</p>
          <p v-if="footer.madeBy">
            Réalisé par
            <ULink
              :to="footer.madeBy.to"
              target="_blank"
              class="text-default hover:text-primary transition-colors"
            >
              {{ footer.madeBy.name }}
            </ULink>
          </p>
        </div>
      </UContainer>
    </template>
  </UFooter>
</template>
