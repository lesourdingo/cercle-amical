<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const filteredNavigation = computed(() => {
  if (!navigation?.value) return []
  const noChildrenPaths = ['/actualites', '/evenements', '/informations']
  return navigation.value.map((item) => {
    if (noChildrenPaths.includes(item.path)) {
      return { ...item, children: undefined }
    }
    return item
  })
})
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UPageAside>
          <UContentNavigation
            highlight
            :navigation="filteredNavigation"
          />
        </UPageAside>
      </template>

      <slot />
    </UPage>
  </UContainer>
</template>
