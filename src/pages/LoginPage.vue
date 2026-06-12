<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <h1 class="text-3xl font-bold text-center mb-8">Log In</h1>
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
      <div class="my-6 flex items-center justify-center gap-4 text-sm text-gray-500">
        <div class="h-px bg-[#1e293b] flex-1"></div>
        <span>or</span>
        <div class="h-px bg-[#1e293b] flex-1"></div>
      </div>
      <button @click="handleGoogleLogin" :disabled="loading" class="w-full py-3 mb-6 bg-white text-black font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-3 transition-opacity">
        <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continue with Google
      </button>
      <p class="text-center text-muted">
        Don't have an account? <router-link to="/signup" class="text-accent">Sign up</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  console.log('[Login Page] Handle Login called')
  loading.value = true
  error.value = ''
  try {
    console.log('[Login Page] Calling authStore.logIn...')
    await authStore.logIn(email.value, password.value)
    console.log('[Login Page] Log in successful, navigating to dashboard...')
    router.push('/dashboard')
  } catch (err) {
    console.error('[Login Page] Log in error:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}
const handleGoogleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await authStore.logInWithGoogle()
    if (res.isNewUser) {
      router.push('/dashboard/profile')
    } else {
      router.push('/dashboard')
    }
  } catch (err) {
    console.error(err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
