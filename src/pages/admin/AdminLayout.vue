<template>
  <div class="min-h-screen bg-[#111827] flex flex-col font-sans text-white">
    <!-- Top Header -->
    <header class="h-16 px-6 bg-[#0B1120] border-b border-[#1e293b] flex items-center justify-between shrink-0 z-30">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-indigo-600 flex items-center justify-center font-bold text-sm">W</div>
        <span class="font-bold text-lg">Walls <span class="text-orange-400">Admin</span></span>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span class="text-emerald-400 text-xs font-medium">{{ authStore.adminUser?.email }}</span>
        </div>
        <button @click="handleLogout" class="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg transition-all text-sm font-medium">
          Sign Out
        </button>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Left Sidebar -->
      <aside class="w-64 bg-[#0B1120] border-r border-[#1e293b] flex flex-col py-6 shrink-0">
        <nav class="px-3 space-y-1">
          <router-link
            v-for="item in navItems" :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-[#1e293b] transition-all group"
            :class="{ 'bg-orange-500/10 border border-orange-500/20 text-orange-300': isActive(item.to) }"
            :exact="item.exact"
          >
            <span class="text-lg">{{ item.icon }}</span>
            <span class="font-medium text-sm">{{ item.label }}</span>
            <span v-if="item.badge" class="ml-auto text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400">{{ item.badge }}</span>
          </router-link>
        </nav>

        <div class="mt-auto px-3">
          <div class="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-indigo-500/10 border border-orange-500/20">
            <p class="text-xs text-orange-300 font-semibold mb-1">Supabase Connected</p>
            <p class="text-xs text-gray-500">Data syncs in real-time</p>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto bg-[#111827]">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const navItems = [
  { to: '/admin', icon: '📊', label: 'Overview', exact: true },
  { to: '/admin/users', icon: '👥', label: 'Users' },
  { to: '/admin/reserved', icon: '🔒', label: 'Reserved Names' },
  { to: '/admin/config', icon: '⚙️', label: 'Site Config' },
  { to: '/admin/analytics', icon: '📈', label: 'Analytics' },
  { to: '/admin/reports', icon: '🚩', label: 'Reports' },
]

const isActive = (path) => {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}

const handleLogout = async () => {
  await authStore.adminLogOut()
  router.push('/admin/login')
}
</script>
