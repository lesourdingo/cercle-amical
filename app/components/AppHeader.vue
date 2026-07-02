<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import type { NavigationMenuItem } from '@nuxt/ui'
import { getNavOrder } from '~/utils/content-collections'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const route = useRoute()
const { header } = useAppConfig()
const { actualitesEnabled } = useSiteFeatures()

const navOrder = computed(() => getNavOrder(actualitesEnabled))

function isNavItemActive(path: string) {
  if (route.path === path) return true
  if (path === '/') return false
  return route.path.startsWith(`${path}/`)
}

const navItems = computed<NavigationMenuItem[]>(() => {
  if (!navigation?.value) return []
  return navigation.value
    .filter(item => navOrder.value.includes(item.path))
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
      <div
        v-if="header?.logo?.dark || header?.logo?.light"
        class="flex items-center gap-2.5"
      >
        <img
          :src="header?.logo?.light || header?.logo?.dark"
          alt=""
          aria-hidden="true"
          class="h-10 w-auto shrink-0"
          width="40"
          height="40"
        />
        <span
          v-if="header?.title"
          class="font-semibold text-highlighted"
        >
          {{ header.title }}
        </span>
      </div>

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


    <template #body>
      <UContentNavigation
        highlight
        :navigation="navigation"
      />
    </template>
  </UHeader>
</template>
