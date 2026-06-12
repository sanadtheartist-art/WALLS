<template>
  <div class="p-6 max-w-2xl">
    <h2 class="text-3xl font-bold text-white mb-8">Profile Details</h2>
    
    <form @submit.prevent="saveProfile" class="space-y-6">
      <div class="bg-[#111827] border border-[#334155] rounded-2xl p-6">
        
        <div class="mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <AvatarCropper @cropped="url => formData.avatarUrl = url" :currentAvatar="formData.avatarUrl">
            <div class="w-24 h-24 rounded-full bg-[#0B1120] flex items-center justify-center border-4 border-[#334155] text-3xl font-bold text-gray-500 overflow-hidden hover:border-orange-500 transition-colors group cursor-pointer relative">
              <img v-if="formData.avatarUrl" :src="formData.avatarUrl" class="w-full h-full object-cover" />
              <span v-else>{{ formData.displayName?.charAt(0) || '?' }}</span>
              <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="text-xs text-white">Edit</span>
              </div>
            </div>
          </AvatarCropper>
          <div class="flex-1 w-full">
            <label class="block text-sm font-medium text-gray-400 mb-2">Avatar URL (Optional)</label>
            <input v-model="formData.avatarUrl" type="url" placeholder="Or paste a URL here..." class="w-full px-4 py-3 bg-[#0B1120] border border-[#334155] rounded-xl focus:outline-none focus:border-indigo-500 text-white" />
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
          <input v-model="formData.displayName" type="text" class="w-full px-4 py-3 bg-[#0B1120] border border-[#334155] rounded-xl focus:outline-none focus:border-indigo-500 text-white" required />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-400 mb-2">Username <span class="text-xs text-gray-500 font-normal">(Wall URL)</span></label>
          <div class="flex">
            <span class="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-[#334155] bg-[#111827] text-gray-500 sm:text-sm">
              walls.app/
            </span>
            <input v-model="formData.username" type="text" class="flex-1 w-full px-4 py-3 bg-[#0B1120] border border-[#334155] rounded-none rounded-r-xl focus:outline-none focus:border-indigo-500 text-white" required />
          </div>
          <p v-if="usernameError" class="mt-2 text-sm text-red-500">{{ usernameError }}</p>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-400 mb-2">Bio</label>
          <textarea v-model="formData.bio" rows="4" class="w-full px-4 py-3 bg-[#0B1120] border border-[#334155] rounded-xl focus:outline-none focus:border-indigo-500 text-white" placeholder="Tell the world about yourself..."></textarea>
        </div>

      </div>

      <div class="flex items-center justify-end gap-4">
        <button type="submit" :disabled="saving" class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-50">
          {{ saving ? 'Saving...' : 'Save Profile' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import AvatarCropper from '../../components/ui/AvatarCropper.vue'

const authStore = useAuthStore()
const saving = ref(false)

const formData = ref({
  username: '',
  displayName: '',
  bio: '',
  avatarUrl: ''
})

const usernameError = ref('')

onMounted(() => {
  if (authStore.user) {
    formData.value.username = authStore.user.username || ''
    formData.value.displayName = authStore.user.displayName || ''
    formData.value.bio = authStore.user.bio || ''
    formData.value.avatarUrl = authStore.user.avatarUrl || ''
  }
})

const saveProfile = async () => {
  saving.value = true
  usernameError.value = ''
  try {
    // Attempt to save username if changed
    if (formData.value.username !== authStore.user.username) {
      await authStore.updateUsername(formData.value.username)
    }

    // Save profile data
    await authStore.updateProfile({
      displayName: formData.value.displayName,
      bio: formData.value.bio,
      avatarUrl: formData.value.avatarUrl
    })
    // Simple toast could go here
  } catch (error) {
    console.error('Error updating profile:', error)
    if (error.message.includes('Username')) {
      usernameError.value = error.message
    }
  } finally {
    saving.value = false
  }
}
</script>
