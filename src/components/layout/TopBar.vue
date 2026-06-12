<template>
  <header class="px-4 sm:px-6 py-3 sm:py-4 bg-[#111827] border-b border-[#334155] flex items-center justify-between">
    <div class="flex items-center gap-2 sm:gap-3">
      <h1 class="text-lg sm:text-xl font-bold">Walls</h1>
      <span class="text-gray-400 text-xs sm:text-sm">Dashboard</span>
    </div>
    <div class="flex items-center gap-2 sm:gap-4">
      <div v-if="saving" class="text-gray-400 text-xs sm:text-sm flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span> Saving...
      </div>
      <router-link v-if="authStore.user" :to="`/${authStore.user.username}`" class="text-indigo-400 hover:text-indigo-300 text-xs sm:text-sm">Open ↗</router-link>
      <button @click="handleLogout" class="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors text-xs sm:text-sm">Logout</button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const saving = ref(false)

const handleLogout = async () => {
  authStore.unsubscribeFromBlocks()
  await authStore.logOut()
  router.push('/')
}
</script>
