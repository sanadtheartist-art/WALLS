<template>
  <div id="app" class="min-h-screen bg-bg text-text">
    <LoadingPage v-if="authStore.loading" />
    <template v-else>
      <div
        v-if="siteConfig.bannerActive && siteConfig.bannerText"
        class="bg-orange-600 text-white text-center text-sm py-2.5 px-4 z-50 relative"
      >
        {{ siteConfig.bannerText }}
      </div>
      <router-view />
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
