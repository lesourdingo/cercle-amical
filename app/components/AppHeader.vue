<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import type { NavigationMenuItem } from '@nuxt/ui'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const route = useRoute()
const { header } = useAppConfig()

const navItems = computed<NavigationMenuItem[]>(() => {
  if (!navigation?.value) return []
  return navigation.value.map((item) => {
    const isActivites = item.path === '/activites'
    const hasChildren = isActivites && item.children && item.children.length > 0
    const isActive = route.path === item.path || route.path.startsWith(`${item.path}/`)

    return {
      label: item.title,
      icon: item.icon as string | undefined,
      to: item.path,
      active: isActive,
      children: hasChildren
        ? item.children?.map(child => ({
            label: child.title,
            description: child.description as string | undefined,
            icon: child.icon as string | undefined,
            to: child.path,
            active: route.path === child.path
          }))
        : undefined
    }
  })
})
</script>

<template>
  <UHeader
    :ui="{ center: 'flex-1' }"
    :to="header?.to || '/'"
  >
    <template
      v-if="header?.logo?.dark || header?.logo?.light || header?.title"
      #title
    >
      <UColorModeImage
        v-if="header?.logo?.dark || header?.logo?.light"
        :light="header?.logo?.light!"
        :dark="header?.logo?.dark!"
        :alt="header?.logo?.alt"
        class="h-6 w-auto shrink-0"
      />

      <span v-else-if="header?.title">
        {{ header.title }}
      </span>
    </template>

    <template
      v-else
      #left
    >
      <NuxtLink :to="header?.to || '/'">
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>
    </template>

    <UNavigationMenu
      :items="navItems"
      class="hidden lg:flex"
    />

    <template #right>
      <UColorModeButton v-if="header?.colorMode" />
    </template>

    <template #body>
      <UContentNavigation
        highlight
        :navigation="navigation"
      />
    </template>
  </UHeader>
</template>
