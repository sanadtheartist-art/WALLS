<template>
  <div class="mb-4 w-full">
    <div v-if="images.length" class="grid gap-2"
      :class="[`grid-cols-${block.data?.columns || 2}`, block.data?.gap === 'lg' ? 'gap-4' : block.data?.gap === 'sm' ? 'gap-1' : 'gap-2']">
      <img v-for="(img, i) in images" :key="i" :src="img"
        class="w-full aspect-square object-cover rounded-xl" loading="lazy" />
    </div>
    <div v-else class="aspect-video bg-[var(--color-surface)] border border-[var(--color-muted)] rounded-2xl flex items-center justify-center text-gray-500 text-sm">
      🖼 Add image URLs to build a gallery
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ block: { type: Object, required: true } })
const images = computed(() => props.block.data?.images ?? [])
</script>
