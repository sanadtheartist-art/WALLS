<template>
  <div class="w-full relative custom-block-wrapper mb-4 rounded-2xl p-4" :class="blockClass" :id="`custom-block-${block.id}`">
    <!-- HTML injected raw -->
    <div ref="container" v-if="block.data?.html" v-html="block.data.html" class="w-full"></div>
  </div>
</template>

<script setup>
import { onMounted, watch, ref, nextTick, computed } from 'vue'
import { getBlockClass } from '../../../constants/design'

const props = defineProps({
  block: { type: Object, required: true },
  defaultStyle: { type: String, default: 'default' }
})

const container = ref(null)
const blockClass = computed(() => getBlockClass(props.block.style, props.block, props.defaultStyle))

const executeScripts = () => {
  if (!container.value) return
  // Find all script tags injected via v-html
  const scripts = container.value.querySelectorAll('script')
  scripts.forEach(oldScript => {
    // Create a new script element to force execution
    const newScript = document.createElement('script')
    if (oldScript.src) {
      newScript.src = oldScript.src
    } else {
      newScript.textContent = oldScript.textContent
    }
    // Copy all attributes
    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value))
    
    // Replace the old script with the new one
    oldScript.parentNode.replaceChild(newScript, oldScript)
  })
}

watch(() => props.block.data?.html, async () => {
  await nextTick()
  executeScripts()
})

onMounted(() => {
  executeScripts()
})
</script>

<style scoped>
.custom-block-wrapper {
  overflow: hidden;
  border-radius: inherit;
}
</style>
