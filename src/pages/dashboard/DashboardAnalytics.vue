<template>
  <div class="p-6 max-w-4xl">
    <h2 class="text-3xl font-bold text-white mb-8">Analytics</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-[#111827] border border-[#334155] rounded-2xl p-6">
        <p class="text-gray-400 mb-2">Total Views</p>
        <h3 class="text-4xl font-bold text-white">0</h3>
        <p class="text-sm text-indigo-400 mt-2">Past 30 days</p>
      </div>
      <div class="bg-[#111827] border border-[#334155] rounded-2xl p-6">
        <p class="text-gray-400 mb-2">Total Clicks</p>
        <h3 class="text-4xl font-bold text-white">0</h3>
        <p class="text-sm text-indigo-400 mt-2">Past 30 days</p>
      </div>
      <div class="bg-[#111827] border border-[#334155] rounded-2xl p-6">
        <p class="text-gray-400 mb-2">Click Through Rate</p>
        <h3 class="text-4xl font-bold text-white">0%</h3>
        <p class="text-sm text-indigo-400 mt-2">Past 30 days</p>
      </div>
    </div>

    <div class="bg-[#111827] border border-[#334155] rounded-2xl p-6 h-64 flex items-center justify-center">
      <div class="text-center">
        <span class="text-4xl mb-4 block">📈</span>
        <h3 class="text-xl font-bold text-white mb-2">Not enough data</h3>
        <p class="text-gray-400">Share your wall to start collecting analytics.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
