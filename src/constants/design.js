export const THEMES = [
  { id: 'midnight', label: 'Midnight', preview: 'bg-[#0B1120]' },
  { id: 'glass', label: 'Glass', preview: 'bg-gradient-to-br from-indigo-900 to-black' },
  { id: 'aurora', label: 'Aurora', preview: 'bg-gradient-to-br from-teal-900 via-purple-900 to-pink-900' },
  { id: 'neon', label: 'Neon', preview: 'bg-black border border-[#39ff14]/30' },
  { id: 'sunset', label: 'Sunset', preview: 'bg-gradient-to-br from-orange-600 via-rose-600 to-purple-900' },
  { id: 'candy', label: 'Candy', preview: 'bg-gradient-to-br from-pink-400 via-amber-500 to-orange-600' },
  { id: 'retro', label: 'Retro', preview: 'bg-gradient-to-br from-amber-200 via-orange-400 to-red-500' },
  { id: 'cyber', label: 'Cyber', preview: 'bg-gradient-to-br from-blue-500/40 via-black to-amber-600/40' },
  { id: 'pastel', label: 'Pastel', preview: 'bg-gradient-to-br from-sky-200 via-orange-200 to-pink-200' },
  { id: 'noir', label: 'Noir', preview: 'bg-gradient-to-br from-zinc-900 via-neutral-900 to-black' },
]

export const PALETTES = [
  { id: 'orange', label: 'Violet', color: '#7c3aed' },
  { id: 'blue', label: 'Blue', color: '#3b82f6' },
  { id: 'rose', label: 'Rose', color: '#e11d48' },
  { id: 'emerald', label: 'Emerald', color: '#10b981' },
  { id: 'amber', label: 'Amber', color: '#f59e0b' },
  { id: 'cyan', label: 'Cyan', color: '#06b6d4' },
  { id: 'fuchsia', label: 'Fuchsia', color: '#d946ef' },
  { id: 'lime', label: 'Lime', color: '#84cc16' },
  { id: 'orange', label: 'Orange', color: '#f97316' },
  { id: 'teal', label: 'Teal', color: '#14b8a6' },
  { id: 'pink', label: 'Pink', color: '#ec4899' },
  { id: 'indigo', label: 'Indigo', color: '#6366f1' },
  { id: 'red', label: 'Red', color: '#ef4444' },
  { id: 'gold', label: 'Gold', color: '#eab308' },
  { id: 'mint', label: 'Mint', color: '#2dd4bf' },
  { id: 'lavender', label: 'Lavender', color: '#a78bfa' },
]

export const FONTS = [
  { id: 'inter', label: 'Inter', family: 'Inter, sans-serif' },
  { id: 'roboto', label: 'Roboto', family: 'Roboto, sans-serif' },
  { id: 'poppins', label: 'Poppins', family: 'Poppins, sans-serif' },
  { id: 'outfit', label: 'Outfit', family: 'Outfit, sans-serif' },
  { id: 'plus-jakarta', label: 'Plus Jakarta', family: '"Plus Jakarta Sans", sans-serif' },
  { id: 'space-grotesk', label: 'Space Grotesk', family: '"Space Grotesk", sans-serif' },
  { id: 'syne', label: 'Syne', family: 'Syne, sans-serif' },
  { id: 'dm-sans', label: 'DM Sans', family: '"DM Sans", sans-serif' },
  { id: 'raleway', label: 'Raleway', family: 'Raleway, sans-serif' },
  { id: 'josefin-sans', label: 'Josefin Sans', family: '"Josefin Sans", sans-serif' },
  { id: 'playfair', label: 'Playfair', family: '"Playfair Display", serif' },
  { id: 'bebas-neue', label: 'Bebas Neue', family: '"Bebas Neue", cursive' },
  { id: 'space', label: 'Space Mono', family: '"Space Mono", monospace' },
  { id: 'dm-mono', label: 'DM Mono', family: '"DM Mono", monospace' },
  { id: 'fira-code', label: 'Fira Code', family: '"Fira Code", monospace' },
]

