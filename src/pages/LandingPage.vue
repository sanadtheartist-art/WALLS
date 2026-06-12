<template>
  <div class="min-h-screen bg-[#0B1120] text-white overflow-x-hidden">
    <!-- Ambient orbs -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="landing-orb absolute -top-32 -left-32 w-96 h-96 rounded-full bg-orange-600/20 blur-[120px]"></div>
      <div class="landing-orb absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-amber-600/15 blur-[100px]"></div>
      <div class="landing-orb absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-blue-500/10 blur-[90px]"></div>
    </div>

    <!-- Header -->
    <header 
      class="fixed left-0 right-0 z-50 px-6 py-5 flex items-center justify-between backdrop-blur-md bg-black/20 border-b border-white/5"
      :class="{ 'top-10': siteConfig.bannerActive && siteConfig.bannerText, 'top-0': !(siteConfig.bannerActive && siteConfig.bannerText) }"
    >
      <div class="text-white font-black text-2xl tracking-tighter">WALLS<span class="text-orange-400">.</span></div>
      <nav class="hidden md:flex items-center gap-8 text-sm text-gray-400">
        <a href="#about" class="hover:text-white transition-colors">About</a>
        <a href="#features" class="hover:text-white transition-colors">Features</a>
        <a v-if="featuredUsers.length" href="#featured" class="hover:text-white transition-colors">Featured</a>
      </nav>
      <div class="flex gap-3">
        <router-link to="/login" class="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Log In</router-link>
        <router-link to="/signup" class="px-5 py-2 text-sm font-bold bg-white text-black rounded-full hover:scale-105 transition-transform shadow-lg shadow-white/10">
          Sign Up
        </router-link>
      </div>
    </header>

    <!-- Hero -->
    <section 
      class="relative min-h-screen flex flex-col items-center justify-center px-6 pb-16 z-10"
      :class="{ 'pt-32': siteConfig.bannerActive && siteConfig.bannerText, 'pt-24': !(siteConfig.bannerActive && siteConfig.bannerText) }"
    >
      <div class="absolute inset-0 z-0 overflow-hidden">
        <div v-if="landingConfig.videoUrl" class="w-full h-full opacity-50">
          <VideoPlayer :url="landingConfig.videoUrl" autoplay loop muted cover background />
        </div>
        <div v-else class="w-full h-full bg-gradient-to-br from-[#0d0535] via-[#0B1120] to-[#1a0b2e]"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-[#0B1120]"></div>
      </div>

      <div class="relative z-10 text-center max-w-5xl mx-auto">
        <div class="landing-reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-300 text-xs font-semibold uppercase tracking-widest mb-8">
          ✦ The link-in-bio that has taste
        </div>
        <h1 class="landing-reveal text-5xl sm:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-[0.95]">
          <span class="bg-gradient-to-r from-white via-orange-200 to-amber-300 bg-clip-text text-transparent">
            {{ landingConfig.title }}
          </span>
        </h1>
        <p class="landing-reveal text-lg sm:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          {{ landingConfig.subtitle }}
        </p>
        <div class="landing-reveal flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/signup" class="group px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold rounded-full text-lg shadow-[0_0_40px_rgba(249,115,22,0.45)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(245,158,11,0.5)]">
            {{ landingConfig.ctaText || 'Claim your link' }}
          </router-link>
          <a href="#featured" class="px-8 py-4 border border-white/20 text-white font-semibold rounded-full text-lg hover:bg-white/5 transition-all text-center">
            {{ landingConfig.ctaSecondaryText || 'See featured walls' }}
          </a>
        </div>
      </div>

      <!-- Stats strip -->
      <div v-if="landingConfig.stats?.length" class="landing-reveal relative z-10 mt-20 w-full max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="(stat, i) in landingConfig.stats" :key="i" class="text-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div class="text-2xl sm:text-3xl font-black text-white">{{ stat.value }}</div>
          <div class="text-xs sm:text-sm text-gray-400 mt-1">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- About -->
    <section v-if="landingConfig.about?.enabled" id="about" class="relative z-10 py-24 px-6">
      <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div class="landing-section">
          <p class="text-orange-400 text-sm font-semibold uppercase tracking-widest mb-4">About Walls</p>
          <h2 class="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">{{ landingConfig.about.title }}</h2>
          <p class="text-gray-400 text-lg leading-relaxed whitespace-pre-line">{{ landingConfig.about.body }}</p>
          <router-link to="/signup" class="inline-flex mt-8 px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
            Start building →
          </router-link>
        </div>
        <div class="landing-section relative">
          <div class="absolute -inset-4 bg-gradient-to-br from-orange-600/20 to-amber-600/20 rounded-3xl blur-2xl"></div>
          <div class="relative rounded-3xl overflow-hidden border border-white/10 aspect-[4/3] bg-gradient-to-br from-orange-900/40 to-amber-900/20">
            <img v-if="landingConfig.about.imageUrl" :src="landingConfig.about.imageUrl" alt="About Walls" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex flex-col items-center justify-center p-8 text-center">
              <div class="text-6xl mb-4">🧱</div>
              <p class="text-xl font-bold text-white/80">Your canvas awaits</p>
              <p class="text-sm text-gray-500 mt-2">Upload an image in admin config</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section v-if="landingConfig.features?.length" id="features" class="relative z-10 py-24 px-6 bg-gradient-to-b from-transparent via-orange-950/20 to-transparent">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16 landing-section">
          <p class="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4">Why Walls hits different</p>
          <h2 class="text-4xl sm:text-5xl font-black text-white">Built for people with opinions</h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            v-for="(feature, i) in landingConfig.features"
            :key="i"
            class="landing-feature group p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(249,115,22,0.15)]"
          >
            <div class="text-3xl mb-4 group-hover:scale-110 transition-transform">{{ feature.icon }}</div>
            <h3 class="text-lg font-bold text-white mb-2">{{ feature.title }}</h3>
            <p class="text-sm text-gray-400 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Walls -->
    <section id="featured" class="relative z-10 py-24 px-6">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-12 landing-section">
          <p class="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">Community picks</p>
          <h2 class="text-4xl font-black text-white">Featured Walls</h2>
        </div>
        <div v-if="featuredUsers.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link
            v-for="user in featuredUsers"
            :key="user.username"
            :to="`/${user.username}`"
            class="landing-feature group flex flex-col rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
          >
            <!-- Wall Preview Iframe -->
            <div class="relative w-full aspect-[9/16] bg-[#0B1120] overflow-hidden border-b border-white/10">
              <div class="absolute inset-0 z-10 pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-300"></div>
              <iframe
                :src="`/${user.username}`"
                class="absolute top-0 left-0 w-full h-full pointer-events-none"
                frameborder="0"
                scrolling="no"
                tabindex="-1"
              ></iframe>
            </div>
            
            <!-- User Info -->
            <div class="p-5 flex items-center gap-4 bg-gradient-to-t from-black/40 to-transparent">
              <img v-if="user.avatar_url" :src="user.avatar_url" :alt="user.display_name || user.username" class="w-12 h-12 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-blue-500/40 transition-all shadow-lg" />
              <div v-else class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center text-white font-black text-xl shadow-lg ring-2 ring-white/10">
                {{ (user.display_name || user.username).charAt(0).toUpperCase() }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-white font-bold truncate group-hover:text-blue-300 transition-colors text-lg">{{ user.display_name || user.username }}</div>
                <div class="text-gray-400 text-sm truncate group-hover:text-gray-300 transition-colors">@{{ user.username }}</div>
              </div>
              <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </div>
            </div>
          </router-link>
        </div>
        <div v-else class="text-center p-12 bg-white/5 border border-white/10 rounded-2xl">
          <div class="text-4xl mb-4">✨</div>
          <h3 class="text-xl font-bold text-white mb-2">Featured walls coming soon</h3>
          <p class="text-gray-400">Be the first to get featured by creating your own wall!</p>
          <router-link to="/signup" class="inline-flex mt-6 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold rounded-full hover:scale-105 transition-transform">
            Claim your link
          </router-link>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="relative z-10 py-24 px-6">
      <div class="max-w-3xl mx-auto text-center landing-section">
        <div class="p-12 rounded-3xl bg-gradient-to-br from-orange-600/20 via-amber-600/10 to-transparent border border-orange-500/20 backdrop-blur-sm">
          <h2 class="text-3xl sm:text-5xl font-black text-white mb-4">Ready to make it yours?</h2>
          <p class="text-gray-400 mb-8 text-lg">Free to start. Zero boring templates. Maximum main character energy.</p>
          <router-link to="/signup" class="inline-flex px-10 py-4 bg-white text-black font-black rounded-full text-lg hover:scale-105 transition-transform shadow-xl">
            {{ landingConfig.ctaText || 'Claim your link' }} →
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative z-10 py-8 px-6 border-t border-white/5 text-center text-gray-600 text-sm">
      © {{ new Date().getFullYear() }} Walls — built for creators who refuse to be basic.
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSiteConfigStore } from '../stores/siteConfig'
import { mergeLandingPage } from '../constants/design'
import VideoPlayer from '../components/ui/VideoPlayer.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const siteConfig = useSiteConfigStore()

const landingConfig = computed(() => mergeLandingPage(siteConfig.landing_page))
const featuredUsers = computed(() => siteConfig.featuredUsers)

onMounted(async () => {
  if (!siteConfig.loaded) await siteConfig.fetchConfig()

  gsap.to('.landing-orb', {
    x: '+=30',
    y: '+=20',
    duration: 8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: 0.4,
  })

  gsap.from('.landing-reveal', {
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.12,
    ease: 'power4.out',
    delay: 0.15,
  })

  gsap.utils.toArray('.landing-section, .landing-feature').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      y: 32,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
  })
})
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
</style>
