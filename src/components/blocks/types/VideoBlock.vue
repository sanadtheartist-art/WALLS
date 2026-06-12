<template>
  <div class="mb-4 rounded-2xl overflow-hidden w-full"
    :class="block.style === 'glass' ? 'border border-white/10' : 'border border-[var(--color-muted)]'">
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
import VideoPlayer from '../../ui/VideoPlayer.vue'

defineProps({ block: { type: Object, required: true } })
</script>
