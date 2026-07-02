<script setup lang="ts">
import type { BulletinPdf } from '~/utils/media'

const { data: bulletin } = await useAsyncData('bulletin-adhesion', async () => {
  try {
    return await $fetch<BulletinPdf | null>('/api/bulletin-adhesion')
  } catch {
    return null
  }
}, {
  default: () => null
})
</script>

<template>
  <a
    v-if="bulletin"
    :href="bulletin.url"
    target="_blank"
    rel="noopener noreferrer"
    class="text-primary font-medium hover:underline"
  >
    bulletin d'adhésion
  </a>
  <span
    v-else
    class="text-muted"
  >
    bulletin d'adhésion
  </span>
</template>
