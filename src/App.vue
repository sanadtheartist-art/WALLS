<template>
  <div id="app" class="min-h-screen bg-bg text-text">
    <LoadingPage v-if="authStore.loading" />
    <template v-else>
      <!-- Announcement Banner -->
      <div
        v-if="siteConfig.bannerActive && siteConfig.bannerText"
        class="fixed top-0 left-0 right-0 z-[60] bg-orange-600 text-white text-center text-sm py-2.5 px-4"
      >
        {{ siteConfig.bannerText }}
      </div>
      
      <!-- Main Content -->
      <div :class="{ 'pt-10': siteConfig.bannerActive && siteConfig.bannerText }">
        <router-view />
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useSiteConfigStore } from './stores/siteConfig'
import LoadingPage from './components/LoadingPage.vue'

const authStore = useAuthStore()
const siteConfig = useSiteConfigStore()

onMounted(() => {
  siteConfig.fetchConfig()
})
</script>
