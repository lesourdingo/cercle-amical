<script setup lang="ts">
function pdfFilename(url: string): string {
  const segment = url.split('/').pop() ?? 'bulletin.pdf'
  return decodeURIComponent(segment)
}

const { data: bulletins, pending } = useBulletinList()
</script>

<template>
  <div class="not-prose space-y-4">
    <div
      v-for="bulletin in bulletins"
      :key="bulletin.pathname"
      class="border border-default rounded-lg p-4 sm:p-5 hover:bg-elevated transition-colors"
    >
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div class="flex items-start gap-4 min-w-0">
          <div class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UIcon
              name="i-lucide-file-text"
              class="size-5"
            />
          </div>
          <div class="min-w-0">
            <h3 class="text-lg font-semibold text-highlighted">
              {{ bulletin.title }}
            </h3>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 sm:shrink-0">
          <UButton
            :to="bulletin.url"
            target="_blank"
            icon="i-lucide-external-link"
            label="Consulter"
          />
          <UButton
            :to="bulletin.url"
            :download="pdfFilename(bulletin.url)"
            icon="i-lucide-download"
            label="Télécharger"
            color="neutral"
            variant="outline"
          />
        </div>
      </div>
    </div>

    <p
      v-if="pending"
      class="text-muted"
    >
      Chargement des bulletins…
    </p>

    <p
      v-else-if="!bulletins?.length"
      class="text-muted"
    >
      Aucun bulletin disponible pour le moment.
    </p>
  </div>
</template>
