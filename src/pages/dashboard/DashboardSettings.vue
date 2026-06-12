<template>
  <div class="p-6 max-w-2xl">
    <h2 class="text-3xl font-bold text-white mb-8">Settings</h2>
    
    <div class="bg-[#111827] border border-[#334155] rounded-2xl p-6 space-y-8">
      
      <!-- Public Toggle -->
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-bold text-white mb-1">Public Wall</h3>
          <p class="text-gray-400 text-sm">Allow anyone to view your wall.</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="formData.isPublic" @change="saveSettings" class="sr-only peer">
          <div class="w-14 h-7 bg-[#0B1120] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      <!-- SEO Settings -->
      <div class="pt-6 border-t border-[#334155]">
        <h3 class="text-xl font-bold text-white mb-4">SEO & Metadata</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Page Title</label>
            <input v-model="formData.seoTitle" type="text" class="w-full px-4 py-3 bg-[#0B1120] border border-[#334155] rounded-xl focus:outline-none focus:border-indigo-500 text-white" placeholder="John Doe - Links & Projects" @blur="saveSettings" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Meta Description</label>
            <textarea v-model="formData.seoDesc" rows="3" class="w-full px-4 py-3 bg-[#0B1120] border border-[#334155] rounded-xl focus:outline-none focus:border-indigo-500 text-white" placeholder="A brief description of who you are..." @blur="saveSettings"></textarea>
          </div>
        </div>
      </div>

      <!-- Custom Loading Screen -->
      <div class="pt-6 border-t border-[#334155]">
        <h3 class="text-xl font-bold text-white mb-1">Custom Loading Screen</h3>
        <p class="text-gray-400 text-sm mb-4">Text to display briefly before your wall loads.</p>
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Loading Text</label>
          <input v-model="formData.loadingText" type="text" class="w-full px-4 py-3 bg-[#0B1120] border border-[#334155] rounded-xl focus:outline-none focus:border-indigo-500 text-white" placeholder="e.g., JOHN DOE" @blur="saveSettings" />
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="pt-6 border-t border-[#334155]">
        <h3 class="text-xl font-bold text-red-500 mb-1">Danger Zone</h3>
        <p class="text-gray-400 text-sm mb-4">Irreversible actions for your account.</p>
        <button @click="deleteAccount" class="px-6 py-3 bg-red-500/10 text-red-500 font-semibold rounded-xl hover:bg-red-500/20 transition-colors border border-red-500/30">
          Delete Account
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const formData = ref({
  isPublic: true,
  seoTitle: '',
  seoDesc: '',
  loadingText: ''
})

onMounted(() => {
  if (authStore.user) {
    formData.value.isPublic = authStore.user.isPublic ?? true
    formData.value.seoTitle = authStore.user.seoTitle ?? ''
    formData.value.seoDesc = authStore.user.seoDesc ?? ''
    formData.value.loadingText = authStore.user.loadingText ?? ''
  }
})

const saveSettings = async () => {
  try {
    await authStore.updateSettings({
      isPublic: formData.value.isPublic,
      seoTitle: formData.value.seoTitle,
      seoDesc: formData.value.seoDesc,
      loadingText: formData.value.loadingText
    })
  } catch (error) {
    console.error('Error updating settings:', error)
  }
}

const deleteAccount = () => {
  if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
    alert('Account deletion will be handled here.')
    // TODO: Implement actual account deletion logic
  }
}
</script>
