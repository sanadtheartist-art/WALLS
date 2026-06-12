<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white">Analytics</h1>
      <p class="text-gray-500 mt-1">Platform-wide events from the Supabase analytics_events table</p>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div class="bg-[#0B1120] border border-[#1e293b] rounded-2xl p-6">
        <p class="text-gray-500 mb-1 text-sm">Total Page Views</p>
        <h3 class="text-4xl font-bold text-white">{{ stats.views }}</h3>
      </div>
      <div class="bg-[#0B1120] border border-[#1e293b] rounded-2xl p-6">
        <p class="text-gray-500 mb-1 text-sm">Total Link Clicks</p>
        <h3 class="text-4xl font-bold text-white">{{ stats.clicks }}</h3>
      </div>
      <div class="bg-[#0B1120] border border-[#1e293b] rounded-2xl p-6">
        <p class="text-gray-500 mb-1 text-sm">Contact Forms</p>
        <h3 class="text-4xl font-bold text-white">{{ stats.contacts }}</h3>
      </div>
    </div>

    <!-- Recent Events Table -->
    <div class="bg-[#0B1120] border border-[#1e293b] rounded-2xl overflow-hidden">
      <div class="px-6 py-4 border-b border-[#1e293b]">
        <h2 class="text-lg font-bold text-white">Recent Events</h2>
      </div>
      <div v-if="loading" class="p-12 text-center text-gray-500">Loading...</div>
      <div v-else-if="events.length === 0" class="p-12 text-center text-gray-500">
        <span class="text-3xl block mb-3">📊</span>
        No analytics events yet. Events will appear when users visit public walls.
      </div>
      <table v-else class="w-full">
        <thead>
          <tr class="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-[#1e293b]">
            <th class="px-6 py-4">Event</th>
            <th class="px-6 py-4">User ID</th>
            <th class="px-6 py-4">Block</th>
            <th class="px-6 py-4">Time</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#1e293b]">
          <tr v-for="e in events" :key="e.id" class="hover:bg-[#1e293b]/40">
            <td class="px-6 py-3">
              <span class="text-xs px-2 py-1 rounded-full" :class="eventClass(e.event_type)">{{ e.event_type }}</span>
            </td>
            <td class="px-6 py-3 text-gray-400 text-sm font-mono">{{ e.uid?.slice(0, 10) }}...</td>
            <td class="px-6 py-3 text-gray-400 text-sm">{{ e.block_id || '—' }}</td>
            <td class="px-6 py-3 text-gray-500 text-sm">{{ formatDate(e.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../config/supabase'

const loading = ref(true)
const events = ref([])
const stats = ref({ views: 0, clicks: 0, contacts: 0 })

const formatDate = (d) => d ? new Date(d).toLocaleString() : '—'
const eventClass = (t) => ({
  'view': 'bg-blue-500/10 text-blue-400',
  'click': 'bg-orange-500/10 text-orange-400',
  'contact': 'bg-emerald-500/10 text-emerald-400'
}[t] || 'bg-gray-500/10 text-gray-400')

onMounted(async () => {
  const [viewsRes, clicksRes, contactsRes, eventsRes] = await Promise.all([
    supabase.from('analytics_events').select('id', { count: 'exact', head: true }).eq('event_type', 'view'),
    supabase.from('analytics_events').select('id', { count: 'exact', head: true }).eq('event_type', 'click'),
    supabase.from('analytics_events').select('id', { count: 'exact', head: true }).eq('event_type', 'contact'),
    supabase.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(50)
  ])
  stats.value.views = viewsRes.count ?? 0
  stats.value.clicks = clicksRes.count ?? 0
  stats.value.contacts = contactsRes.count ?? 0
  events.value = eventsRes.data ?? []
  loading.value = false
})
</script>