export const ANIMATIONS = [
  { id: 'fade-up', label: 'Fade Up', icon: 'lucide:arrow-up' },
  { id: 'slide-in', label: 'Slide In', icon: 'lucide:arrow-right' },
  { id: 'zoom', label: 'Zoom', icon: 'lucide:zoom-in' },
  { id: 'bounce', label: 'Bounce', icon: 'lucide:move-up' },
  { id: 'flip', label: 'Flip', icon: 'lucide:flip-horizontal' },
  { id: 'spin-in', label: 'Spin In', icon: 'lucide:rotate-cw' },
  { id: 'jelly', label: 'Jelly', icon: 'lucide:sparkles' },
  { id: 'pop', label: 'Pop', icon: 'lucide:circle-dot' },
  { id: 'wave', label: 'Wave', icon: 'lucide:audio-lines' },
  { id: 'none', label: 'None', icon: 'lucide:minus' },
]

export const BLOCK_STYLES = [
  { id: 'default', label: 'Default', preview: 'rounded-xl border-[#334155]' },
  { id: 'glass', label: 'Glass', preview: 'rounded-xl border-white/10 backdrop-blur' },
  { id: 'neon', label: 'Neon', preview: 'rounded-xl border-orange-500 shadow-lg' },
  { id: 'outline', label: 'Outline', preview: 'rounded-xl border-dashed border-gray-500' },
  { id: 'minimal', label: 'Minimal', preview: 'rounded-none border-transparent' },
  { id: 'pill', label: 'Pill', preview: 'rounded-full border-[#334155]' },
  { id: 'neo-brutal', label: 'Neo Brutal', preview: 'rounded-none border-2 border-black shadow-[4px_4px_0_#fff]' },
  { id: 'gradient-border', label: 'Gradient', preview: 'rounded-xl border-2 border-orange-500' },
  { id: 'shadow-pop', label: 'Shadow Pop', preview: 'rounded-2xl shadow-lg border-transparent' },
  { id: 'retro', label: 'Retro', preview: 'rounded-sm border-amber-400/50' },
  { id: 'sticker', label: 'Sticker', preview: 'rounded-2xl rotate-1 border-dashed' },
]

export const AMBIENT_EFFECTS = [
  { id: 'none', label: 'None', icon: 'lucide:circle-off' },
  { id: 'particles', label: 'Particles', icon: 'lucide:sparkle' },
  { id: 'glow', label: 'Glow Orbs', icon: 'lucide:sun' },
  { id: 'rain', label: 'Rain', icon: 'lucide:cloud-rain' },
  { id: 'stars', label: 'Stars', icon: 'lucide:star' },
]

export const FONT_FAMILY_MAP = {
  inter: 'Inter',
  roboto: 'Roboto',
  poppins: 'Poppins',
  outfit: 'Outfit',
  'plus-jakarta': 'Plus+Jakarta+Sans',
  'space-grotesk': 'Space+Grotesk',
  syne: 'Syne',
  'dm-sans': 'DM+Sans',
  raleway: 'Raleway',
  'josefin-sans': 'Josefin+Sans',
  playfair: 'Playfair+Display',
  'bebas-neue': 'Bebas+Neue',
  space: 'Space+Mono',
  'dm-mono': 'DM+Mono',
  'fira-code': 'Fira+Code',
  cabinet: 'Cabinet+Grotesk',
}

export const FONT_CSS_MAP = Object.fromEntries(FONTS.map((f) => [f.id, f.family]))

