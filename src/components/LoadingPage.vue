<template>
  <div class="loading-screen min-h-screen bg-bg flex flex-col items-center justify-center">
    <div class="wordmark mb-8">
      <span v-for="(letter, index) in 'Walls'" :key="index" class="letter text-4xl font-bold text-white opacity-0" :style="{ animationDelay: `${index * 0.1}s` }">
        {{ letter }}
      </span>
    </div>
    <div class="underline w-0 h-1 bg-accent mb-8"></div>
    <div class="dots flex gap-2">
      <span v-for="i in 8" :key="i" class="dot w-2 h-2 rounded-full bg-accent opacity-30" :style="{ animationDelay: `${i * 0.15}s` }"></span>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.letter {
  animation: fadeInUp 0.4s ease-out forwards;
}
.underline {
  animation: expandWidth 0.4s ease-out 0.4s forwards;
}
.dot {
  animation: dotPulse 1.2s ease-in-out infinite;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes expandWidth {
  from { width: 0; }
  to { width: 80px; }
}

@keyframes dotPulse {
  0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
  40% { transform: scale(1); opacity: 1; }
}
</style>
