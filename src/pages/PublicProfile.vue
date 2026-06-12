<template>
  <div>
    <!-- Custom Loading Overlay -->
    <transition name="fade">
      <div v-if="showCustomLoading" class="fixed inset-0 z-50 flex flex-col items-center justify-center" :style="{ backgroundColor: user?.loadingBgColor || '#000000' }">
        <div class="font-bold tracking-[0.2em] uppercase" 
             :class="[user?.loadingTextSize || 'text-3xl', user?.loadingAnimation || 'animate-pulse']"
             :style="{ color: user?.loadingTextColor || '#ffffff' }">
          {{ user?.loadingText }}
        </div>
      </div>
    </transition>

    <!-- Main page wrapper -->
    <div
      class="min-h-screen flex flex-col items-center relative overflow-x-hidden transition-all duration-700"
      :class="showCustomLoading ? 'opacity-0' : 'opacity-100'"
      :style="[cssVars, pageBgStyle]"
    >
      <!-- Theme ambient layers -->
      <div v-if="user?.theme === 'aurora'" class="fixed inset-0 pointer-events-none z-0">
        <div class="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" :style="{ background: `${getAccent()}33` }"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/15 blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl"></div>
      </div>
      <div v-else-if="user?.theme === 'neon'" class="fixed inset-0 pointer-events-none z-0">
        <div class="absolute inset-0 bg-[linear-gradient(rgba(57,255,20,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
      <div v-else-if="user?.theme === 'sunset'" class="fixed inset-0 pointer-events-none z-0">
        <div class="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[100px]"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-rose-600/10 blur-[80px]"></div>
      </div>
      <div v-else-if="user?.theme === 'candy'" class="fixed inset-0 pointer-events-none z-0">
        <div class="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-pink-500/15 blur-[90px]"></div>
        <div class="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-orange-500/15 blur-[80px]"></div>
      </div>
      <div v-else-if="user?.theme === 'cyber'" class="fixed inset-0 pointer-events-none z-0">
        <div class="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.04)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div class="absolute top-0 right-1/4 w-64 h-64 rounded-full bg-blue-500/10 blur-[70px]"></div>
      </div>
      <div v-else-if="user?.theme === 'retro'" class="fixed inset-0 pointer-events-none z-0 opacity-30">
        <div class="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(251,191,36,0.03)_2px,rgba(251,191,36,0.03)_4px)]"></div>
      </div>

      <!-- User ambient effects -->
      <div v-if="user?.ambientEffect === 'particles'" class="fixed inset-0 pointer-events-none z-0 ambient-particles"></div>
      <div v-if="user?.ambientEffect === 'glow'" class="fixed inset-0 pointer-events-none z-0">
        <div class="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[100px]" :style="{ background: `${getAccent()}22` }"></div>
      </div>
      <div v-if="user?.ambientEffect === 'rain'" class="fixed inset-0 pointer-events-none z-0 ambient-rain opacity-20"></div>
      <div v-if="user?.ambientEffect === 'stars'" class="fixed inset-0 pointer-events-none z-0 ambient-stars"></div>

      <!-- Image Background -->
      <div v-if="(user?.bgType || 'default') === 'image' && user?.imageUrl" class="fixed inset-0 z-0 pointer-events-none"
           :style="{ backgroundImage: `url(${user.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: `blur(${user.bgBlur || 0}px)`, transform: user.bgBlur ? 'scale(1.1)' : 'none' }">
      </div>

      <!-- Video Background -->
      <div v-if="user?.bgType === 'video' && user?.videoUrl" class="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-60">
        <VideoPlayer
          :url="user.videoUrl"
          autoplay
          loop
          muted
          cover
          background
          :blur="user.bgBlur || 0"
        />
      </div>

      <!-- Loading spinner -->
      <div v-if="loading" class="flex items-center justify-center h-screen z-10 relative">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2" style="border-color: var(--color-accent)"></div>
      </div>

      <!-- Blocks -->
      <div v-else-if="user" class="w-full max-w-xl px-4 py-16 relative z-10" :style="fontStyle">
        <div class="space-y-3">
          <template v-for="block in visibleBlocks" :key="block.id">
            <component
              v-if="getBlockComponent(block.type)"
              :is="getBlockComponent(block.type)"
              :block="block"
              :default-style="user?.defaultBlockStyle"
              class="wall-block opacity-0 translate-y-6"
              @click="trackClick(block)"
            />
            <!-- Fallback link block -->
            <a v-else-if="block.type === 'link'"
              :href="block.data?.url"
              target="_blank" rel="noopener noreferrer"
              @click="trackEvent('click', block.id)"
              class="wall-block opacity-0 translate-y-6 flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 group"
              :style="block.data?.bgColor ? { background: block.data.bgColor, borderColor: 'transparent' } : {}"
              :class="linkClass(block)">
              <span class="flex-1 font-semibold text-[var(--color-text)] text-center">{{ block.data?.label }}</span>
              <span class="text-[var(--color-muted)] group-hover:translate-x-1 transition-transform text-sm shrink-0">↗</span>
            </a>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { db } from '../config/firebase'
