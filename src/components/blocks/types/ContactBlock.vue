<template>
  <div class="mb-4 p-4 sm:p-6 rounded-2xl w-full"
    :class="blockClass">
    <h3 class="text-lg sm:text-xl font-bold text-white mb-1 text-center">{{ block.data?.title || 'Get In Touch' }}</h3>
    <p v-if="block.data?.subtitle" class="text-gray-400 text-sm text-center mb-4">{{ block.data.subtitle }}</p>
    <form class="flex flex-col gap-3 w-full" @submit.prevent="submitForm">
      <input type="email" placeholder="Your Email" required
        class="w-full px-3 py-2.5 bg-[var(--color-bg,#0B1120)] border border-[var(--color-muted)] rounded-xl focus:outline-none text-white text-sm" />
      <textarea placeholder="Your Message" rows="3" required
        class="w-full px-3 py-2.5 bg-[var(--color-bg,#0B1120)] border border-[var(--color-muted)] rounded-xl focus:outline-none text-white text-sm" />
      <button type="submit"
        class="w-full px-4 py-2.5 font-semibold rounded-xl transition-colors text-sm text-black"
        :style="{ background: 'var(--color-accent,#7c3aed)', color: '#fff' }">
        Send Message
      </button>
    </form>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { getBlockClass } from '../../../constants/design'

const props = defineProps({ 
  block: { type: Object, required: true },
  defaultStyle: { type: String, default: 'default' }
})
const blockClass = computed(() => getBlockClass(props.block.style, props.block, props.defaultStyle))
const submitForm = () => alert('Contact form coming soon!')
</script>
