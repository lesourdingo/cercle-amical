<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import type { NavigationMenuItem } from '@nuxt/ui'
import { NAV_ORDER } from '~/utils/content-collections'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const route = useRoute()
const { header } = useAppConfig()

function isNavItemActive(path: string) {
  if (route.path === path) return true
  if (path === '/') return false
  return route.path.startsWith(`${path}/`)
}

const navItems = computed<NavigationMenuItem[]>(() => {
  if (!navigation?.value) return []
  return navigation.value
    .filter(item => NAV_ORDER.includes(item.path as (typeof NAV_ORDER)[number]))
    .map((item) => {
      const isActivites = item.path === '/activites'
      const isActive = isNavItemActive(item.path)

      const base = {
        label: item.title,
        icon: item.icon as string | undefined,
        to: item.path,
        active: isActive
      }

      if (!isActivites || !item.children?.length) {
        return base
      }

      return {
        ...base,
        type: 'trigger' as const,
        children: item.children.map(child => ({
          label: child.title,
          description: child.description as string | undefined,
          icon: child.icon as string | undefined,
          to: child.path,
          active: route.path === child.path
        }))
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
