import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS()
  ],
  server: {
    port: 3000
  },
  build: {
    sourcemap: false
  },
  css: {
    devSourcemap: false
  },
  esbuild: {
    sourcemap: false
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore']
  }
})
