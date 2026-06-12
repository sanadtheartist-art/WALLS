<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      
      <!-- STEP 1: Registration -->
      <div v-if="step === 1">
        <h1 class="text-3xl font-bold text-center mb-8">Sign Up</h1>
        
        <div class="mb-6">
          <button @click="handleGoogleSignup" :disabled="loading" class="w-full py-3 bg-white text-black font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-3 transition-opacity">
            <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Sign up with Google
          </button>
          <div class="my-6 flex items-center justify-center gap-4 text-sm text-gray-500">
            <div class="h-px bg-[#1e293b] flex-1"></div>
            <span>or email</span>
            <div class="h-px bg-[#1e293b] flex-1"></div>
          </div>
        </div>

        <form @submit.prevent="handleSignup()" class="space-y-4">
          <div>
            <label class="block text-sm mb-1">Username <span class="text-gray-500 text-xs">(Must be unique)</span></label>
            <input type="text" v-model="username" class="w-full px-4 py-2 rounded-lg bg-surface border border-muted focus:border-accent focus:outline-none" required>
          </div>
          <div>
            <label class="block text-sm mb-1">Display Name</label>
            <input type="text" v-model="displayName" class="w-full px-4 py-2 rounded-lg bg-surface border border-muted focus:border-accent focus:outline-none" required>
          </div>
          <div>
            <label class="block text-sm mb-1">Email</label>
            <input type="email" v-model="email" class="w-full px-4 py-2 rounded-lg bg-surface border border-muted focus:border-accent focus:outline-none" required>
          </div>
          <div>
            <label class="block text-sm mb-1">Password</label>
            <input type="password" v-model="password" class="w-full px-4 py-2 rounded-lg bg-surface border border-muted focus:border-accent focus:outline-none" required>
          </div>
          
          <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
          <button type="submit" :disabled="loading" class="w-full py-3 bg-accent text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50">
            {{ loading ? 'Saving...' : 'Create Account' }}
          </button>
        </form>
        <p class="text-center text-muted mt-6">
          Already have an account? <router-link to="/login" class="text-accent">Log in</router-link>
        </p>
      </div>

      <!-- STEP 2: Password Setup (for Google signups) -->
      <div v-else-if="step === 2 && isGoogleSignup" class="text-center">
        <h1 class="text-3xl font-bold mb-4">Set a Password</h1>
        <p class="text-gray-400 mb-8">To delete your account later, you'll need a password.</p>
        
        <form @submit.prevent="handleSetPassword" class="space-y-4 text-left">
          <div>
            <label class="block text-sm mb-1">New Password</label>
            <input type="password" v-model="googlePassword" class="w-full px-4 py-2 rounded-lg bg-surface border border-muted focus:border-accent focus:outline-none" required>
          </div>
          <div>
            <label class="block text-sm mb-1">Confirm Password</label>
            <input type="password" v-model="googlePasswordConfirm" class="w-full px-4 py-2 rounded-lg bg-surface border border-muted focus:border-accent focus:outline-none" required>
          </div>

          <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
          
          <div class="space-y-3">
            <button type="submit" :disabled="loading" class="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-500 disabled:opacity-50 transition-colors">
              {{ loading ? 'Saving...' : 'Set Password & Continue' }}
            </button>
            <button @click="skipPasswordStep" type="button" :disabled="loading" class="w-full py-3 bg-transparent text-gray-400 border border-gray-600 font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors">
              Skip for now
            </button>
          </div>
        </form>
      </div>

      <!-- STEP 3: Avatar Upload -->
      <div v-else-if="step === 2 || step ===3" class="text-center">
        <h1 class="text-3xl font-bold mb-4">Set your Avatar</h1>
        <p class="text-gray-400 mb-8">Upload a picture to make your wall stand out.</p>
        
        <div class="flex justify-center mb-8">
          <AvatarCropper @cropped="onAvatarCropped" :currentAvatar="tempAvatarUrl" />
        </div>

        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>
        
        <div class="space-y-3">
          <button @click="finishAvatarStep" :disabled="loading" class="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-500 disabled:opacity-50 transition-colors">
            {{ loading ? 'Saving...' : (tempAvatarUrl ? 'Save & Continue' : 'Skip for now') }}
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AvatarCropper from '../components/ui/AvatarCropper.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const displayName = ref('')
const email = ref('')
const password = ref('')
const googlePassword = ref('')
const googlePasswordConfirm = ref('')
const error = ref('')
const loading = ref(false)

const step = ref(1)
const tempAvatarUrl = ref('')
const isGoogleSignup = ref(false)

const onAvatarCropped = (url) => {
  tempAvatarUrl.value = url
}

const finishAvatarStep = async () => {
  if (tempAvatarUrl.value) {
    loading.value = true
    try {
      await authStore.updateProfile({ avatarUrl: tempAvatarUrl.value })
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }
  router.push('/dashboard')
}

const handleGoogleSignup = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await authStore.logInWithGoogle()
    isGoogleSignup.value = true
    if (res.isNewUser) {
      if (authStore.user?.avatarUrl) {
        tempAvatarUrl.value = authStore.user.avatarUrl
      }
      step.value = 2 // Go to password step first!
    } else {
      router.push('/dashboard')
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleSetPassword = async () => {
  if (googlePassword.value !== googlePasswordConfirm.value) {
    error.value = 'Passwords do not match'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await authStore.setPassword(googlePassword.value)
    step.value = 3 // Now go to avatar step
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const skipPasswordStep = () => {
  step.value = 3
}

const handleSignup = async () => {
  loading.value = true
  error.value = ''
  try {
    await authStore.signUp(email.value, password.value, username.value, displayName.value)
    isGoogleSignup.value = false
    step.value = 2 // Go to avatar step
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
