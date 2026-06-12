<template>
  <div class="p-6 max-w-4xl">
    <h2 class="text-3xl font-bold text-white mb-8">Analytics</h2>
    
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style="border-color: var(--color-accent)"></div>
      <p class="text-gray-400 mt-4">Loading analytics...</p>
    </div>
    
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-[#111827] border border-[#334155] rounded-2xl p-6">
          <p class="text-gray-400 mb-2">Total Views</p>
          <h3 class="text-4xl font-bold text-white">{{ stats.views }}</h3>
          <p class="text-sm text-indigo-400 mt-2">Past 30 days</p>
        </div>
        <div class="bg-[#111827] border border-[#334155] rounded-2xl p-6">
          <p class="text-gray-400 mb-2">Total Clicks</p>
          <h3 class="text-4xl font-bold text-white">{{ stats.clicks }}</h3>
          <p class="text-sm text-indigo-400 mt-2">Past 30 days</p>
        </div>
        <div class="bg-[#111827] border border-[#334155] rounded-2xl p-6">
          <p class="text-gray-400 mb-2">Click Through Rate</p>
          <h3 class="text-4xl font-bold text-white">{{ stats.ctr }}%</h3>
          <p class="text-sm text-indigo-400 mt-2">Past 30 days</p>
        </div>
      </div>

      <div v-if="events.length" class="bg-[#111827] border border-[#334155] rounded-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-[#334155]">
          <h3 class="text-lg font-bold text-white">Recent Activity</h3>
        </div>
        <table class="w-full">
          <thead>
            <tr class="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-[#334155]">
              <th class="px-6 py-4">Event</th>
              <th class="px-6 py-4">Block</th>
              <th class="px-6 py-4">Time</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#334155]">
            <tr v-for="e in events" :key="e.id" class="hover:bg-[#1e293b]/40">
              <td class="px-6 py-3">
                <span class="text-xs px-2 py-1 rounded-full" :class="eventClass(e.event_type)">{{ e.event_type }}</span>
              </td>
              <td class="px-6 py-3 text-gray-400 text-sm">{{ e.block_id || '—' }}</td>
              <td class="px-6 py-3 text-gray-500 text-sm">{{ formatDate(e.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-else class="bg-[#111827] border border-[#334155] rounded-2xl p-6 h-64 flex items-center justify-center">
        <div class="text-center">
          <span class="text-4xl mb-4 block">📈</span>
          <h3 class="text-xl font-bold text-white mb-2">Not enough data</h3>
          <p class="text-gray-400">Share your wall to start collecting analytics.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { supabase } from '../../config/supabase'

const authStore = useAuthStore()
const loading = ref(true)
const events = ref([])
const stats = ref({ views: 0, clicks: 0, ctr: 0 })

const formatDate = (d) => d ? new Date(d).toLocaleString() : '—'
const eventClass = (t) => ({
  'view': 'bg-blue-500/10 text-blue-400',
  'click': 'bg-orange-500/10 text-orange-400',
  'contact': 'bg-emerald-500/10 text-emerald-400'
}[t] || 'bg-gray-500/10 text-gray-400')

const fetchAnalytics = async () => {
  if (!authStore.user?.uid) return

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const [viewsRes, clicksRes, eventsRes] = await Promise.all([
    supabase.from('analytics_events')
      .select('id', { count: 'exact', head: true })
      .eq('uid', authStore.user.uid)
      .eq('event_type', 'view')
      .gte('created_at', thirtyDaysAgo.toISOString()),
    supabase.from('analytics_events')
      .select('id', { count: 'exact', head: true })
      .eq('uid', authStore.user.uid)
      .eq('event_type', 'click')
      .gte('created_at', thirtyDaysAgo.toISOString()),
    supabase.from('analytics_events')
      .select('*')
      .eq('uid', authStore.user.uid)
      .order('created_at', { ascending: false })
      .limit(50)
  ])
  
  stats.value.views = viewsRes.count ?? 0
  stats.value.clicks = clicksRes.count ?? 0
  stats.value.ctr = stats.value.views > 0 ? Math.round((stats.value.clicks / stats.value.views) * 100) : 0
  events.value = eventsRes.data ?? []
  loading.value = false
}

onMounted(() => {
  fetchAnalytics()
})
</script>
