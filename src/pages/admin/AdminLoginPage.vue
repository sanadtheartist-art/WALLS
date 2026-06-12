<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <h1 class="text-3xl font-bold text-center mb-8">Admin Log In</h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Email</label>
          <input type="email" v-model="email" class="w-full px-4 py-2 rounded-lg bg-surface border border-muted focus:border-accent focus:outline-none" required>
        </div>
        <div>
          <label class="block text-sm mb-1">Password</label>
          <input type="password" v-model="password" class="w-full px-4 py-2 rounded-lg bg-surface border border-muted focus:border-accent focus:outline-none" required>
        </div>
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
        <button type="submit" :disabled="loading" class="w-full py-3 bg-accent text-white rounded-lg hover:opacity-90 disabled:opacity-50">
          {{ loading ? 'Logging in...' : 'Log In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await authStore.adminLogIn(email.value, password.value)
    router.push('/admin')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
