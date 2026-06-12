<template>
  <div class="mb-4 p-5 rounded-2xl w-full overflow-hidden"
    :class="block.style === 'glass' ? 'backdrop-blur-xl bg-white/5 border border-white/10' : 'bg-[var(--color-surface)] border border-[var(--color-muted)]'"
    :style="{ textAlign: block.data?.align || 'left' }">
    <p :class="`text-${block.data?.textSize || 'base'} leading-relaxed text-[var(--color-text,#fff)] whitespace-pre-wrap break-words`">
      {{ block.data?.content || '' }}
    </p>
  </div>
</template>
<script setup>
defineProps({ block: { type: Object, required: true } })
</script>
