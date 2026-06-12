<template>
  <a :href="block.data?.url" target="_blank" rel="noopener noreferrer"
    class="flex items-center justify-center gap-3 p-4 rounded-2xl mb-4 transition-all duration-300 group"
    :class="blockClass">
    <Icon :icon="platformIcon" class="w-6 h-6" :style="{ color: 'var(--color-text)' }" />
    <span class="font-semibold text-base" :style="{ color: 'var(--color-text)' }">{{ platformLabel }}</span>
    <span class="ml-auto text-[var(--color-muted)] group-hover:translate-x-1 transition-transform">↗</span>
  </a>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { getBlockClass } from '../../../constants/design'

const props = defineProps({ 
  block: { type: Object, required: true },
  defaultStyle: { type: String, default: 'default' }
})

const platforms = {
  twitter:   { icon: 'simple-icons:x', label: 'X (Twitter)' },
  instagram: { icon: 'simple-icons:instagram', label: 'Instagram' },
  linkedin:  { icon: 'simple-icons:linkedin', label: 'LinkedIn' },
  github:    { icon: 'simple-icons:github', label: 'GitHub' },
  youtube:   { icon: 'simple-icons:youtube', label: 'YouTube' },
  tiktok:    { icon: 'simple-icons:tiktok', label: 'TikTok' },
  discord:   { icon: 'simple-icons:discord', label: 'Discord' },
  twitch:    { icon: 'simple-icons:twitch', label: 'Twitch' },
  spotify:   { icon: 'simple-icons:spotify', label: 'Spotify' },
  facebook:  { icon: 'simple-icons:facebook', label: 'Facebook' },
  whatsapp:  { icon: 'simple-icons:whatsapp', label: 'WhatsApp' },
  snapchat:  { icon: 'simple-icons:snapchat', label: 'Snapchat' },
  reddit:    { icon: 'simple-icons:reddit', label: 'Reddit' },
  pinterest: { icon: 'simple-icons:pinterest', label: 'Pinterest' },
  soundcloud:{ icon: 'simple-icons:soundcloud', label: 'SoundCloud' },
  apple:     { icon: 'simple-icons:apple', label: 'Apple' },
}

const platformIcon = computed(() => platforms[props.block.data?.platform]?.icon ?? 'lucide:link')
const platformLabel = computed(() => platforms[props.block.data?.platform]?.label ?? props.block.data?.platform ?? 'Social')

const blockClass = computed(() => getBlockClass(props.block.style, props.block, props.defaultStyle))
</script>
