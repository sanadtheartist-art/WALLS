<template>
  <div class="p-4 sm:p-6 max-w-4xl space-y-4 sm:space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl sm:text-3xl font-bold text-white">Design Studio</h2>
        <p class="text-gray-500 mt-1 text-sm">Every choice saves instantly</p>
      </div>
      <div v-if="saved" class="flex items-center gap-2 text-emerald-400 text-xs sm:text-sm font-semibold">
        <span class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping"></span>
        Saved!
      </div>
    </div>

    <!-- ── Theme ──────────────────────────────────────────────────── -->
    <section class="bg-[#0B1120] border border-[#1e293b] rounded-2xl p-4 sm:p-6">
      <h3 class="text-base sm:text-lg font-bold text-white mb-4">🎨 Theme</h3>
      <div class="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        <button v-for="theme in themes" :key="theme.id" @click="pick('theme', theme.id)"
          class="flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border-2 transition-all"
          :class="user.theme === theme.id ? 'border-orange-500 bg-orange-500/10' : 'border-[#1e293b] hover:border-[#334155]'">
          <div class="w-full h-12 sm:h-14 rounded-lg" :class="theme.preview"></div>
          <span class="text-xs sm:text-sm font-medium text-white">{{ theme.label }}</span>
        </button>
      </div>
    </section>

    <!-- ── Accent Color ────────────────────────────────────────────── -->
    <section class="bg-[#0B1120] border border-[#1e293b] rounded-2xl p-4 sm:p-6">
      <h3 class="text-base sm:text-lg font-bold text-white mb-4">✨ Accent Color</h3>
      <div class="grid grid-cols-5 sm:grid-cols-8 gap-2 mb-4">
        <button v-for="p in palettes" :key="p.id" @click="pick('colorPalette', p.id); customAccent = ''"
          class="flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all"
          :class="user.colorPalette === p.id && !customAccent ? 'border-orange-500' : 'border-[#1e293b] hover:border-[#334155]'">
          <div class="w-6 h-6 rounded-full" :style="{ background: p.color }"></div>
          <span class="text-[10px] sm:text-xs text-gray-400">{{ p.label }}</span>
        </button>
      </div>
      <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
        <input type="color" v-model="customAccent" @input="pickCustomColor" class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-[#1e293b] cursor-pointer p-0.5 bg-transparent" />
        <div class="flex-1 min-w-[120px]">
          <div class="text-sm text-white font-medium">Custom Color</div>
          <div class="text-xs text-gray-500">Pick any color</div>
        </div>
        <input v-model="customAccent" type="text" placeholder="#7c3aed" class="w-full sm:max-w-36 px-3 py-2 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition-colors" @blur="pickCustomColor" />
      </div>
    </section>

    <!-- ── Background ─────────────────────────────────────────────── -->
    <section class="bg-[#0B1120] border border-[#1e293b] rounded-2xl p-4 sm:p-6">
      <h3 class="text-base sm:text-lg font-bold text-white mb-4">🖼 Page Background</h3>
      <div class="flex gap-2 mb-4 flex-wrap">
        <button v-for="bt in ['default','solid','gradient','image','video']" :key="bt"
          @click="pick('bgType', bt)"
          class="px-3 py-2 rounded-xl border text-xs sm:text-sm font-medium capitalize transition-all"
          :class="(user.bgType || 'default') === bt ? 'border-orange-500 bg-orange-500/10 text-orange-300' : 'border-[#1e293b] text-gray-400 hover:text-white'">
          {{ bt }}
        </button>
      </div>
      <div v-if="(user.bgType || 'default') === 'solid'" class="flex items-center gap-3">
        <input type="color" v-model="bgSolid" @input="saveBg" class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-[#1e293b] cursor-pointer p-0.5 bg-transparent" />
        <input v-model="bgSolid" type="text" class="w-full px-3 py-2.5 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition-colors flex-1" @blur="saveBg" placeholder="#0B1120" />
      </div>
      <div v-if="(user.bgType || 'default') === 'image'" class="space-y-3">
        <div class="flex items-center gap-3 flex-wrap">
          <input v-model="imageUrl" type="url" class="w-full flex-1 min-w-[150px] px-3 py-2.5 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition-colors" @blur="saveBg" placeholder="https://..." />
          <CloudinaryUpload accept="image/*" @uploaded="url => { imageUrl = url; saveBg() }" class="w-28 sm:w-32" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-xs text-gray-400">Background Blur: {{ bgBlur }}px</label>
          <input type="range" v-model.number="bgBlur" min="0" max="100" @change="saveBg" class="accent-orange-500" />
        </div>
      </div>
      <div v-if="(user.bgType || 'default') === 'video'" class="space-y-3">
        <VideoInput v-model="videoUrl" @change="saveBg" />
        <div class="flex flex-col gap-2">
          <label class="text-xs text-gray-400">Background Blur: {{ bgBlur }}px</label>
          <input type="range" v-model.number="bgBlur" min="0" max="100" @change="saveBg" class="accent-orange-500" />
        </div>
      </div>
      <div v-if="(user.bgType || 'default') === 'gradient'" class="space-y-3">
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="flex flex-col items-center gap-1">
            <input type="color" v-model="gradFrom" @input="saveBg" class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-[#1e293b] cursor-pointer p-0.5 bg-transparent" />
            <span class="text-xs text-gray-500">From</span>
          </div>
          <div class="flex-1 h-10 sm:h-12 rounded-xl border border-[#1e293b]" :style="{ background: gradPreview }"></div>
          <div class="flex flex-col items-center gap-1">
            <input type="color" v-model="gradTo" @input="saveBg" class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-[#1e293b] cursor-pointer p-0.5 bg-transparent" />
            <span class="text-xs text-gray-500">To</span>
          </div>
        </div>
        <select v-model="gradDir" class="w-full px-3 py-2.5 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 transition-colors" @change="saveBg">
          <option value="to bottom">↓ Top → Bottom</option>
          <option value="to right">→ Left → Right</option>
          <option value="135deg">↘ Diagonal</option>
          <option value="to bottom right">↘ Bottom Right</option>
          <option value="to top right">↗ Top Right</option>
          <option value="radial-gradient(circle, {from}, {to})">○ Radial</option>
        </select>
      </div>
    </section>

    <!-- ── Font ───────────────────────────────────────────────────── -->
    <section class="bg-[#0B1120] border border-[#1e293b] rounded-2xl p-4 sm:p-6">
      <h3 class="text-base sm:text-lg font-bold text-white mb-4">🔤 Font <span class="text-xs text-gray-500 font-normal">({{ fonts.length }} options)</span></h3>
      <div class="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        <button v-for="f in fonts" :key="f.id" @click="pick('font', f.id)"
          class="p-3 sm:p-4 rounded-xl border-2 transition-all text-left"
          :class="user.font === f.id ? 'border-orange-500 bg-orange-500/10' : 'border-[#1e293b] hover:border-[#334155]'">
          <div class="text-xl sm:text-2xl font-bold text-white mb-0.5" :style="{ fontFamily: f.family }">Aa</div>
          <div class="text-xs text-gray-400">{{ f.label }}</div>
          <div class="text-[10px] text-gray-600">{{ f.family.split(',')[0].replace(/'/g, '') }}</div>
        </button>
      </div>
    </section>

    <!-- ── Animation Style ────────────────────────────────────────── -->
    <section class="bg-[#0B1120] border border-[#1e293b] rounded-2xl p-4 sm:p-6">
      <h3 class="text-base sm:text-lg font-bold text-white mb-4">✨ Block Animation <span class="text-xs text-gray-500 font-normal">({{ animations.length }} styles)</span></h3>
      <div class="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        <button v-for="a in animations" :key="a.id" @click="pick('animationStyle', a.id)"
          class="flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all"
          :class="user.animationStyle === a.id ? 'border-orange-500 bg-orange-500/10' : 'border-[#1e293b] hover:border-[#334155]'">
          <Icon :icon="a.icon" class="w-5 h-5 sm:w-6 sm:h-6" />
          <span class="text-xs sm:text-sm font-medium text-white">{{ a.label }}</span>
        </button>
      </div>
    </section>

    <!-- ── Block Card Style ───────────────────────────────────────── -->
    <section class="bg-[#0B1120] border border-[#1e293b] rounded-2xl p-4 sm:p-6">
      <h3 class="text-base sm:text-lg font-bold text-white mb-4">🃏 Default Block Style</h3>
      <div class="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        <button v-for="s in blockStyles" :key="s.id" @click="pick('defaultBlockStyle', s.id)"
          class="flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all"
          :class="(user.defaultBlockStyle || 'default') === s.id ? 'border-orange-500 bg-orange-500/10' : 'border-[#1e293b] hover:border-[#334155]'">
          <div class="w-full h-8 sm:h-10 border rounded-md flex items-center justify-center text-xs text-gray-400" :class="s.preview">{{ s.label }}</div>
        </button>
      </div>
    </section>

    <!-- ── Ambient Effects ────────────────────────────────────────── -->
    <section class="bg-[#0B1120] border border-[#1e293b] rounded-2xl p-4 sm:p-6">
      <h3 class="text-base sm:text-lg font-bold text-white mb-4">🌌 Ambient Effects</h3>
      <p class="text-sm text-gray-500 mb-4">Extra atmosphere on your public wall page.</p>
      <div class="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        <button v-for="e in ambientEffects" :key="e.id" @click="pick('ambientEffect', e.id)"
          class="flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all"
          :class="(user.ambientEffect || 'none') === e.id ? 'border-orange-500 bg-orange-500/10' : 'border-[#1e293b] hover:border-[#334155]'">
          <Icon :icon="e.icon" class="w-5 h-5 sm:w-6 sm:h-6" />
          <span class="text-xs sm:text-sm font-medium text-white">{{ e.label }}</span>
        </button>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { Icon } from '@iconify/vue'
import CloudinaryUpload from '../../components/ui/CloudinaryUpload.vue'
import VideoInput from '../../components/ui/VideoInput.vue'
import { THEMES, PALETTES, FONTS, ANIMATIONS, BLOCK_STYLES, AMBIENT_EFFECTS } from '../../constants/design'

const authStore = useAuthStore()
const saved = ref(false)
const customAccent = ref('')
const bgSolid = ref('#0B1120')
const gradFrom = ref('#7c3aed')
const gradTo = ref('#3b82f6')
const gradDir = ref('to bottom right')
const bgBlur = ref(0)
const imageUrl = ref('')
const videoUrl = ref('')

const user = computed(() => authStore.user ?? {})
const themes = THEMES
const palettes = PALETTES
const fonts = FONTS
const animations = ANIMATIONS
const blockStyles = BLOCK_STYLES
const ambientEffects = AMBIENT_EFFECTS

const gradPreview = computed(() => `linear-gradient(${gradDir.value}, ${gradFrom.value}, ${gradTo.value})`)

onMounted(() => {
  if (user.value.customAccentColor) customAccent.value = user.value.customAccentColor
  if (user.value.bgSolid) bgSolid.value = user.value.bgSolid
  if (user.value.bgGradFrom) gradFrom.value = user.value.bgGradFrom
  if (user.value.bgGradTo)   gradTo.value   = user.value.bgGradTo
  if (user.value.bgGradDir)  gradDir.value  = user.value.bgGradDir
  if (user.value.bgBlur !== undefined) bgBlur.value = user.value.bgBlur
  if (user.value.imageUrl) imageUrl.value = user.value.imageUrl
  if (user.value.videoUrl) videoUrl.value = user.value.videoUrl
})

const showSaved = () => {
  saved.value = true
  setTimeout(() => saved.value = false, 1600)
}

const pick = async (key, value) => {
  await authStore.updateDesign({ [key]: value })
  showSaved()
}

const pickCustomColor = async () => {
  if (!customAccent.value) return
  await authStore.updateDesign({ customAccentColor: customAccent.value, colorPalette: 'custom' })
  showSaved()
}

const saveBg = async () => {
  const bgType = user.value.bgType || 'default'
  if (bgType === 'solid') {
    await authStore.updateDesign({ bgSolid: bgSolid.value })
  } else if (bgType === 'gradient') {
    await authStore.updateDesign({ 
      bgGradFrom: gradFrom.value, 
      bgGradTo: gradTo.value, 
      bgGradDir: gradDir.value,
      bgBlur: bgBlur.value 
    })
  } else if (bgType === 'image') {
    await authStore.updateDesign({ imageUrl: imageUrl.value, bgBlur: bgBlur.value })
  } else if (bgType === 'video') {
    await authStore.updateDesign({ videoUrl: videoUrl.value, bgBlur: bgBlur.value })
  }
  showSaved()
}
</script>


