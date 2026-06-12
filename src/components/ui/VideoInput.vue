<template>
  <div class="space-y-3">
    <div class="flex gap-2">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        @click="setMode(tab.id)"
        class="px-3 py-1.5 rounded-lg border text-xs font-medium capitalize transition-all"
        :class="mode === tab.id ? 'bg-orange-500/25 border-orange-500/60 text-orange-200' : 'border-[#1e293b] text-gray-400 hover:text-white'"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="mode === 'upload'" class="space-y-2">
      <CloudinaryUpload accept="video/*" @uploaded="onUpload">
        <template #default="{ uploading }">
          <button type="button" class="px-4 py-2.5 bg-[#1e293b] hover:bg-[#2a2a4a] text-white text-sm font-medium rounded-xl border border-gray-700 transition-colors flex items-center gap-2 w-full justify-center">
            <span v-if="!uploading">⬆ Upload Video to Cloudinary</span>
            <span v-else>Uploading...</span>
          </button>
        </template>
      </CloudinaryUpload>
      <p v-if="modelValue && mode === 'upload'" class="text-xs text-gray-500 truncate">{{ modelValue }}</p>
    </div>

    <div v-else class="space-y-2">
      <input
        v-model="youtubeInput"
        type="url"
        class="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
        placeholder="https://youtube.com/watch?v=..."
        @blur="onYoutubeBlur"
      />
    </div>

    <div v-if="previewUrl" class="rounded-xl overflow-hidden aspect-video bg-black">
      <iframe
        v-if="youtubePreview"
        :src="youtubePreview"
        class="w-full h-full"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
      <video
        v-else-if="directPreview"
        :src="directPreview"
        class="w-full h-full object-cover"
        controls
        muted
        playsinline
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import CloudinaryUpload from './CloudinaryUpload.vue'
import { getVideoMode, getYouTubeEmbedUrl, isDirectVideoUrl } from '../../utils/video'

const props = defineProps({
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'change'])

const tabs = [
  { id: 'upload', label: 'Upload' },
  { id: 'youtube', label: 'YouTube URL' }
]

const mode = ref('upload')
const youtubeInput = ref('')

const syncModeFromValue = (url) => {
  const detected = getVideoMode(url)
  mode.value = detected === 'youtube' ? 'youtube' : 'upload'
  if (detected === 'youtube') {
    youtubeInput.value = url
  }
}

watch(() => props.modelValue, (url) => syncModeFromValue(url), { immediate: true })

const setMode = (nextMode) => {
  mode.value = nextMode
  if (nextMode === 'youtube') {
    youtubeInput.value = getVideoMode(props.modelValue) === 'youtube' ? props.modelValue : ''
  }
}

const emitValue = (url) => {
  emit('update:modelValue', url)
  emit('change', url)
}

const onUpload = (url) => {
  emitValue(url)
}

const onYoutubeBlur = () => {
  const url = youtubeInput.value.trim()
  if (url) emitValue(url)
}

const previewUrl = computed(() => props.modelValue || '')
const youtubePreview = computed(() => {
  if (getVideoMode(previewUrl.value) !== 'youtube') return null
  return getYouTubeEmbedUrl(previewUrl.value, { controls: true })
})
const directPreview = computed(() => {
  if (!isDirectVideoUrl(previewUrl.value)) return null
  return previewUrl.value
})
</script>
