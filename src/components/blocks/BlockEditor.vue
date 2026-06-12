<template>
  <div class="space-y-5">

    <!-- ── LINK ──────────────────────────────────────────────────── -->
    <template v-if="block.type === 'link'">
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Button Label</label>
        <input v-model="form.label" type="text" class="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors" placeholder="Follow me on GitHub" @blur="autoSave" />
      </div>
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">URL</label>
        <input v-model="form.url" type="url" class="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors" placeholder="https://..." @blur="autoSave" />
      </div>
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Card Style</label>
        <div class="flex gap-2 flex-wrap">
          <button v-for="s in blockStyleOptions" :key="s"
            @click="blockStyle = s; autoSave()"
            class="px-3 py-1.5 rounded-lg border text-xs font-medium capitalize transition-all"
            :class="blockStyle === s ? 'bg-orange-500/25 border-orange-500/60 text-orange-200' : 'border-[#1e293b] text-gray-400 hover:text-white'">
            {{ s }}
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Custom Background Color</label>
        <div class="flex items-center gap-3">
          <input v-model="form.bgColor" type="color" class="w-10 h-10 rounded-xl border border-[#1e293b] cursor-pointer p-0.5 bg-transparent" @input="autoSave" />
          <input v-model="form.bgColor" type="text" class="field-input flex-1" placeholder="#7c3aed or leave empty" @blur="autoSave" />
          <button @click="form.bgColor = ''; autoSave()" class="text-xs text-gray-500 hover:text-red-400">✕ Clear</button>
        </div>
      </div>
    </template>

    <!-- ── SOCIAL ─────────────────────────────────────────────────── -->
    <template v-else-if="block.type === 'social'">
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Platform</label>
        <div class="grid grid-cols-4 gap-2">
          <button v-for="p in socialPlatforms" :key="p.value"
            @click="setSocialPlatform(p.value)"
            class="flex flex-col items-center gap-1 p-2 rounded-xl border transition-all"
            :class="form.platform === p.value ? 'border-orange-500/60 bg-orange-500/10 text-white' : 'border-[#1e293b] text-gray-400 hover:text-white'">
            <Icon :icon="p.icon" class="w-6 h-6 mb-1" />
            <span class="text-xs">{{ p.label }}</span>
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Profile URL</label>
        <input v-model="form.url" type="url" class="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors" placeholder="https://twitter.com/yourhandle" @blur="autoSave" />
      </div>
    </template>

    <!-- ── HERO ───────────────────────────────────────────────────── -->
    <template v-else-if="block.type === 'hero'">
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Heading</label>
        <input v-model="form.title" type="text" class="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors" placeholder="Welcome to my Wall" @blur="autoSave" />
      </div>
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Subtitle</label>
        <input v-model="form.subtitle" type="text" class="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors" placeholder="I build things for the web." @blur="autoSave" />
      </div>
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Background Type</label>
        <div class="flex gap-2 flex-wrap">
          <button v-for="bt in ['image','video','gradient','color']" :key="bt"
            @click="form.bgType = bt; autoSave()"
            class="px-3 py-1.5 rounded-lg border text-xs font-medium capitalize transition-all"
            :class="(form.bgType === bt || (bt === 'video' && form.bgType === 'youtube')) ? 'bg-orange-500/25 border-orange-500/60 text-orange-200' : 'border-[#1e293b] text-gray-400 hover:text-white'">
            {{ bt }}
          </button>
        </div>
      </div>
      <div v-if="form.bgType === 'image' || !form.bgType" class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Background Image</label>
        <div class="flex gap-2">
          <input v-model="form.imageUrl" type="url" class="field-input flex-1" placeholder="https://..." @blur="autoSave" />
          <CloudinaryUpload accept="image/*" @uploaded="url => { form.imageUrl = url; autoSave() }" class="w-32" />
        </div>
        <div v-if="form.imageUrl" class="mt-2 rounded-xl overflow-hidden h-24">
          <img :src="form.imageUrl" class="w-full h-full object-cover" />
        </div>
      </div>
      <div v-if="form.bgType === 'video' || form.bgType === 'youtube'" class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Background Video</label>
        <VideoInput
          :model-value="form.videoUrl || form.youtubeUrl || ''"
          @update:model-value="onHeroVideoChange"
        />
      </div>
      <div v-if="form.bgType === 'gradient'" class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Gradient Colors</label>
        <div class="flex items-center gap-3">
          <div class="flex flex-col items-center gap-1">
            <input v-model="form.gradientFrom" type="color" class="w-10 h-10 rounded-xl border border-[#1e293b] cursor-pointer p-0.5 bg-transparent" @input="autoSave" />
            <span class="text-xs text-gray-500">From</span>
          </div>
          <div class="flex-1 h-10 rounded-xl" :style="{ background: `linear-gradient(to right, ${form.gradientFrom || '#7c3aed'}, ${form.gradientTo || '#3b82f6'})` }"></div>
          <div class="flex flex-col items-center gap-1">
            <input v-model="form.gradientTo" type="color" class="w-10 h-10 rounded-xl border border-[#1e293b] cursor-pointer p-0.5 bg-transparent" @input="autoSave" />
            <span class="text-xs text-gray-500">To</span>
          </div>
        </div>
        <select v-model="form.gradientDir" class="field-input mt-2" @change="autoSave">
          <option value="to bottom">↓ Top to Bottom</option>
          <option value="to right">→ Left to Right</option>
          <option value="135deg">↘ Diagonal</option>
          <option value="to bottom right">↘ Bottom Right</option>
        </select>
      </div>
      <div v-if="form.bgType === 'color'" class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Background Color</label>
        <div class="flex items-center gap-3">
          <input v-model="form.solidColor" type="color" class="w-10 h-10 rounded-xl border border-[#1e293b] cursor-pointer p-0.5 bg-transparent" @input="autoSave" />
          <input v-model="form.solidColor" type="text" class="field-input flex-1" @blur="autoSave" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="flex flex-col gap-2 mb-4">
          <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">CTA Button Label</label>
          <input v-model="form.ctaLabel" type="text" class="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors" placeholder="Explore →" @blur="autoSave" />
        </div>
        <div class="flex flex-col gap-2 mb-4">
          <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">CTA Button URL</label>
          <input v-model="form.ctaUrl" type="url" class="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors" placeholder="https://..." @blur="autoSave" />
        </div>
      </div>
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Text Alignment</label>
        <div class="flex gap-2">
          <button v-for="a in ['left','center','right']" :key="a" @click="form.align = a; autoSave()"
            class="px-4 py-1.5 rounded-lg border text-xs capitalize transition-all"
            :class="(form.align || 'center') === a ? 'bg-orange-500/25 border-orange-500/60 text-white' : 'border-[#1e293b] text-gray-400'">
            {{ a }}
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Overlay Opacity</label>
        <input v-model.number="form.overlayOpacity" type="range" min="0" max="90" step="5" class="w-full accent-orange-500" @change="autoSave" />
        <span class="text-xs text-gray-500">{{ form.overlayOpacity ?? 50 }}%</span>
      </div>
    </template>

    <!-- ── ABOUT ──────────────────────────────────────────────────── -->
    <template v-else-if="block.type === 'about'">
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Display Name</label>
        <input v-model="form.name" type="text" class="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors" placeholder="Your Name" @blur="autoSave" />
      </div>
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Bio</label>
        <textarea v-model="form.bio" rows="4" class="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors" placeholder="Tell the world who you are..." @blur="autoSave"></textarea>
      </div>
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Avatar Image</label>
        <div class="flex gap-2">
          <input v-model="form.avatarUrl" type="url" class="field-input flex-1" placeholder="https://..." @blur="autoSave" />
          <CloudinaryUpload accept="image/*" @uploaded="url => { form.avatarUrl = url; autoSave() }" class="w-32" />
        </div>
        <div v-if="form.avatarUrl" class="mt-2 flex gap-3 items-center">
          <img :src="form.avatarUrl" class="w-12 h-12 rounded-full object-cover border border-[#1e293b]" />
          <span class="text-xs text-gray-500">Preview</span>
        </div>
      </div>
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Text Alignment</label>
        <div class="flex gap-2">
          <button v-for="a in ['left','center','right']" :key="a" @click="form.align = a; autoSave()"
            class="px-4 py-1.5 rounded-lg border text-xs capitalize transition-all"
            :class="(form.align || 'center') === a ? 'bg-orange-500/25 border-orange-500/60 text-white' : 'border-[#1e293b] text-gray-400'">
            {{ a }}
          </button>
        </div>
      </div>
    </template>

    <!-- ── CONTACT ────────────────────────────────────────────────── -->
    <template v-else-if="block.type === 'contact'">
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Section Title</label>
        <input v-model="form.title" type="text" class="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors" placeholder="Get In Touch" @blur="autoSave" />
      </div>
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Subtitle / Description</label>
        <input v-model="form.subtitle" type="text" class="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors" placeholder="I'd love to hear from you." @blur="autoSave" />
      </div>
    </template>

    <!-- ── TEXT ───────────────────────────────────────────────────── -->
    <template v-else-if="block.type === 'text'">
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Content</label>
        <textarea v-model="form.content" rows="5" class="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors" placeholder="Write something here..." @blur="autoSave"></textarea>
      </div>
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Text Size</label>
        <div class="flex gap-2">
          <button v-for="s in ['sm','base','lg','xl']" :key="s" @click="form.textSize = s; autoSave()"
            class="px-3 py-1.5 rounded-lg border text-xs capitalize transition-all"
            :class="(form.textSize || 'base') === s ? 'bg-orange-500/25 border-orange-500/60 text-white' : 'border-[#1e293b] text-gray-400'">
            {{ s }}
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Alignment</label>
        <div class="flex gap-2">
          <button v-for="a in ['left','center','right']" :key="a" @click="form.align = a; autoSave()"
            class="px-4 py-1.5 rounded-lg border text-xs capitalize transition-all"
            :class="(form.align || 'left') === a ? 'bg-orange-500/25 border-orange-500/60 text-white' : 'border-[#1e293b] text-gray-400'">
            {{ a }}
          </button>
        </div>
      </div>
    </template>

    <!-- ── VIDEO ──────────────────────────────────────────────────── -->
    <template v-else-if="block.type === 'video'">
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Video</label>
        <VideoInput v-model="form.url" @change="autoSave" />
      </div>
      <div v-if="form.url" class="rounded-xl overflow-hidden aspect-video bg-black">
        <VideoPlayer :url="form.url" controls />
      </div>
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Caption (optional)</label>
        <input v-model="form.caption" type="text" class="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors" placeholder="My latest video" @blur="autoSave" />
      </div>
    </template>

    <!-- ── DIVIDER ────────────────────────────────────────────────── -->
    <template v-else-if="block.type === 'divider'">
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Divider Style</label>
        <div class="flex gap-2 flex-wrap">
          <button v-for="s in ['line','dots','gradient','stars','wave']" :key="s"
            @click="form.style = s; autoSave()"
            class="px-3 py-1.5 rounded-lg border text-xs capitalize transition-all"
            :class="(form.style || 'line') === s ? 'bg-orange-500/25 border-orange-500/60 text-orange-200' : 'border-[#1e293b] text-gray-400 hover:text-white'">
            {{ s }}
          </button>
        </div>
      </div>
    </template>

    <!-- ── GALLERY ────────────────────────────────────────────────── -->
    <template v-else-if="block.type === 'gallery'">
      <div class="flex flex-col gap-2 mb-4">
        <div class="flex justify-between items-end mb-1">
          <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 mb-0">Image URLs <span class="text-gray-600">(one per line)</span></label>
          <CloudinaryUpload accept="image/*" @uploaded="url => addGalleryImage(url)" class="w-32" />
        </div>
        <textarea v-model="galleryImages" rows="5" class="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors" placeholder="https://...&#10;https://...&#10;https://..." @blur="saveGallery"></textarea>
      </div>
      <div v-if="previewImages.length" class="grid gap-2" :class="`grid-cols-${form.columns || 2}`">
        <img v-for="(img, i) in previewImages.slice(0, 6)" :key="i" :src="img" class="w-full aspect-square object-cover rounded-xl" />
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div class="flex flex-col gap-2 mb-4">
          <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Layout</label>
          <select v-model="form.layout" class="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors" @change="autoSave">
            <option value="grid">Grid</option>
            <option value="masonry">Masonry</option>
          </select>
        </div>
        <div class="flex flex-col gap-2 mb-4">
          <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Columns</label>
          <select v-model.number="form.columns" class="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors" @change="autoSave">
            <option :value="1">1</option>
            <option :value="2">2</option>
            <option :value="3">3</option>
          </select>
        </div>
        <div class="flex flex-col gap-2 mb-4">
          <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Gap</label>
          <select v-model="form.gap" class="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors" @change="autoSave">
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>
      </div>
    </template>

    <!-- ── CUSTOM CODE ────────────────────────────────────────────── -->
    <template v-else-if="block.type === 'custom'">
      <div class="flex flex-col gap-2 mb-4">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Custom Code <span class="text-gray-500 font-normal lowercase">(HTML, CSS, JS)</span></label>
        <textarea v-model="form.html" rows="12" class="w-full px-4 py-3 bg-[#111827] border border-[#1e293b] rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 resize-none transition-colors font-mono text-xs" placeholder="<style> .my-box { color: red; } </style>&#10;<div class='my-box'>Hello</div>&#10;<script> console.log('hi') </script>" @blur="autoSave"></textarea>
      </div>
    </template>

    <!-- ── CARD STYLE (ALL BLOCKS) ───────────────────────────────────── -->
    <div class="flex flex-col gap-2 pt-4 border-t border-[#1e293b]">
      <label class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Card Style</label>
      <div class="flex gap-2 flex-wrap">
        <button v-for="s in blockStyleOptions" :key="s"
          @click="blockStyle = s; autoSave()"
          class="px-3 py-1.5 rounded-lg border text-xs font-medium capitalize transition-all"
          :class="blockStyle === s ? 'bg-orange-500/25 border-orange-500/60 text-orange-200' : 'border-[#1e293b] text-gray-400 hover:text-white'">
          {{ s }}
        </button>
      </div>
    </div>

    <!-- Saved toast -->
    <div v-if="saved" class="flex items-center gap-2 text-emerald-400 text-xs font-medium">
      <span>✓</span> Saved!
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import CloudinaryUpload from '../ui/CloudinaryUpload.vue'
import VideoInput from '../ui/VideoInput.vue'
import VideoPlayer from '../ui/VideoPlayer.vue'
import { Icon } from '@iconify/vue'
import { BLOCK_STYLES } from '../../constants/design'

