<template>
  <div class="min-h-screen bg-[#0B1120] flex items-center justify-center font-sans">
    <div class="text-center px-4">
      <h1 class="glitch" aria-label="404">404</h1>
      <p class="message text-gray-400 text-xl mt-6 mb-8">
        {{ isUsername
          ? `@${route.params.username} hasn't built their wall yet.`
          : `This page doesn't exist.`
        }}
      </p>
      <div class="actions flex justify-center gap-4">
        <button @click="router.back()" class="px-6 py-3 border border-[#334155] text-gray-300 rounded-full hover:bg-white/5 transition-colors">← Go back</button>
        <router-link to="/" class="px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">Explore Walls</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import gsap from 'gsap'

const route = useRoute()
const router = useRouter()

const isUsername = computed(() => {
  return route.fullPath.startsWith('/') && route.fullPath.split('/').length === 2 && !['dashboard', 'admin', 'login', 'signup', '404'].includes(route.fullPath.split('/')[1])
})

onMounted(() => {
  gsap.fromTo('.glitch',
    { opacity: 0, scale: 0.85 },
    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }
  )
  gsap.fromTo('.message',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, delay: 0.3 }
  )
  gsap.fromTo('.actions',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.4, delay: 0.5 }
  )
})
</script>

<style scoped>
.glitch {
  position: relative;
  font-size: clamp(120px, 25vw, 220px);
  font-weight: 900;
  color: white;
  letter-spacing: -0.04em;
  margin: 0;
  line-height: 1;
}

.glitch::before,
.glitch::after {
  content: '404';
  position: absolute;
  inset: 0;
  clip-path: polygon(0 30%, 100% 30%, 100% 60%, 0 60%);
}

.glitch::before {
  color: #f43f5e;
  animation: glitchA 3s infinite step-end;
}

.glitch::after {
  color: #0ea5e9;
  animation: glitchB 3s infinite step-end;
}

@keyframes glitchA {
  0%, 90%, 100% { transform: translate(0); }
  92%            { transform: translate(-4px, 2px); }
  94%            { transform: translate(4px, -2px); }
}

@keyframes glitchB {
  0%, 90%, 100% { transform: translate(0); }
  92%            { transform: translate(4px, -2px); }
  94%            { transform: translate(-4px, 2px); }
}
</style>
