<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white">Reserved Usernames</h1>
        <p class="text-gray-500 mt-1">Block usernames from being registered</p>
      </div>
      <button @click="showAdd = !showAdd" class="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl transition-colors text-sm">
        + Add Reserved
      </button>
    </div>

    <!-- Add Form -->
    <div v-if="showAdd" class="bg-[#0B1120] border border-orange-500/30 rounded-2xl p-6 mb-6">
      <h3 class="text-lg font-bold text-white mb-4">Reserve a Username</h3>
      <form @submit.prevent="addReserved" class="flex gap-3">
        <input v-model="newUsername" type="text" placeholder="username" required class="flex-1 px-4 py-2.5 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500" />
        <input v-model="newReason" type="text" placeholder="Reason (optional)" class="flex-1 px-4 py-2.5 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500" />
        <button type="submit" :disabled="saving" class="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl transition-colors text-sm disabled:opacity-50">
          {{ saving ? 'Adding...' : 'Add' }}
        </button>
      </form>
    </div>

    <!-- List -->
    <div class="bg-[#0B1120] border border-[#1e293b] rounded-2xl overflow-hidden">
      <div v-if="loading" class="p-12 text-center text-gray-500">Loading...</div>
      <div v-else-if="reserved.length === 0" class="p-12 text-center text-gray-500">No reserved usernames.</div>
      <table v-else class="w-full">
        <thead>
          <tr class="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-[#1e293b]">
            <th class="px-6 py-4">Username</th>
            <th class="px-6 py-4">Reason</th>
            <th class="px-6 py-4">Added</th>
            <th class="px-6 py-4">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#1e293b]">
          <tr v-for="item in reserved" :key="item.username" class="hover:bg-[#1e293b]/40 transition-colors">
            <td class="px-6 py-4 font-mono text-orange-300 font-medium">@{{ item.username }}</td>
            <td class="px-6 py-4 text-gray-400 text-sm">{{ item.reason || '—' }}</td>
            <td class="px-6 py-4 text-gray-500 text-sm">{{ formatDate(item.added_at) }}</td>
            <td class="px-6 py-4">
              <button @click="removeReserved(item.username)" class="text-xs px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../config/supabase'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const reserved = ref([])
const loading = ref(true)
const showAdd = ref(false)
const saving = ref(false)
const newUsername = ref('')
const newReason = ref('')

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

const fetchReserved = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase.from('reserved_usernames').select('*').order('added_at', { ascending: false })
    if (error) {
      console.error('Error fetching reserved usernames:', error)
      // Fallback if ordering fails
      const { data: fallbackData } = await supabase.from('reserved_usernames').select('*')
      reserved.value = fallbackData ?? []
      return
    }
    reserved.value = data ?? []
  } catch (e) {
    console.error('Error fetching reserved usernames:', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchReserved)

const addReserved = async () => {
  saving.value = true
  try {
    const { data, error } = await supabase.from('reserved_usernames').insert({
      username: newUsername.value.toLowerCase().trim(),
      reason: newReason.value.trim() || null,
      added_by: authStore.adminUser?.email || 'admin',
      added_at: new Date().toISOString()
    }).select()
    
    if (error) {
      console.error('Error adding reserved username:', error)
      alert('Error adding reserved username: ' + error.message)
      return
    }
    
    console.log('Inserted reserved username:', data)
    newUsername.value = ''
    newReason.value = ''
    showAdd.value = false
    await fetchReserved()
  } catch (e) {
    console.error('Exception adding reserved username:', e)
    alert('Exception adding reserved username: ' + e.message)
  } finally {
    saving.value = false
  }
}

const removeReserved = async (username) => {
  if (!confirm(`Remove @${username} from reserved?`)) return
  try {
    const { error } = await supabase.from('reserved_usernames').delete().eq('username', username)
    if (error) {
      console.error('Error removing reserved username:', error)
      alert('Error removing reserved username: ' + error.message)
      return
    }
    reserved.value = reserved.value.filter(r => r.username !== username)
  } catch (e) {
    console.error('Error removing reserved username:', e)
    alert('Error removing reserved username')
  }
}
</script>