const blockStyleOptions = BLOCK_STYLES.map((s) => s.id)

const props = defineProps({ block: { type: Object, required: true } })
const emit = defineEmits(['save'])

const form = ref({ ...props.block.data })
const blockStyle = ref(props.block.style || 'default')
const galleryImages = ref((props.block.data?.images ?? []).join('\n'))
const saved = ref(false)
let saveTimer = null

watch(() => props.block, (b) => {
  form.value = { ...b.data }
  blockStyle.value = b.style || 'default'
  if (props.block.type === 'hero' && form.value.bgType === 'youtube' && form.value.youtubeUrl && !form.value.videoUrl) {
    form.value.videoUrl = form.value.youtubeUrl
    form.value.bgType = 'video'
  }
  if (props.block.type === 'gallery') galleryImages.value = (b.data?.images ?? []).join('\n')
}, { deep: true, immediate: true })

const onHeroVideoChange = (url) => {
  form.value.videoUrl = url
  form.value.youtubeUrl = ''
  form.value.bgType = 'video'
  autoSave()
}

const socialPlatforms = [
  { value: 'twitter',   icon: 'simple-icons:x',   label: 'X (Twitter)' },
  { value: 'instagram', icon: 'simple-icons:instagram', label: 'Instagram' },
  { value: 'linkedin',  icon: 'simple-icons:linkedin',  label: 'LinkedIn' },
  { value: 'github',    icon: 'simple-icons:github',    label: 'GitHub' },
  { value: 'youtube',   icon: 'simple-icons:youtube',   label: 'YouTube' },
  { value: 'tiktok',    icon: 'simple-icons:tiktok',    label: 'TikTok' },
  { value: 'discord',   icon: 'simple-icons:discord',   label: 'Discord' },
  { value: 'twitch',    icon: 'simple-icons:twitch',    label: 'Twitch' },
  { value: 'spotify',   icon: 'simple-icons:spotify',   label: 'Spotify' },
  { value: 'facebook',  icon: 'simple-icons:facebook',  label: 'Facebook' },
  { value: 'whatsapp',  icon: 'simple-icons:whatsapp',  label: 'WhatsApp' },
  { value: 'snapchat',  icon: 'simple-icons:snapchat',  label: 'Snapchat' },
  { value: 'reddit',    icon: 'simple-icons:reddit',    label: 'Reddit' },
  { value: 'pinterest', icon: 'simple-icons:pinterest', label: 'Pinterest' },
  { value: 'soundcloud',icon: 'simple-icons:soundcloud',label: 'SoundCloud' },
  { value: 'apple',     icon: 'simple-icons:apple',     label: 'Apple' },
]

