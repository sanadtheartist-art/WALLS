<template>
  <div>
    <!-- Hidden File Input -->
    <input type="file" ref="fileInput" :accept="accept" class="hidden" @change="onFileSelect" />
    
    <!-- Upload Button or slot -->
    <div @click="$refs.fileInput.click()" class="cursor-pointer" :class="{ 'opacity-50 pointer-events-none': uploading }">
      <slot :uploading="uploading">
        <button type="button" class="px-4 py-2 bg-[#1e293b] hover:bg-[#2a2a4a] text-white text-sm font-medium rounded-lg border border-gray-700 transition-colors flex items-center gap-2 w-full justify-center">
          <svg v-if="!uploading" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          <svg v-else class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ uploading ? 'Uploading...' : 'Upload Media' }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  accept: { type: String, default: 'image/*,video/*' },
})

const emit = defineEmits(['uploaded', 'error'])

const fileInput = ref(null)
const uploading = ref(false)

const onFileSelect = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  e.target.value = '' // reset

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    alert('Cloudinary configuration missing in .env')
    return
  }

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)

    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|ogg)$/i.test(file.name)
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${isVideo ? 'video' : 'image'}/upload`

    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData
    })
    
    const data = await res.json()
    if (data.secure_url) {
      emit('uploaded', data.secure_url)
    } else {
      throw new Error(data.error?.message || 'Upload failed')
    }
  } catch (err) {
    console.error('Cloudinary upload error:', err)
    emit('error', err.message)
    alert('Upload failed: ' + err.message)
  } finally {
    uploading.value = false
  }
}
</script>
