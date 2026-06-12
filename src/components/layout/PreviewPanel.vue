<template>
  <div class="relative w-[320px] h-[650px] bg-black rounded-[40px] border-[8px] border-gray-900 shadow-2xl overflow-hidden shrink-0">
    <!-- Phone Notch -->
    <div class="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-xl w-32 mx-auto z-50"></div>
    
    <!-- Iframe Preview -->
    <iframe 
      v-if="authStore.user"
      :src="`/${authStore.user.username}?preview=true`" 
      class="w-full h-full bg-[#0B1120] pointer-events-none"
      frameborder="0"
    ></iframe>
    <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-[#0B1120]">
      <div class="animate-spin text-2xl mb-4">🌀</div>
      Loading Preview...
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'
const authStore = useAuthStore()
</script>
