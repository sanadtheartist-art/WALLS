<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white">Users</h1>
        <p class="text-gray-500 mt-1">{{ users.length }} total users</p>
      </div>
      <div class="relative">
        <input v-model="search" type="text" placeholder="Search username or email..." class="pl-10 pr-4 py-2.5 bg-[#0B1120] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 w-72" />
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-[#0B1120] border border-[#1e293b] rounded-2xl overflow-hidden">
      <div v-if="loading" class="p-12 text-center text-gray-500">Loading users...</div>
      <div v-else-if="filteredUsers.length === 0" class="p-12 text-center text-gray-500">No users found.</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-[#1e293b]">
              <th class="px-6 py-4">User</th>
              <th class="px-6 py-4">Plan</th>
              <th class="px-6 py-4">Joined</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#1e293b]">
            <tr v-for="user in filteredUsers" :key="user.uid" class="hover:bg-[#1e293b]/40 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img v-if="user.avatar_url || user.avatarUrl" :src="user.avatar_url || user.avatarUrl" class="w-9 h-9 rounded-full object-cover border border-[#1e293b]" />
                  <div v-else class="w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center text-sm font-bold text-orange-300">
                    {{ (user.displayName || user.display_name || user.username || '?').charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="font-medium text-white text-sm">{{ user.displayName || user.display_name || '—' }}</div>
                    <div class="text-xs text-gray-500">@{{ user.username }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <select :value="user.plan || 'free'" @change="changePlan(user, $event.target.value)" class="text-xs px-2 py-1 rounded-full bg-transparent border border-[#1e293b] text-gray-300 focus:outline-none focus:border-orange-500 cursor-pointer">
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                </select>
              </td>
              <td class="px-6 py-4 text-gray-400 text-sm">{{ formatDate(user.createdAt || user.created_at) }}</td>
              <td class="px-6 py-4">
                <button @click="togglePublic(user)" class="flex items-center gap-2 text-xs px-2 py-1 rounded-full border transition-all" :class="(user.isPublic !== false || user.is_public) ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-gray-600 bg-gray-600/10 text-gray-500'">
                  <span class="w-1.5 h-1.5 rounded-full" :class="(user.isPublic !== false || user.is_public) ? 'bg-emerald-500' : 'bg-gray-500'"></span>
                  {{ (user.isPublic !== false || user.is_public) ? 'Public' : 'Private' }}
                </button>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a :href="`/${user.username}`" target="_blank" class="text-xs px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 rounded-lg transition-colors">View Wall</a>
                  <button @click="deleteUser(user)" class="text-xs px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '../../config/supabase'

const users = ref([])
const loading = ref(true)
const search = ref('')

const filteredUsers = computed(() => {
  if (!search.value) return users.value
  const q = search.value.toLowerCase()
  return users.value.filter(u => 
    u.username?.toLowerCase().includes(q) || 
    u.display_name?.toLowerCase().includes(q) ||
    u.displayName?.toLowerCase().includes(q)
  )
})

const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

const fetchUsers = async () => {
  loading.value = true
  try {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    users.value = data.map(profile => ({
      uid: profile.id,
      ...profile,
      displayName: profile.display_name,
      isPublic: profile.is_public,
      createdAt: profile.created_at
    }))
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

const togglePublic = async (user) => {
  const newPublic = user.is_public === false ? true : false
  await supabase.from('profiles').update({ is_public: newPublic }).eq('id', user.uid)
  user.is_public = newPublic
  user.isPublic = newPublic
}

const changePlan = async (user, plan) => {
  await supabase.from('profiles').update({ plan }).eq('id', user.uid)
  user.plan = plan
}

const deleteUser = async (user) => {
  if (!confirm(`Are you sure you want to delete ${user.username}? This will remove their user document and all associated data.`)) return
  // Delete blocks, username, profile, analytics
  await supabase.from('blocks').delete().eq('user_id', user.uid)
  await supabase.from('usernames').delete().eq('user_id', user.uid)
  await supabase.from('analytics_events').delete().eq('user_id', user.uid)
  await supabase.from('profiles').delete().eq('id', user.uid)
  users.value = users.value.filter(u => u.uid !== user.uid)
}
</script>
