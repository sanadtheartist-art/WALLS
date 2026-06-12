<template>
  <div class="mb-4 rounded-2xl overflow-hidden w-full"
    :class="blockClass">
    <div v-if="block.data?.url" class="aspect-video bg-black">
      <VideoPlayer :url="block.data.url" controls />
    </div>
    <div v-else class="aspect-video bg-[var(--color-surface)] flex items-center justify-center text-gray-500 text-sm">
      🎥 Upload a video or add a YouTube URL
    </div>
    <p v-if="block.data?.caption" class="text-gray-400 text-xs text-center py-2 px-3">{{ block.data.caption }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VideoPlayer from '../../ui/VideoPlayer.vue'
import { getBlockClass } from '../../../constants/design'

const props = defineProps({ 
  block: { type: Object, required: true },
  defaultStyle: { type: String, default: 'default' }
})
const blockClass = computed(() => getBlockClass(props.block.style, props.block, props.defaultStyle))
</script>
