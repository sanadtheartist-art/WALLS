<template>
  <header class="px-6 py-4 bg-[#111827] border-b border-[#334155] flex items-center justify-between">
    <div class="flex items-center gap-3">
      <h1 class="text-xl font-bold">Walls</h1>
      <span class="text-gray-400">Dashboard</span>
    </div>
    <div class="flex items-center gap-4">
      <div v-if="saving" class="text-gray-400 text-sm flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span> Saving...
      </div>
      <router-link v-if="authStore.user" :to="`/${authStore.user.username}`" class="text-indigo-400 hover:text-indigo-300">Open my Wall ↗</router-link>
      <button @click="handleLogout" class="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors">Logout</button>
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