export const PALETTE_MAP = {
  violet: { accent: '#7c3aed', surface: '#111827', muted: '#1e293b', bg: '#0B1120' },
  blue: { accent: '#3b82f6', surface: '#0f1b2e', muted: '#1e3a5f', bg: '#080f1a' },
  rose: { accent: '#f43f5e', surface: '#2e0f17', muted: '#5c1e2e', bg: '#1a080c' },
  emerald: { accent: '#10b981', surface: '#0f2e1e', muted: '#1e5c3a', bg: '#081a10' },
  amber: { accent: '#f59e0b', surface: '#2e1f0f', muted: '#5c3e1e', bg: '#1a1208' },
  cyan: { accent: '#06b6d4', surface: '#0f252e', muted: '#1e4d5c', bg: '#08151a' },
  fuchsia: { accent: '#d946ef', surface: '#2a0f2e', muted: '#5c1e5c', bg: '#18081a' },
  lime: { accent: '#84cc16', surface: '#1a2e0f', muted: '#3a5c1e', bg: '#0f1a08' },
  orange: { accent: '#f97316', surface: '#111827', muted: '#1e293b', bg: '#0B1120' },
  teal: { accent: '#14b8a6', surface: '#0f2e2a', muted: '#1e5c56', bg: '#081a18' },
  pink: { accent: '#ec4899', surface: '#2e0f1e', muted: '#5c1e3a', bg: '#1a0812' },
  indigo: { accent: '#6366f1', surface: '#13132e', muted: '#2a2a5c', bg: '#0a0a1a' },
  red: { accent: '#ef4444', surface: '#2e0f0f', muted: '#5c1e1e', bg: '#1a0808' },
  gold: { accent: '#eab308', surface: '#2e260f', muted: '#5c4a1e', bg: '#1a1508' },
  mint: { accent: '#2dd4bf', surface: '#0f2e28', muted: '#1e5c52', bg: '#081a16' },
  lavender: { accent: '#a78bfa', surface: '#1a152e', muted: '#3b2a5c', bg: '#0d0a14' },
}

export const DEFAULT_LANDING_PAGE = {
  videoUrl: '',
  title: 'Walls',
  subtitle: 'Your personal link-in-bio canvas — but make it iconic.',
  ctaText: 'Claim your link',
  ctaSecondaryText: 'See featured walls',
  about: {
    enabled: true,
    title: 'Not another boring link page',
    body: 'Walls is where creators, artists, and weirdos build pages that actually feel like them. Pick wild fonts, chaotic animations, neon themes — or keep it clean. Your wall, your rules.',
    imageUrl: '',
  },
  features: [
    { icon: '✨', title: 'Instant personality', description: 'Themes, fonts, and animations that slap — not spreadsheet energy.' },
    { icon: '🎨', title: 'Design playground', description: 'Glass, neon, retro, brutalist blocks. Mix styles like a mood board.' },
    { icon: '🔗', title: 'One link, everything', description: 'Socials, videos, galleries, custom code — all in one gorgeous page.' },
    { icon: '⚡', title: 'Live in 60 seconds', description: 'Sign up, drag blocks, publish. No PhD in web design required.' },
  ],
  stats: [
    { value: '∞', label: 'Vibes available' },
    { value: '60s', label: 'To go live' },
    { value: '100%', label: 'Your aesthetic' },
    { value: '0', label: 'Boring templates' },
  ],
}

export function mergeLandingPage(config = {}) {
  return {
    ...DEFAULT_LANDING_PAGE,
    ...config,
    about: { ...DEFAULT_LANDING_PAGE.about, ...(config.about || {}) },
    features: config.features?.length ? config.features : DEFAULT_LANDING_PAGE.features,
    stats: config.stats?.length ? config.stats : DEFAULT_LANDING_PAGE.stats,
  }
}

