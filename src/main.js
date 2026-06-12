import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'

// Preload all available fonts from Google Fonts
const gfonts = [
  'Inter','Roboto','Poppins','Outfit','Space+Grotesk','DM+Mono','Plus+Jakarta+Sans','Syne',
  'Josefin+Sans','Bebas+Neue','Playfair+Display','Fira+Code','Raleway','DM+Sans'
].map(f => `family=${f}:wght@400;600;700;900`).join('&')
const fontLink = document.createElement('link')
fontLink.rel = 'stylesheet'
fontLink.href = `https://fonts.googleapis.com/css2?${gfonts}&display=swap`
document.head.appendChild(fontLink)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(MotionPlugin)

// Initialize auth before mounting
const initApp = async () => {
  const authStore = useAuthStore()
  await authStore.initializeAuth()
  app.mount('#app')
}

initApp()
