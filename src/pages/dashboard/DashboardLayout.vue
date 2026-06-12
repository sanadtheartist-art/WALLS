<template>
  <div class="h-screen bg-[#0B1120] flex flex-col font-sans text-white overflow-hidden">
    <TopBar class="shrink-0" />
    <div class="flex-1 flex overflow-hidden relative">
      <!-- Left Sidebar (Desktop only) -->
      <DashboardSidebar class="hidden md:flex" />
      
      <!-- Center Main Content -->
      <main class="flex-1 overflow-y-auto pb-24 md:pb-6 px-4 sm:px-6 py-4 sm:py-6 bg-[#111827]">
        <router-view />
      </main>

      <!-- Right Phone Preview -->
      <aside class="w-[400px] border-l border-[#334155] bg-[#0B1120] hidden xl:flex flex-col items-center justify-center p-8 shrink-0">
        <PreviewPanel />
      </aside>
    </div>

    <!-- Mobile Bottom Navigation -->
    <BottomTabBar class="md:hidden" />
  </div>
</template>

<script setup>
import TopBar from '../../components/layout/TopBar.vue'
import DashboardSidebar from '../../components/layout/DashboardSidebar.vue'
import PreviewPanel from '../../components/layout/PreviewPanel.vue'
import BottomTabBar from '../../components/layout/BottomTabBar.vue'
</script>
