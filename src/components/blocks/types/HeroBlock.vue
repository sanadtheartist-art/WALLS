<template>
  <div class="relative w-full rounded-2xl overflow-hidden shadow-2xl mb-4 group min-h-[280px] sm:min-h-[320px] flex items-end isolate [mask-image:radial-gradient(white,black)]"
    :style="containerStyle">

    <VideoPlayer
      v-if="backgroundVideoUrl"
      :url="backgroundVideoUrl"
      autoplay
      loop
      muted
      cover
      background
    />

    <!-- Overlay -->
    <div class="absolute inset-0 z-10" :style="overlayStyle"></div>

    <!-- Content -->
    <div class="relative z-20 w-full p-6 sm:p-10" :class="alignClass">
      <h1 class="text-3xl sm:text-5xl font-bold text-white mb-3 leading-tight drop-shadow-lg">
        {{ block.data?.title || 'Welcome' }}
      </h1>
      <p class="text-gray-200 mb-6 text-base sm:text-lg drop-shadow">
        {{ block.data?.subtitle || 'Discover my world.' }}
      </p>
      <a v-if="block.data?.ctaUrl" :href="block.data.ctaUrl" target="_blank"
        class="inline-block px-7 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-xl shadow-black/30 text-sm sm:text-base">
        {{ block.data?.ctaLabel || 'Enter' }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VideoPlayer from '../../ui/VideoPlayer.vue'

const props = defineProps({ block: { type: Object, required: true } })

const backgroundVideoUrl = computed(() => {
  const d = props.block.data ?? {}
  if (d.bgType === 'video') return d.videoUrl || ''
  if (d.bgType === 'youtube') return d.youtubeUrl || ''
  return ''
})

const containerStyle = computed(() => {
  const d = props.block.data ?? {}

  if (d.bgType === 'gradient' || (!d.bgType && !d.imageUrl)) {
    const from = d.gradientFrom || '#7c3aed'
    const to   = d.gradientTo   || '#3b82f6'
    const dir  = d.gradientDir  || '135deg'
    return { background: `linear-gradient(${dir}, ${from}, ${to})` }
  }
  if (d.bgType === 'color') {
    return { background: d.solidColor || '#111827' }
  }
  if (d.bgType === 'video' || d.bgType === 'youtube') {
    return { background: '#000' }
  }
  if (d.imageUrl) {
    return {
      backgroundImage: `url(${d.imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return { background: 'linear-gradient(135deg, #7c3aed, #3b82f6)' }
})

const overlayStyle = computed(() => {
  const opacity = ((props.block.data?.overlayOpacity ?? 50) / 100)
  return { background: `rgba(0,0,0,${opacity})` }
})

const alignClass = computed(() => ({
  'text-left': (props.block.data?.align || 'center') === 'left',
  'text-center': (props.block.data?.align || 'center') === 'center',
  'text-right': (props.block.data?.align || 'center') === 'right',
}))
</script>
