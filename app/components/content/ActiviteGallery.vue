<script setup lang="ts">
import type { ActiviteGalleryImage } from '~/utils/media'

const props = defineProps<{
  images: ActiviteGalleryImage[]
  title?: string
}>()

const selectedIndex = ref<number | null>(null)

const selectedImage = computed(() =>
  selectedIndex.value === null ? null : props.images[selectedIndex.value]
)

const isOpen = computed({
  get: () => selectedIndex.value !== null,
  set: (open: boolean) => {
    if (!open) {
      selectedIndex.value = null
    }
  }
})

function openImage(index: number) {
  selectedIndex.value = index
}

function showPrevious() {
  if (selectedIndex.value === null || props.images.length <= 1) {
    return
  }
  selectedIndex.value = (selectedIndex.value - 1 + props.images.length) % props.images.length
}

function showNext() {
  if (selectedIndex.value === null || props.images.length <= 1) {
    return
  }
  selectedIndex.value = (selectedIndex.value + 1) % props.images.length
}
</script>

<template>
  <div
    v-if="images.length"
    class="space-y-4 not-prose"
  >
    <USeparator />

    <h2 class="text-lg font-semibold text-highlighted">
      Galerie photos
    </h2>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <button
        v-for="(image, index) in images"
        :key="image.pathname"
        type="button"
        class="group relative aspect-4/3 overflow-hidden rounded-lg bg-elevated ring-1 ring-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        @click="openImage(index)"
      >
        <NuxtImg
          :src="image.url"
          :alt="image.alt"
          class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          sizes="(max-width: 640px) 50vw, 240px"
        />
      </button>
    </div>

    <UModal
      v-model:open="isOpen"
      :title="title"
      :ui="{ content: 'max-w-5xl' }"
    >
      <template #body>
        <div
          v-if="selectedImage"
          class="relative"
        >
          <NuxtImg
            :src="selectedImage.url"
            :alt="selectedImage.alt"
            class="mx-auto max-h-[75vh] w-full object-contain"
            sizes="100vw"
          />

          <div
            v-if="images.length > 1"
            class="absolute inset-y-0 inset-x-0 flex items-center justify-between pointer-events-none px-2"
          >
            <UButton
              icon="i-lucide-chevron-left"
              color="neutral"
              variant="solid"
              class="pointer-events-auto"
              :aria-label="'Photo précédente'"
              @click="showPrevious"
            />
            <UButton
              icon="i-lucide-chevron-right"
              color="neutral"
              variant="solid"
              class="pointer-events-auto"
              :aria-label="'Photo suivante'"
              @click="showNext"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
