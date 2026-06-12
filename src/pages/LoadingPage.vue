<template>
  <div class="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center font-sans">
    <div class="relative">
      <div class="wordmark text-6xl font-bold text-white flex gap-1 mb-6">
        <span class="letter" v-for="(l, index) in 'Walls'" :key="index">{{ l }}</span>
      </div>
      <div class="underline absolute bottom-0 left-0 w-full h-1 bg-indigo-500 origin-left"></div>
    </div>
    <div class="dots flex gap-2 mt-8">
      <span v-for="i in 8" :key="i" class="dot"></span>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import gsap from 'gsap'

onMounted(() => {
  const tl = gsap.timeline()

  tl.fromTo('.letter', 
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, stagger: 0.07, duration: 0.4, ease: 'power2.out' }
  )
  .fromTo('.underline',
    { scaleX: 0 },
    { scaleX: 1, duration: 0.4, ease: 'power3.out' }
  )
  .to('.wordmark',
    { textShadow: '0 0 32px #7c3aed', duration: 0.5, yoyo: true, repeat: -1 }
  )
})
</script>

<style scoped>
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #7c3aed;
  animation: dotPulse 1.2s ease-in-out infinite;
}

.dot:nth-child(1) { animation-delay: 0.00s; }
.dot:nth-child(2) { animation-delay: 0.12s; }
.dot:nth-child(3) { animation-delay: 0.24s; }
.dot:nth-child(4) { animation-delay: 0.36s; }
.dot:nth-child(5) { animation-delay: 0.48s; }
.dot:nth-child(6) { animation-delay: 0.60s; }
.dot:nth-child(7) { animation-delay: 0.72s; }
.dot:nth-child(8) { animation-delay: 0.84s; }

@keyframes dotPulse {
  0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
  40%            { transform: scale(1.0); opacity: 1.0; }
}
</style>
