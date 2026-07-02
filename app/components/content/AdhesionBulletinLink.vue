<script setup lang="ts">
const { data: bulletin } = useAdhesionBulletin()
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
