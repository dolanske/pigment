<script setup lang='ts'>
import { IconCircleHalfFull, IconRefresh, IconWaterCircle } from '@iconify-prerendered/vue-mdi'
import { useCanvas } from '../../store/canvas'
import { useEffects } from '../../store/effects'

const canvas = useCanvas()
const effects = useEffects()

// const value = ref(100)
</script>

<template>
  <aside class="sidebar" :style="{ height: `calc(100vh - ${canvas.cfg.offsetTop}px)` }">
    <!-- <div class="sidebar-title">
      <strong>{{ effects.activeTab }}</strong>
    </div> -->

    <div class="sidebar-filter">
      <div class="filter-title">
        <IconWaterCircle class="icon" />
        <span>Saturation</span>

        <button class="button btn-white btn-icon" data-title-top="Reset">
          <IconRefresh />
        </button>
      </div>

      <div class="filter-inputs">
        <input
          v-model="effects.state.saturate.value"
          type="range"
          :min="effects.state.saturate.min"
          :max="effects.state.saturate.max"
        >
        <input v-model="effects.state.saturate.value" type="number">
      </div>
    </div>

    <div class="sidebar-filter">
      <div class="filter-title">
        <IconCircleHalfFull class="icon" />
        <span>Contrast</span>

        <button class="button btn-white btn-icon" data-title-top="Reset">
          <IconRefresh />
        </button>
      </div>

      <div class="filter-inputs">
        <input
          v-model="effects.state.contrast.value"
          type="range"
          :min="effects.state.contrast.min"
          :max="effects.state.contrast.max"
        >
        <input v-model="effects.state.contrast.value" type="number">
      </div>
    </div>

    <!-- <div class="flex-1" /> -->
    <!-- <Footer /> -->
  </aside>
</template>
