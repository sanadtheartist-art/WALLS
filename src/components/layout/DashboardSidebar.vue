<template>
  <aside class="w-64 bg-[#0B1120] border-r border-[#1e293b] flex flex-col py-6 shrink-0">
    <!-- User profile snippet -->
    <div class="px-4 mb-6">
      <div class="flex items-center gap-3 p-3 rounded-xl bg-[#111827] border border-[#1e293b]">
        <img v-if="authStore.user?.avatarUrl" :src="authStore.user.avatarUrl" class="w-9 h-9 rounded-full object-cover shrink-0" />
        <div v-else class="w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center text-sm font-bold text-orange-300 shrink-0">
          {{ authStore.user?.displayName?.charAt(0) || '?' }}
        </div>
        <div class="min-w-0">
          <div class="text-sm font-semibold text-white truncate">{{ authStore.user?.displayName || 'Your Name' }}</div>
          <div class="text-xs text-gray-500 truncate">@{{ authStore.user?.username }}</div>
        </div>
      </div>
    </div>

    <nav class="flex-1 px-3 space-y-1">
      <router-link
        v-for="item in navItems" :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-[#111827] transition-all"
        :class="{ 'bg-orange-500/10 border border-orange-500/20 !text-orange-300': isActive(item.to) }"
      >
        <Icon :icon="item.icon" class="w-5 h-5" />
        <span class="font-medium text-sm">{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- Wall link at bottom -->
    <div class="px-4 mt-6">
      <a v-if="authStore.user?.username" :href="`/${authStore.user.username}`" target="_blank"
        class="flex items-center gap-2 text-xs text-gray-500 hover:text-orange-400 transition-colors">
        <Icon icon="lucide:globe" class="w-4 h-4" /> View my wall ↗
      </a>
    </div>
  </aside>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

const authStore = useAuthStore()
const route = useRoute()

const navItems = [
  { to: '/dashboard', icon: 'lucide:layout-template', label: 'Blocks' },
  { to: '/dashboard/design', icon: 'lucide:palette', label: 'Design' },
  { to: '/dashboard/profile', icon: 'lucide:user', label: 'Profile' },
  { to: '/dashboard/analytics', icon: 'lucide:bar-chart-2', label: 'Analytics' },
  { to: '/dashboard/settings', icon: 'lucide:settings', label: 'Settings' },
]

const isActive = (path) => {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(path)
}
</script>
