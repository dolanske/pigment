<script setup lang='ts'>
import { useCanvas } from '../../store/canvas'
import { effectDefinitions, useEffects } from '../../store/effects'
import SidebarFilter from './modules/SidebarFilter.vue'
import SidebarNoise from './modules/SidebarNoise.vue'
import SidebarTransform from './modules/SidebarTransform.vue'

const canvas = useCanvas()
const effects = useEffects()
</script>

<template>
  <aside class="sidebar" :style="{ height: `calc(100vh - ${canvas.cfg.offsetTop}px)` }">
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
