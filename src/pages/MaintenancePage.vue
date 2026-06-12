<template>
  <div class="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center px-6 text-center">
    <div class="text-4xl font-black text-white mb-4 tracking-tight">WALLS.</div>
    <h1 class="text-2xl md:text-3xl font-bold text-white mb-3">Under Maintenance</h1>
    <p class="text-gray-400 max-w-md">
      {{ message || "We're making some improvements. Please check back soon." }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSiteConfigStore } from '../stores/siteConfig'

const siteConfig = useSiteConfigStore()
const message = computed(() => siteConfig.maintenance_mode.message)
</script>
