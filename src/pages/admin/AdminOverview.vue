<template>
  <div class="p-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white">Overview</h1>
      <p class="text-gray-500 mt-1">Platform health at a glance (Data from Firebase)</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
      <div v-for="stat in stats" :key="stat.label" class="bg-[#0B1120] border border-[#1e293b] rounded-2xl p-6 hover:border-orange-500/30 transition-colors">
        <div class="flex items-start justify-between mb-4">
          <span class="text-3xl">{{ stat.icon }}</span>
          <span class="text-xs px-2 py-1 rounded-full font-medium" :class="stat.changeClass">{{ stat.change }}</span>
        </div>
        <div class="text-4xl font-bold text-white mb-1">{{ loading ? '...' : stat.value }}</div>
        <div class="text-gray-500 text-sm">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Recent Users -->
    <div class="bg-[#0B1120] border border-[#1e293b] rounded-2xl overflow-hidden">
      <div class="px-6 py-4 border-b border-[#1e293b] flex items-center justify-between">
        <h2 class="text-lg font-bold text-white">Recent Users</h2>
        <router-link to="/admin/users" class="text-orange-400 text-sm hover:text-orange-300">View all →</router-link>
      </div>
      <div v-if="loading" class="p-8 text-center text-gray-500">Loading...</div>
      <div v-else-if="recentUsers.length === 0" class="p-8 text-center text-gray-500">No users yet.</div>
      <table v-else class="w-full">
        <thead>
          <tr class="text-left text-xs text-gray-500 uppercase tracking-wider">
            <th class="px-6 py-3">User</th>
            <th class="px-6 py-3">Plan</th>
            <th class="px-6 py-3">Joined</th>
            <th class="px-6 py-3">Public</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#1e293b]">
          <tr v-for="user in recentUsers" :key="user.uid" class="hover:bg-[#1e293b]/50 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center text-sm font-bold text-orange-300">
                  {{ user.displayName?.charAt(0) || user.username?.charAt(0) || '?' }}
                </div>
                <div>
                  <div class="font-medium text-white text-sm">{{ user.displayName || user.username }}</div>
                  <div class="text-xs text-gray-500">@{{ user.username }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="text-xs px-2 py-1 rounded-full font-medium" :class="user.plan === 'pro' ? 'bg-amber-500/10 text-amber-400' : 'bg-gray-500/10 text-gray-400'">
                {{ user.plan || 'free' }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-400 text-sm">{{ formatDate(user.createdAt?.seconds * 1000) }}</td>
            <td class="px-6 py-4">
              <span class="w-2 h-2 rounded-full inline-block" :class="user.isPublic !== false ? 'bg-emerald-500' : 'bg-gray-600'"></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { supabase } from '../../config/supabase'

const loading = ref(true)
const recentUsers = ref([])
const stats = ref([
  { icon: '👥', label: 'Total Users', value: 0, change: 'total', changeClass: 'bg-emerald-500/10 text-emerald-400' },
  { icon: '🌐', label: 'Public Walls', value: 0, change: 'active', changeClass: 'bg-blue-500/10 text-blue-400' },
  { icon: '💎', label: 'Pro Users', value: 0, change: '0%', changeClass: 'bg-amber-500/10 text-amber-400' },
  { icon: '📊', label: 'Total Events', value: 0, change: 'all time', changeClass: 'bg-orange-500/10 text-orange-400' },
])

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const loadStats = async () => {
  loading.value = true
  try {
    const snap = await getDocs(collection(db, 'users'))
    const allUsers = snap.docs.map(doc => ({ uid: doc.id, ...doc.data() }))
    
    const publicUsers = allUsers.filter(u => u.isPublic !== false)
    const proUsers = allUsers.filter(u => u.plan === 'pro')

    // Fetch analytics directly from Supabase since events are high-frequency logs not in Firebase
    const { count: eventCount } = await supabase.from('analytics_events').select('id', { count: 'exact', head: true })

    stats.value[0].value = allUsers.length
    stats.value[1].value = publicUsers.length
    stats.value[2].value = proUsers.length
    stats.value[3].value = eventCount ?? 0

    // Fetch recent 8 users
    const recentQ = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(8))
    const recentSnap = await getDocs(recentQ)
    recentUsers.value = recentSnap.docs.map(d => ({ uid: d.id, ...d.data() }))

  } catch (err) {
    console.error('Admin overview error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadStats)
</script>
