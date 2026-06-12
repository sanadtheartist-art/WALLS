<template>
  <div class="mb-4 w-full p-4 rounded-2xl"
    :class="blockClass">
    <div v-if="images.length" class="grid gap-2"
      :class="[`grid-cols-${block.data?.columns || 2}`, block.data?.gap === 'lg' ? 'gap-4' : block.data?.gap === 'sm' ? 'gap-1' : 'gap-2']">
      <img v-for="(img, i) in images" :key="i" :src="img"
        class="w-full aspect-square object-cover rounded-xl" loading="lazy" />
    </div>
    <div v-else class="aspect-video flex items-center justify-center text-gray-500 text-sm">
      🖼 Add image URLs to build a gallery
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { getBlockClass } from '../../../constants/design'

const props = defineProps({ 
  block: { type: Object, required: true },
  defaultStyle: { type: String, default: 'default' }
})
const images = computed(() => props.block.data?.images ?? [])
const blockClass = computed(() => getBlockClass(props.block.style, props.block, props.defaultStyle))
</script>
