<template>
  <div class="mb-4 p-5 sm:p-8 rounded-2xl w-full overflow-hidden"
    :class="blockClass"
    :style="{ textAlign: block.data?.align || 'center' }">
    <img v-if="block.data?.avatarUrl" :src="block.data.avatarUrl"
      class="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-[var(--color-accent)] shadow-lg mx-auto mb-4"
      :style="block.data?.align === 'left' ? 'margin-left:0' : block.data?.align === 'right' ? 'margin-right:0' : ''" />
    <h2 class="text-xl sm:text-2xl font-bold text-white mb-2">{{ block.data?.name || 'Your Name' }}</h2>
    <p class="text-gray-400 text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap max-w-lg"
      :style="{ margin: (block.data?.align || 'center') === 'center' ? '0 auto' : '0' }">
      {{ block.data?.bio || 'Tell the world about yourself...' }}
    </p>
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
</script>
