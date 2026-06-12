<template>
  <div class="mb-4 flex items-center justify-center gap-4" :class="block.data?.style === 'dots' ? 'py-2' : 'py-4'">
    <template v-if="block.data?.style === 'dots'">
      <div v-for="i in 5" :key="i" class="w-1.5 h-1.5 rounded-full bg-[var(--color-muted)]"></div>
    </template>
    <template v-else-if="block.data?.style === 'gradient'">
      <div class="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent"></div>
    </template>
    <template v-else-if="block.data?.style === 'stars'">
      <div class="flex-1 h-px bg-[var(--color-muted)]"></div>
      <span class="text-[var(--color-accent)] text-sm">✦</span>
      <div class="flex-1 h-px bg-[var(--color-muted)]"></div>
    </template>
    <template v-else>
      <div class="flex-1 h-px bg-[var(--color-muted)]"></div>
    </template>
  </div>
</template>
<script setup>
defineProps({ block: { type: Object, required: true } })
</script>
