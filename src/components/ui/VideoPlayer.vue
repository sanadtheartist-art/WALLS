<template>
  <iframe
    v-if="embedUrl"
    :src="embedUrl"
    :class="frameClass"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    :allowfullscreen="controls"
  />
  <video
    v-else-if="directUrl"
    :src="directUrl"
    :class="videoClass"
    :autoplay="autoplay"
    :loop="loop"
    :muted="muted"
    :controls="controls"
    playsinline
    :style="videoStyle"
  />
</template>

<script setup>
import { computed } from 'vue'
import { getYouTubeEmbedUrl, getYouTubeId, getVimeoEmbedUrl, isVimeoUrl, isDirectVideoUrl } from '../../utils/video'

const props = defineProps({
  url: { type: String, default: '' },
  autoplay: { type: Boolean, default: false },
  loop: { type: Boolean, default: false },
  muted: { type: Boolean, default: false },
  controls: { type: Boolean, default: false },
  cover: { type: Boolean, default: false },
  blur: { type: Number, default: 0 },
  background: { type: Boolean, default: false }
})

const embedUrl = computed(() => {
  if (!props.url) return null
  if (getYouTubeId(props.url)) {
    return getYouTubeEmbedUrl(props.url, {
      autoplay: props.autoplay,
      loop: props.loop,
      muted: props.muted,
      controls: props.controls
    })
  }
  if (isVimeoUrl(props.url)) return getVimeoEmbedUrl(props.url)
  return null
})

const directUrl = computed(() => (isDirectVideoUrl(props.url) ? props.url : null))

const frameClass = computed(() => {
  if (props.background) {
    return 'absolute inset-0 z-0 w-full h-full object-cover pointer-events-none scale-150 transform-origin-center'
  }
  return props.cover ? 'w-full h-full' : 'w-full h-full'
})

const videoClass = computed(() => {
  const base = props.cover ? 'w-full h-full object-cover' : 'w-full h-full'
  return props.background ? `absolute inset-0 z-0 ${base}` : base
})

const videoStyle = computed(() => {
  if (!props.blur) return undefined
  return {
    filter: `blur(${props.blur}px)`,
    transform: props.blur ? 'scale(1.1)' : undefined
  }
})
</script>
