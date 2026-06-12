<template>
  <div class="mb-4 p-5 rounded-2xl w-full overflow-hidden"
    :class="blockClass"
    :style="{ textAlign: block.data?.align || 'left' }">
    <p :class="`text-${block.data?.textSize || 'base'} leading-relaxed text-[var(--color-text,#fff)] whitespace-pre-wrap break-words`">
      {{ block.data?.content || '' }}
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
