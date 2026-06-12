<template>
  <div>
    <!-- Trigger -->
    <div @click="$refs.fileInput.click()" class="cursor-pointer group relative">
      <slot>
        <div class="w-24 h-24 rounded-full bg-[#1e293b] border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden hover:border-orange-500 transition-colors">
          <img v-if="currentAvatar" :src="currentAvatar" class="w-full h-full object-cover" />
          <span v-else class="text-3xl text-gray-500 group-hover:text-orange-500">+</span>
        </div>
      </slot>
    </div>
    <input type="file" ref="fileInput" accept="image/*" class="hidden" @change="onFileSelect" />

    <!-- Cropper Modal -->
    <div v-if="showModal" class="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-[#0B1120] border border-[#1e293b] rounded-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div class="p-4 border-b border-[#1e293b] flex items-center justify-between">
          <h3 class="text-lg font-bold text-white">Crop Avatar</h3>
          <button @click="closeModal" class="text-gray-500 hover:text-white">✕</button>
        </div>
        
        <div class="p-4 bg-black flex-1 min-h-[300px] relative">
          <img ref="imageRef" :src="imageUrl" class="max-w-full block" />
        </div>

        <div class="p-4 border-t border-[#1e293b] flex gap-3">
          <button @click="closeModal" class="flex-1 py-2.5 bg-transparent border border-[#1e293b] text-white rounded-xl hover:bg-[#1e293b] transition-colors">Cancel</button>
          <button @click="saveCrop" :disabled="uploading" class="flex-1 py-2.5 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-500 disabled:opacity-50 transition-colors">
            {{ uploading ? 'Saving...' : 'Save Avatar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onBeforeUnmount } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const props = defineProps({
  currentAvatar: String
})

const emit = defineEmits(['cropped'])

const fileInput = ref(null)
const imageRef = ref(null)
const showModal = ref(false)
const imageUrl = ref('')
const uploading = ref(false)
let cropper = null

const onFileSelect = (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value)
  }
  imageUrl.value = URL.createObjectURL(file)
  showModal.value = true
  e.target.value = '' // reset

  nextTick(() => {
    initCropper()
  })
}

const initCropper = () => {
  if (cropper) {
    cropper.destroy()
  }
  cropper = new Cropper(imageRef.value, {
    aspectRatio: 1,
    viewMode: 1,
    dragMode: 'move',
    autoCropArea: 1,
    restore: false,
    guides: false,
    center: false,
    highlight: false,
    cropBoxMovable: false,
    cropBoxResizable: false,
    toggleDragModeOnDblclick: false,
    background: false
  })
}

const closeModal = () => {
  showModal.value = false
  if (cropper) {
    cropper.destroy()
    cropper = null
  }
}

// Compress to < 100kb
const getCompressedBlob = (canvas, quality = 0.9) => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    }, 'image/jpeg', quality)
  })
}

const compressCanvas = async (canvas) => {
  let quality = 0.9
  let blob = await getCompressedBlob(canvas, quality)
  
  // 100kb = 100 * 1024 bytes
  while (blob.size > 100 * 1024 && quality > 0.1) {
    quality -= 0.1
    blob = await getCompressedBlob(canvas, quality)
  }
  return blob
}

const saveCrop = async () => {
  if (!cropper) return
  uploading.value = true
  
  try {
    // Get cropped canvas at reasonable size
    const canvas = cropper.getCroppedCanvas({
      width: 400,
      height: 400,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    })

    const blob = await compressCanvas(canvas)
    
    // Convert blob to DataURL for immediate preview, or upload to Cloudinary directly
    // Since we want Cloudinary, let's use the unsigned preset
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      // Fallback: return dataURL
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = () => {
        emit('cropped', reader.result)
        closeModal()
        uploading.value = false
      }
      return
    }

    // Cloudinary Upload
    const formData = new FormData()
    formData.append('file', blob)
    formData.append('upload_preset', uploadPreset)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    if (data.secure_url) {
      emit('cropped', data.secure_url)
    } else {
      throw new Error(data.error?.message || 'Upload failed')
    }
    closeModal()
  } catch (err) {
    console.error('Cropper upload error:', err)
    alert('Failed to upload avatar: ' + err.message)
  } finally {
    uploading.value = false
  }
}

onBeforeUnmount(() => {
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
  if (cropper) cropper.destroy()
})
</script>