const previewImages = computed(() => galleryImages.value.split('\n').map(s => s.trim()).filter(Boolean))

const autoSave = () => {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    emit('save', { data: { ...form.value }, style: blockStyle.value })
    saved.value = true
    setTimeout(() => saved.value = false, 1500)
  }, 400)
}

const saveGallery = () => {
  form.value.images = galleryImages.value.split('\n').map(s => s.trim()).filter(Boolean)
  autoSave()
}

const socialUrlDefaults = {
  twitter: 'https://twitter.com/',
  instagram: 'https://instagram.com/',
  linkedin: 'https://linkedin.com/in/',
  github: 'https://github.com/',
  youtube: 'https://youtube.com/@',
  tiktok: 'https://tiktok.com/@',
  discord: 'https://discord.gg/',
  twitch: 'https://twitch.tv/',
  spotify: 'https://open.spotify.com/user/',
  facebook: 'https://facebook.com/',
  whatsapp: 'https://wa.me/',
  snapchat: 'https://snapchat.com/add/',
  reddit: 'https://reddit.com/user/',
  pinterest: 'https://pinterest.com/',
  soundcloud: 'https://soundcloud.com/',
  apple: 'https://apple.com/'
}

const setSocialPlatform = (platform) => {
  form.value.platform = platform
  // Only auto-update if URL is still the default for the old platform or empty
  const currentUrl = form.value.url || ''
  const oldPlatform = props.block.data?.platform || 'twitter'
  if (!currentUrl || currentUrl.startsWith(socialUrlDefaults[oldPlatform])) {
    form.value.url = socialUrlDefaults[platform] || ''
  }
  autoSave()
}

const addGalleryImage = (url) => {
  if (galleryImages.value) {
    galleryImages.value += `\n${url}`
  } else {
    galleryImages.value = url
  }
  saveGallery()
}
</script>


