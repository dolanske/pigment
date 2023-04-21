<script setup lang='ts'>
import { useCanvas } from '../../store/canvas'
import { effectDefinitions, useEffects } from '../../store/effects'
import SidebarFilter from './modules/SidebarFilter.vue'

const canvas = useCanvas()
const effects = useEffects()

// const value = ref(100)
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
    <template v-else-if="effects.activeTab === 'transform'">
      b
    </template>
  </aside>
</template>
