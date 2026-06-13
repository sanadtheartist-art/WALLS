<template>
  <div class="p-8 max-w-3xl">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white">Site Config</h1>
      <p class="text-gray-500 mt-1">Global platform settings stored in Supabase</p>
    </div>

    <div v-if="loading" class="text-gray-500">Loading config...</div>
    <div v-else class="space-y-6">

      <!-- Maintenance Mode -->
      <div class="bg-[#0B1120] border border-[#1e293b] rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-white">Maintenance Mode</h3>
            <p class="text-sm text-gray-500">When enabled, all visitors see a maintenance page.</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="maintenance.active" @change="saveConfig('maintenance_mode', maintenance)" class="sr-only peer">
            <div class="w-14 h-7 bg-[#111827] border border-[#1e293b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>
        <div v-if="maintenance.active" class="mt-4">
          <label class="block text-sm text-gray-400 mb-2">Maintenance Message</label>
          <input v-model="maintenance.message" type="text" placeholder="We'll be back soon..." @blur="saveConfig('maintenance_mode', maintenance)" class="w-full px-4 py-2.5 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500" />
        </div>
      </div>

      <!-- Announcement Banner -->
      <div class="bg-[#0B1120] border border-[#1e293b] rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-bold text-white">Announcement Banner</h3>
            <p class="text-sm text-gray-500">Show a banner across the top of all pages.</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="banner.active" @change="saveConfig('announcement_banner', banner)" class="sr-only peer">
            <div class="w-14 h-7 bg-[#111827] border border-[#1e293b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-2">Banner Text</label>
          <input v-model="banner.text" type="text" placeholder="🎉 New features dropped!" @blur="saveConfig('announcement_banner', banner)" class="w-full px-4 py-2.5 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500" />
        </div>
      </div>

      <!-- Featured Walls -->
      <div class="bg-[#0B1120] border border-[#1e293b] rounded-2xl p-6">
        <h3 class="text-lg font-bold text-white mb-4">Featured Walls</h3>
        <p class="text-sm text-gray-500 mb-4">Usernames to feature on the landing page.</p>
        <div class="flex flex-wrap gap-2 mb-4">
          <div v-for="(w, i) in featuredWalls" :key="i" class="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-300 text-sm">
            @{{ w }}
            <button @click="removeFeatured(i)" class="text-orange-400 hover:text-white">×</button>
          </div>
        </div>
        <form @submit.prevent="addFeatured" class="flex gap-3">
          <input v-model="newFeatured" type="text" placeholder="username" class="flex-1 px-4 py-2.5 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500" />
          <button type="submit" class="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-xl transition-colors">Add</button>
        </form>
      </div>

      <!-- Landing Page -->
      <div class="bg-[#0B1120] border border-[#1e293b] rounded-2xl p-6 space-y-8">
        <div>
          <h3 class="text-lg font-bold text-white mb-1">Landing Page</h3>
          <p class="text-sm text-gray-500">Hero, about section, features, and stats on the homepage.</p>
        </div>

        <!-- Hero -->
        <div class="space-y-4 border-t border-[#1e293b] pt-6">
          <h4 class="text-sm font-semibold text-orange-400 uppercase tracking-wide">Hero</h4>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Background Video</label>
            <VideoInput v-model="landing.videoUrl" @change="saveLanding" />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Hero Title</label>
            <input v-model="landing.title" type="text" @blur="saveLanding" class="w-full px-4 py-2.5 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500" />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Hero Subtitle</label>
            <textarea v-model="landing.subtitle" rows="2" @blur="saveLanding" class="w-full px-4 py-2.5 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Primary CTA</label>
              <input v-model="landing.ctaText" type="text" @blur="saveLanding" class="w-full px-4 py-2.5 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500" />
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Secondary CTA</label>
              <input v-model="landing.ctaSecondaryText" type="text" @blur="saveLanding" class="w-full px-4 py-2.5 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500" />
            </div>
          </div>
        </div>

        <!-- About -->
        <div class="space-y-4 border-t border-[#1e293b] pt-6">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-semibold text-orange-400 uppercase tracking-wide">About Section</h4>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="landing.about.enabled" @change="saveLanding" class="sr-only peer">
              <div class="w-11 h-6 bg-[#111827] border border-[#1e293b] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">About Title</label>
            <input v-model="landing.about.title" type="text" @blur="saveLanding" class="w-full px-4 py-2.5 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500" />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">About Body</label>
            <textarea v-model="landing.about.body" rows="4" @blur="saveLanding" class="w-full px-4 py-2.5 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none"></textarea>
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">About Image URL</label>
            <div class="flex gap-2">
              <input v-model="landing.about.imageUrl" type="url" @blur="saveLanding" placeholder="https://..." class="flex-1 px-4 py-2.5 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500" />
              <CloudinaryUpload accept="image/*" @uploaded="url => { landing.about.imageUrl = url; saveLanding() }" class="w-32" />
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="space-y-4 border-t border-[#1e293b] pt-6">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-semibold text-orange-400 uppercase tracking-wide">Feature Cards</h4>
            <button type="button" @click="addFeature" class="text-xs text-orange-400 hover:text-white">+ Add</button>
          </div>
          <div v-for="(f, i) in landing.features" :key="i" class="p-4 rounded-xl bg-[#111827] border border-[#1e293b] space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-500">Feature {{ i + 1 }}</span>
              <button type="button" @click="removeFeature(i)" class="text-red-400 text-xs hover:text-red-300">Remove</button>
            </div>
            <div class="grid grid-cols-[60px_1fr] gap-3">
              <input v-model="f.icon" type="text" maxlength="4" @blur="saveLanding" placeholder="✨" class="px-2 py-2 bg-[#0B1120] border border-[#1e293b] rounded-lg text-white text-center text-lg" />
              <input v-model="f.title" type="text" @blur="saveLanding" placeholder="Title" class="px-3 py-2 bg-[#0B1120] border border-[#1e293b] rounded-lg text-white text-sm" />
            </div>
            <input v-model="f.description" type="text" @blur="saveLanding" placeholder="Description" class="w-full px-3 py-2 bg-[#0B1120] border border-[#1e293b] rounded-lg text-white text-sm" />
          </div>
        </div>

        <!-- Stats -->
        <div class="space-y-4 border-t border-[#1e293b] pt-6">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-semibold text-orange-400 uppercase tracking-wide">Stats Strip</h4>
            <button type="button" @click="addStat" class="text-xs text-orange-400 hover:text-white">+ Add</button>
          </div>
          <div v-for="(s, i) in landing.stats" :key="i" class="flex gap-3 items-center">
            <input v-model="s.value" type="text" @blur="saveLanding" placeholder="10k+" class="w-24 px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white text-sm font-bold" />
            <input v-model="s.label" type="text" @blur="saveLanding" placeholder="Label" class="flex-1 px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-lg text-white text-sm" />
            <button type="button" @click="removeStat(i)" class="text-red-400 text-sm px-2">×</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="saved" class="fixed bottom-6 right-6 px-5 py-3 bg-emerald-600 text-white rounded-xl shadow-lg text-sm font-medium">✓ Config saved</div>
    <div v-if="saveError" class="fixed bottom-6 right-6 px-5 py-3 bg-red-600 text-white rounded-xl shadow-lg text-sm font-medium max-w-sm">{{ saveError }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSiteConfigStore } from '../../stores/siteConfig'
