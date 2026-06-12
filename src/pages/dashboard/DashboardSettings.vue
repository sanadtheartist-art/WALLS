<template>
  <div class="p-4 sm:p-6 max-w-2xl">
    <h2 class="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Settings</h2>
    
    <div class="bg-[#111827] border border-[#334155] rounded-2xl p-4 sm:p-6 space-y-6 sm:space-y-8">
      
      <!-- Public Toggle -->
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg sm:text-xl font-bold text-white mb-1">Public Wall</h3>
          <p class="text-gray-400 text-sm">Allow anyone to view your wall.</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="formData.isPublic" @change="saveSettings" class="sr-only peer">
          <div class="w-12 h-6 sm:w-14 sm:h-7 bg-[#0B1120] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 sm:after:h-6 sm:after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      <!-- SEO Settings -->
      <div class="pt-6 border-t border-[#334155]">
        <h3 class="text-lg sm:text-xl font-bold text-white mb-4">SEO & Metadata</h3>
        <div class="space-y-3 sm:space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-400 mb-2">Page Title</label>
            <input v-model="formData.seoTitle" type="text" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0B1120] border border-[#334155] rounded-xl focus:outline-none focus:border-indigo-500 text-white text-sm" placeholder="John Doe - Links & Projects" @blur="saveSettings" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-400 mb-2">Meta Description</label>
            <textarea v-model="formData.seoDesc" rows="3" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0B1120] border border-[#334155] rounded-xl focus:outline-none focus:border-indigo-500 text-white text-sm" placeholder="A brief description of who you are..." @blur="saveSettings"></textarea>
          </div>
        </div>
      </div>

      <!-- Custom Loading Screen -->
      <div class="pt-6 border-t border-[#334155]">
        <h3 class="text-lg sm:text-xl font-bold text-white mb-1">Custom Loading Screen</h3>
        <p class="text-gray-400 text-sm mb-4">Customize what users see before your wall loads.</p>
        <div class="space-y-3 sm:space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-400 mb-2">Loading Text</label>
            <input v-model="formData.loadingText" type="text" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0B1120] border border-[#334155] rounded-xl focus:outline-none focus:border-indigo-500 text-white text-sm" placeholder="e.g., JOHN DOE" @blur="saveSettings" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-400 mb-2">Background Color</label>
              <div class="flex gap-2">
                <input type="color" v-model="formData.loadingBgColor" @input="saveSettings" class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-[#334155] cursor-pointer p-0.5 bg-transparent" />
                <input v-model="formData.loadingBgColor" type="text" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0B1120] border border-[#334155] rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500" placeholder="#000000" @blur="saveSettings" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-400 mb-2">Text Color</label>
              <div class="flex gap-2">
                <input type="color" v-model="formData.loadingTextColor" @input="saveSettings" class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-[#334155] cursor-pointer p-0.5 bg-transparent" />
                <input v-model="formData.loadingTextColor" type="text" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0B1120] border border-[#334155] rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500" placeholder="#ffffff" @blur="saveSettings" />
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-400 mb-2">Text Size</label>
            <select v-model="formData.loadingTextSize" @change="saveSettings" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0B1120] border border-[#334155] rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500">
              <option value="text-lg">Large</option>
              <option value="text-xl">Extra Large</option>
              <option value="text-2xl">2X Large</option>
              <option value="text-3xl">3X Large</option>
              <option value="text-4xl">4X Large</option>
              <option value="text-5xl">5X Large</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-400 mb-2">Animation</label>
            <select v-model="formData.loadingAnimation" @change="saveSettings" class="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0B1120] border border-[#334155] rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500">
              <option value="animate-pulse">Pulse</option>
              <option value="animate-bounce">Bounce</option>
              <option value="animate-spin">Spin</option>
              <option value="animate-ping">Ping</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="pt-6 border-t border-[#334155]">
        <h3 class="text-lg sm:text-xl font-bold text-red-500 mb-1">Danger Zone</h3>
        <p class="text-gray-400 text-sm mb-4">Irreversible actions for your account.</p>
        <button @click="deleteAccount" :disabled="deleting" class="px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500/10 text-red-500 font-semibold rounded-xl hover:bg-red-500/20 transition-colors border border-red-500/30 disabled:opacity-50 text-sm">
          {{ deleting ? 'Deleting...' : 'Delete Account' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { supabase } from '../../config/supabase'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const deleting = ref(false)

const formData = ref({
  isPublic: true,
  seoTitle: '',
  seoDesc: '',
  loadingText: '',
  loadingBgColor: '#000000',
  loadingTextColor: '#ffffff',
  loadingTextSize: 'text-3xl',
  loadingAnimation: 'animate-pulse'
})

onMounted(() => {
  if (authStore.user) {
    formData.value.isPublic = authStore.user.is_public ?? authStore.user.isPublic ?? true
    formData.value.seoTitle = authStore.user.seo_title ?? authStore.user.seoTitle ?? ''
    formData.value.seoDesc = authStore.user.seo_desc ?? authStore.user.seoDesc ?? ''
    formData.value.loadingText = authStore.user.loading_text ?? authStore.user.loadingText ?? ''
    formData.value.loadingBgColor = authStore.user.loading_bg_color ?? authStore.user.loadingBgColor ?? '#000000'
    formData.value.loadingTextColor = authStore.user.loading_text_color ?? authStore.user.loadingTextColor ?? '#ffffff'
    formData.value.loadingTextSize = authStore.user.loading_text_size ?? authStore.user.loadingTextSize ?? 'text-3xl'
    formData.value.loadingAnimation = authStore.user.loading_animation ?? authStore.user.loadingAnimation ?? 'animate-pulse'
  }
})

const saveSettings = async () => {
  try {
    await authStore.updateSettings({
      isPublic: formData.value.isPublic,
      seoTitle: formData.value.seoTitle,
      seoDesc: formData.value.seoDesc,
      loadingText: formData.value.loadingText,
      loadingBgColor: formData.value.loadingBgColor,
      loadingTextColor: formData.value.loadingTextColor,
      loadingTextSize: formData.value.loadingTextSize,
      loadingAnimation: formData.value.loadingAnimation
    })
  } catch (error) {
    console.error('Error updating settings:', error)
  }
}

const deleteAccount = async () => {
  if (!confirm('Are you absolutely sure you want to delete your account? This action cannot be undone and will delete all your data.')) return
  
  if (!confirm('Click OK to confirm account deletion. This is irreversible!')) return
  
  deleting.value = true
  try {
    if (!authStore.user) throw new Error('No user logged in')
    
    const userId = authStore.user.id
    const username = authStore.user.username
    
    // 1. Delete blocks
    await supabase.from('blocks').delete().eq('user_id', userId)
    // 2. Delete username
    await supabase.from('usernames').delete().eq('user_id', userId)
    // 3. Delete profile
    await supabase.from('profiles').delete().eq('id', userId)
    // 4. Delete analytics events
    await supabase.from('analytics_events').delete().eq('user_id', userId)
    
    // Log out and redirect
    await authStore.logOut()
    router.push('/')
  } catch (error) {
    console.error('Error deleting account:', error)
    alert(`Error deleting account: ${error.message}`)
  } finally {
    deleting.value = false
  }
}
</script>