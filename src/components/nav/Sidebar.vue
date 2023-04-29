<script setup lang='ts'>
import { useCanvas } from '../../store/canvas'
import { effectDefinitions, tabs, useEffects } from '../../store/effects'
import SidebarFilter from './modules/SidebarFilter.vue'
import SidebarNoise from './modules/SidebarNoise.vue'
import SidebarTransform from './modules/SidebarTransform.vue'

const canvas = useCanvas()
const effects = useEffects()
</script>

<template>
  <aside class="sidebar" :style="{ height: `calc(100vh - ${canvas.cfg.offsetTop}px)` }">
    <div class="sidebar-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="[tab.id === effects.activeTab ? 'btn-gray' : 'btn-white']"
        :data-title-bottom="tab.id"
        class="button btn-tab"
        @click="effects.$patch({ activeTab: tab.id })"
      >
        <component :is="tab.icon" />
        {{ tab.id }}
      </button>
    </div>

    <template v-if="effects.activeTab === 'filters'">
      <SidebarFilter
        v-for="(date, id) in effectDefinitions"
        :id="id"
        :key="id"
        :data="date"
      />
    </template>
    <SidebarTransform v-else-if="effects.activeTab === 'transform'" />
    <SidebarNoise v-else-if="effects.activeTab === 'noise'" />
  </aside>
</template>