import { doc, getDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { supabase } from '../config/supabase'
import gsap from 'gsap'

import HeroBlock    from '../components/blocks/types/HeroBlock.vue'
import AboutBlock   from '../components/blocks/types/AboutBlock.vue'
import ContactBlock from '../components/blocks/types/ContactBlock.vue'
import SocialBlock  from '../components/blocks/types/SocialBlock.vue'
import TextBlock    from '../components/blocks/types/TextBlock.vue'
import DividerBlock from '../components/blocks/types/DividerBlock.vue'
import VideoBlock   from '../components/blocks/types/VideoBlock.vue'
import GalleryBlock from '../components/blocks/types/GalleryBlock.vue'
import CustomBlock  from '../components/blocks/types/CustomBlock.vue'
import VideoPlayer  from '../components/ui/VideoPlayer.vue'
import {
  PALETTE_MAP,
  FONT_CSS_MAP,
  FONT_FAMILY_MAP,
  getAnimationFrom,
  getBlockClass,
  getThemeBackground,
} from '../constants/design'

const route  = useRoute()
const router = useRouter()
const username = ref(route.params.username)
const user   = ref(null)
const loading = ref(true)
const showCustomLoading = ref(false)
const blocks  = ref([])
let unsubscribeBlocks = null
let unsubscribeUser = null

const blockComponents = {
  hero: HeroBlock, about: AboutBlock, contact: ContactBlock,
  social: SocialBlock, text: TextBlock, divider: DividerBlock,
  video: VideoBlock, gallery: GalleryBlock, custom: CustomBlock
}
const getBlockComponent = (type) => blockComponents[type] ?? null
const visibleBlocks = computed(() => blocks.value.filter(b => b.visible !== false))

// ── Color palette map ─────────────────────────────────────────────────────────
const paletteMap = PALETTE_MAP

const getAccent = () => {
  if (user.value?.customAccentColor) return user.value.customAccentColor
  return paletteMap[user.value?.colorPalette]?.accent ?? '#7c3aed'
}

const cssVars = computed(() => {
  if (!user.value) return {}
  const p = paletteMap[user.value.colorPalette] ?? paletteMap.violet
  const accent = user.value.customAccentColor || p.accent
  return {
    '--color-bg':      p.bg,
    '--color-surface': p.surface,
    '--color-muted':   p.muted,
    '--color-accent':  accent,
    '--color-text':    '#ffffff',
  }
})

const pageBgStyle = computed(() => {
  if (!user.value) return {}
  const bgType = user.value.bgType || 'default'
  if (bgType === 'solid' && user.value.bgSolid) return { background: user.value.bgSolid }
  if (bgType === 'image' && user.value.imageUrl) return { backgroundColor: 'transparent' }
  if (bgType === 'gradient' && user.value.bgGradFrom) {
    const dir = user.value.bgGradDir || 'to bottom right'
    return { background: `linear-gradient(${dir}, ${user.value.bgGradFrom}, ${user.value.bgGradTo || '#3b82f6'})` }
  }
  if (bgType === 'video') return { background: '#000' }
  return getThemeBackground(user.value.theme)
})

const fontStyle = computed(() => ({
  fontFamily: FONT_CSS_MAP[user.value?.font] || 'Inter, sans-serif'
}))

const injectFont = (fontId) => {
  const name = FONT_FAMILY_MAP[fontId]
  if (!name || fontId === 'inter') return
  const id = `gfont-${fontId}`
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${name}:wght@400;600;700;900&display=swap`
  document.head.appendChild(link)
}

const linkClass = (block) => {
  const style = block.style || user.value?.defaultBlockStyle || 'default'
  return getBlockClass(style, block, user.value?.defaultBlockStyle)
}

// ── Analytics ─────────────────────────────────────────────────────────────────
const trackEvent = async (eventType, blockId = null) => {
  if (!user.value?.uid) return
  try {
    await supabase.from('analytics_events').insert({ 
      uid: user.value.uid, 
      block_id: blockId, 
      event_type: eventType,
      created_at: new Date().toISOString()
    })
  } catch (e) {
    console.error('Error tracking event:', e)
  }
}

const trackClick = (block) => {
  if (['link','social'].includes(block.type)) trackEvent('click', block.id)
}

// Track page view when profile loads
const trackPageView = async () => {
  if (user.value?.uid) {
    await trackEvent('view')
  }
}

// ── GSAP Animations ───────────────────────────────────────────────────────────
const triggerAnimations = () => {
  const style = user.value?.animationStyle || 'fade-up'
  const config = getAnimationFrom(style)
  nextTick(() => {
    gsap.set('.wall-block', { clearProps: 'all' })
    if (!config) {
      gsap.set('.wall-block', { opacity: 1 })
      return
    }
    gsap.fromTo('.wall-block',
      config.from,
      {
        ...config.to,
        duration: style === 'wave' ? 0.45 : 0.55,
        stagger: config.stagger ?? (style === 'wave' ? 0.12 : 0.09),
        ease: config.ease,
      }
    )
  })
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    const usernameDoc = await getDoc(doc(db, 'usernames', username.value))
    if (!usernameDoc.exists()) return router.push('/404')

    const uid = usernameDoc.data().uid

    unsubscribeUser = onSnapshot(doc(db, 'users', uid), (userDoc) => {
      if (!userDoc.exists()) return router.push('/404')
      
      const isInitialLoad = !user.value
      user.value = { uid, ...userDoc.data() }
      injectFont(user.value.font)
      
      if (isInitialLoad) {
        trackPageView()
        if (user.value.loadingText) {
          showCustomLoading.value = true
          setTimeout(() => {
            showCustomLoading.value = false
            triggerAnimations()
          }, 1500)
        }
      }

      // SEO Settings
      document.title = user.value.seoTitle || `${user.value.displayName || user.value.username} - Walls`
      if (user.value.seoDesc) {
        let metaDesc = document.querySelector('meta[name="description"]')
        if (!metaDesc) {
          metaDesc = document.createElement('meta')
          metaDesc.name = 'description'
          document.head.appendChild(metaDesc)
        }
        metaDesc.content = user.value.seoDesc
      }
    })

    const q = query(collection(db, 'users', uid, 'blocks'), orderBy('position'))
    unsubscribeBlocks = onSnapshot(q, (snap) => {
      blocks.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      if (!showCustomLoading.value) triggerAnimations()
    })
  } catch (e) {
    console.error('[PublicProfile]', e)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => { 
  if (unsubscribeBlocks) unsubscribeBlocks() 
  if (unsubscribeUser) unsubscribeUser()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.ambient-particles {
  background-image: radial-gradient(circle, var(--color-accent) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: drift 20s linear infinite;
}

.ambient-rain {
  background-image: linear-gradient(transparent 70%, var(--color-accent) 70%);
  background-size: 2px 16px;
  animation: rain 0.8s linear infinite;
}

.ambient-stars {
  background-image:
    radial-gradient(1px 1px at 20px 30px, white, transparent),
    radial-gradient(1px 1px at 80px 120px, white, transparent),
    radial-gradient(1px 1px at 160px 60px, white, transparent),
    radial-gradient(1px 1px at 240px 180px, white, transparent),
    radial-gradient(1px 1px at 320px 40px, white, transparent);
  background-size: 350px 200px;
  animation: twinkle 4s ease-in-out infinite alternate;
}

@keyframes drift {
  from { background-position: 0 0; }
  to { background-position: 40px 40px; }
}

@keyframes rain {
  from { background-position: 0 0; }
  to { background-position: -8px 16px; }
}

@keyframes twinkle {
  from { opacity: 0.4; }
  to { opacity: 1; }
}
</style>
