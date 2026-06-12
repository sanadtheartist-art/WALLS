<template>
  <div class="w-full space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-white">My Blocks</h2>
      <span class="text-sm text-gray-500">{{ authStore.blocks.length }} block{{ authStore.blocks.length !== 1 ? 's' : '' }}</span>
    </div>

    <!-- Block Type Picker -->
    <div class="bg-[#0B1120] p-5 rounded-2xl border border-[#1e293b]">
      <p class="text-xs text-gray-500 uppercase tracking-widest mb-4 font-semibold">Add a Block</p>
      <div class="grid grid-cols-3 sm:grid-cols-5 gap-3">
        <button v-for="bt in blockTypes" :key="bt.type" @click="addBlock(bt.type)"
          class="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#111827] hover:bg-[#1e293b] border border-[#1e293b] hover:border-orange-500/40 transition-all group">
          <Icon :icon="bt.icon" class="w-6 h-6 mb-1" />
          <span class="text-xs text-gray-400 group-hover:text-white font-medium">{{ bt.label }}</span>
        </button>
      </div>
    </div>

    <!-- Block List -->
    <div v-if="authStore.blocksLoading" class="text-gray-500 text-center py-12">Loading blocks...</div>
    <div v-else-if="authStore.blocks.length === 0" class="text-center py-16 bg-[#0B1120] rounded-2xl border border-dashed border-[#1e293b]">
      <Icon icon="lucide:layout-template" class="w-12 h-12 mb-4 mx-auto text-gray-600" />
      <h3 class="text-lg font-bold text-white mb-2">Your wall is empty</h3>
      <p class="text-gray-500 text-sm">Pick a block type above to start building</p>
    </div>

    <div v-else class="space-y-3">
      <div v-for="(block, index) in authStore.blocks" :key="block.id"
        class="bg-[#0B1120] rounded-2xl border transition-all overflow-hidden"
        :class="expandedBlock === block.id ? 'border-orange-500/40 shadow-lg shadow-orange-500/5' : 'border-[#1e293b] hover:border-[#334155]'">

        <!-- Block Header Row -->
        <div class="flex items-center gap-4 px-5 py-4 cursor-pointer" @click="toggleExpand(block.id)">
          <!-- Drag Handle -->
          <div class="flex flex-col gap-1 cursor-grab shrink-0 opacity-40 hover:opacity-80">
            <div class="flex gap-1">
              <div class="w-1 h-1 rounded-full bg-gray-400"></div>
              <div class="w-1 h-1 rounded-full bg-gray-400"></div>
            </div>
            <div class="flex gap-1">
              <div class="w-1 h-1 rounded-full bg-gray-400"></div>
              <div class="w-1 h-1 rounded-full bg-gray-400"></div>
            </div>
            <div class="flex gap-1">
              <div class="w-1 h-1 rounded-full bg-gray-400"></div>
              <div class="w-1 h-1 rounded-full bg-gray-400"></div>
            </div>
          </div>

          <!-- Icon & Info -->
          <Icon :icon="getBlockMeta(block.type).icon" class="w-5 h-5 shrink-0 text-gray-400" />
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-white text-sm truncate">
              {{ getBlockDisplayName(block) }}
            </div>
            <div class="text-xs text-gray-500 capitalize">{{ block.type }} block</div>
          </div>

          <!-- Controls -->
          <div class="flex items-center gap-2 shrink-0" @click.stop>
            <!-- Up / Down -->
            <button @click="moveBlock(index, -1)" :disabled="index === 0" class="p-1.5 text-gray-500 hover:text-white disabled:opacity-20 transition-colors" title="Move up">▲</button>
            <button @click="moveBlock(index, 1)" :disabled="index === authStore.blocks.length - 1" class="p-1.5 text-gray-500 hover:text-white disabled:opacity-20 transition-colors" title="Move down">▼</button>
            <!-- Visibility -->
            <button @click="authStore.toggleBlockVisibility(block.id, !block.visible)"
              class="p-1.5 rounded-lg transition-colors"
              :class="block.visible ? 'text-emerald-400 hover:text-emerald-300' : 'text-gray-600 hover:text-gray-400'"
              :title="block.visible ? 'Hide' : 'Show'">
              <Icon :icon="block.visible ? 'lucide:eye' : 'lucide:eye-off'" class="w-4 h-4" />
            </button>
            <!-- Delete -->
            <button @click="deleteBlock(block.id)" class="p-1.5 text-gray-500 hover:text-red-400 transition-colors">
              <Icon icon="lucide:trash-2" class="w-4 h-4" />
            </button>
            <!-- Chevron -->
            <span class="text-gray-500 text-xs transition-transform duration-200" :class="expandedBlock === block.id ? 'rotate-180' : ''">▼</span>
          </div>
        </div>

        <!-- Inline Editor (Expanded) -->
        <div v-if="expandedBlock === block.id" class="px-5 pb-5 border-t border-[#1e293b] pt-4">
          <BlockEditor :block="block" @save="saveBlock(block.id, $event)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import BlockEditor from '../../components/blocks/BlockEditor.vue'
import { Icon } from '@iconify/vue'

const authStore = useAuthStore()
const expandedBlock = ref(null)

const blockTypes = [
  { type: 'link',    icon: 'lucide:link', label: 'Link' },
  { type: 'hero',    icon: 'lucide:star', label: 'Hero' },
  { type: 'about',   icon: 'lucide:user', label: 'About' },
  { type: 'contact', icon: 'lucide:mail', label: 'Contact' },
  { type: 'social',  icon: 'lucide:share-2', label: 'Social' },
  { type: 'text',    icon: 'lucide:type', label: 'Text' },
  { type: 'divider', icon: 'lucide:minus', label: 'Divider' },
  { type: 'gallery', icon: 'lucide:image', label: 'Gallery' },
  { type: 'video',   icon: 'lucide:video', label: 'Video' },
  { type: 'custom',  icon: 'lucide:code', label: 'Custom' },
]

const getBlockMeta = (type) => blockTypes.find(b => b.type === type) ?? { icon: 'lucide:box', label: type }

const getBlockDisplayName = (block) => {
  return block.data?.label || block.data?.title || block.data?.name || block.data?.platform || block.type
}

const toggleExpand = (id) => {
  expandedBlock.value = expandedBlock.value === id ? null : id
}

const addBlock = async (type) => {
  try {
    await authStore.addBlock(type)
  } catch (e) {
    console.error('Add block failed:', e)
  }
}

const saveBlock = async (id, data) => {
  await authStore.updateBlock(id, data)
}

const deleteBlock = async (id) => {
  if (!confirm('Delete this block?')) return
  if (expandedBlock.value === id) expandedBlock.value = null
  await authStore.deleteBlock(id)
}

const moveBlock = async (index, direction) => {
  const newOrder = [...authStore.blocks]
  const target = index + direction
  if (target < 0 || target >= newOrder.length) return
  ;[newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]]
  await authStore.reorderBlocks(newOrder)
}

onMounted(() => authStore.subscribeToBlocks())
onUnmounted(() => authStore.unsubscribeFromBlocks())
</script>