export function getAnimationFrom(style) {
  switch (style) {
    case 'slide-in':
      return { from: { opacity: 0, x: -32 }, to: { opacity: 1, x: 0, y: 0, scale: 1 }, ease: 'power3.out' }
    case 'zoom':
      return { from: { opacity: 0, scale: 0.92 }, to: { opacity: 1, x: 0, y: 0, scale: 1 }, ease: 'back.out(1.4)' }
    case 'bounce':
      return { from: { opacity: 0, y: 48 }, to: { opacity: 1, x: 0, y: 0, scale: 1 }, ease: 'bounce.out' }
    case 'flip':
      return { from: { opacity: 0, rotateX: 90 }, to: { opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0 }, ease: 'power2.out' }
    case 'spin-in':
      return { from: { opacity: 0, rotate: -180, scale: 0.5 }, to: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }, ease: 'back.out(2)' }
    case 'jelly':
      return { from: { opacity: 0, scale: 0.3 }, to: { opacity: 1, x: 0, y: 0, scale: 1 }, ease: 'elastic.out(1, 0.6)' }
    case 'pop':
      return { from: { opacity: 0, scale: 0 }, to: { opacity: 1, x: 0, y: 0, scale: 1 }, ease: 'back.out(3)' }
    case 'wave':
      return { from: { opacity: 0, y: 20 }, to: { opacity: 1, x: 0, y: 0, scale: 1 }, ease: 'sine.out', stagger: 0.12 }
    case 'none':
      return null
    default:
      return { from: { opacity: 0, y: 24 }, to: { opacity: 1, x: 0, y: 0, scale: 1 }, ease: 'power3.out' }
  }
}

export function getLinkBlockClass(style, block) {
  const base = block?.data?.bgColor ? '' : ''
  if (block?.data?.bgColor) return base

  switch (style || block?.style || 'default') {
    case 'glass':
      return 'backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10'
    case 'neon':
      return 'border-[var(--color-accent)] bg-transparent hover:bg-[var(--color-accent)]/10 shadow-[0_0_20px_var(--color-accent)]'
    case 'outline':
      return 'bg-transparent border-[var(--color-muted)] hover:border-[var(--color-accent)]'
    case 'minimal':
      return 'border-transparent bg-transparent hover:bg-[var(--color-surface)]'
    case 'neo-brutal':
      return 'rounded-none border-2 border-white bg-[var(--color-surface)] shadow-[4px_4px_0_var(--color-accent)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_var(--color-accent)]'
    case 'gradient-border':
      return 'bg-[var(--color-surface)] border-2 border-transparent bg-clip-padding hover:shadow-[0_0_24px_var(--color-accent)]'
    case 'shadow-pop':
      return 'bg-[var(--color-surface)] border-transparent shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_var(--color-accent)] hover:-translate-y-1'
    case 'retro':
      return 'rounded-sm border-2 border-amber-400/60 bg-amber-950/30 hover:bg-amber-900/40 font-mono'
    case 'sticker':
      return 'rounded-2xl border-2 border-dashed border-[var(--color-accent)] bg-[var(--color-surface)] rotate-1 hover:-rotate-1 transition-transform'
    case 'pill':
      return 'rounded-full bg-[var(--color-surface)] border-[var(--color-muted)] hover:border-[var(--color-accent)]'
    default:
      return 'bg-[var(--color-surface)] border-[var(--color-muted)] hover:border-[var(--color-accent)]'
  }
}

export function getThemeBackground(theme) {
  switch (theme) {
    case 'glass':
      return { background: 'linear-gradient(135deg, #0d0535, #000)' }
    case 'aurora':
      return { background: '#060612' }
    case 'neon':
      return { background: '#000' }
    case 'sunset':
      return { background: 'linear-gradient(160deg, #1a0a0a 0%, #3d1a0a 40%, #1a0a2e 100%)' }
    case 'candy':
      return { background: 'linear-gradient(160deg, #1a0820 0%, #2e0a3d 50%, #0a1a2e 100%)' }
    case 'retro':
      return { background: 'linear-gradient(180deg, #1a1208 0%, #2e1a0a 100%)' }
    case 'cyber':
      return { background: 'linear-gradient(135deg, #020617 0%, #0c1929 50%, #1a0a2e 100%)' }
    case 'pastel':
      return { background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)' }
    case 'noir':
      return { background: 'linear-gradient(180deg, #0a0a0a 0%, #171717 100%)' }
    default:
      return { background: 'var(--color-bg)' }
  }
}