import { useAuthStore } from '../../stores/auth'
import { mergeLandingPage, DEFAULT_LANDING_PAGE } from '../../constants/design'
import VideoInput from '../../components/ui/VideoInput.vue'
import CloudinaryUpload from '../../components/ui/CloudinaryUpload.vue'

const siteConfig = useSiteConfigStore()
const authStore = useAuthStore()

const loading = ref(true)
const saved = ref(false)
const saveError = ref('')
const maintenance = ref({ active: false, message: '' })
const banner = ref({ active: false, text: '' })
const landing = ref(mergeLandingPage(DEFAULT_LANDING_PAGE))
const featuredWalls = ref([])
const newFeatured = ref('')

const showSaved = () => {
  saved.value = true
  saveError.value = ''
  setTimeout(() => { saved.value = false }, 2000)
}

const showError = (message) => {
  saveError.value = message
  setTimeout(() => { saveError.value = '' }, 5000)
}

const fetchConfig = async () => {
  await siteConfig.fetchConfig()
  maintenance.value = { ...siteConfig.maintenance_mode }
  banner.value = { ...siteConfig.announcement_banner }
  landing.value = mergeLandingPage(siteConfig.landing_page)
  featuredWalls.value = [...siteConfig.featured_walls]
  loading.value = false
}

onMounted(fetchConfig)

const saveLanding = () => saveConfig('landing_page', landing.value)

const addFeature = () => {
  landing.value.features.push({ icon: '✨', title: 'New feature', description: 'Describe it here' })
  saveLanding()
}

const removeFeature = (i) => {
  landing.value.features.splice(i, 1)
  saveLanding()
}

const addStat = () => {
  landing.value.stats.push({ value: '0', label: 'New stat' })
  saveLanding()
}

const removeStat = (i) => {
  landing.value.stats.splice(i, 1)
  saveLanding()
}

const saveConfig = async (key, value) => {
  try {
    await siteConfig.saveConfig(key, value, authStore.adminUser?.id || null)
    showSaved()
  } catch (e) {
    showError(e.message || 'Failed to save config')
  }
}

const addFeatured = async () => {
  if (!newFeatured.value.trim()) return
  featuredWalls.value.push(newFeatured.value.trim().toLowerCase())
  newFeatured.value = ''
  await saveConfig('featured_walls', featuredWalls.value)
}

const removeFeatured = async (i) => {
  featuredWalls.value.splice(i, 1)
  await saveConfig('featured_walls', featuredWalls.value)
}
</script>
