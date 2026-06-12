<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 pointer-events-none safe-area-pb">
    <nav class="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between px-2 py-2 shadow-2xl pointer-events-auto">
      <router-link
        v-for="item in navItems" :key="item.to"
        :to="item.to"
        class="flex flex-col items-center gap-1 p-2 rounded-xl text-gray-400 hover:text-white transition-all flex-1"
        :class="isActive(item.to) ? 'text-orange-300 bg-orange-500/10' : ''"
      >
        <span class="text-xl" :class="isActive(item.to) ? 'scale-110 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]' : ''">{{ item.icon }}</span>
        <span class="text-[10px] font-medium" :class="isActive(item.to) ? 'text-orange-300' : ''">{{ item.label }}</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { to: '/dashboard', icon: '🧱', label: 'Blocks' },
  { to: '/dashboard/design', icon: '🎨', label: 'Design' },
  { to: '/dashboard/profile', icon: '👤', label: 'Profile' },
  { to: '/dashboard/analytics', icon: '📈', label: 'Stats' },
  { to: '/dashboard/settings', icon: '⚙️', label: 'Settings' },
]

const isActive = (path) => {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(path)
}
</script>
<style>
.safe-area-pb {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
</style>
