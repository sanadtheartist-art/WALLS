import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons()
  ],
  theme: {
    colors: {
      // Navy/Orange palette as default
      bg: '#0B1120',
      surface: '#111827',
      text: '#f8fafc',
      accent: '#f97316',
      muted: '#1e293b',
      glow: '#f9731666'
    }
  }
})
