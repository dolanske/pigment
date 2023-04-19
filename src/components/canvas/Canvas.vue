<script setup lang='ts'>
import { useWindowSize } from '@vueuse/core'
import { ref, watch } from 'vue'
import { useCanvas } from '../../store/canvas'

const canvasEl = ref<HTMLCanvasElement>()
const canvas = useCanvas()

// This variable is the sum of header and footer height
const { width, height } = useWindowSize()

watch([width, height], () => {
  // Execused on window resize
  canvas.center.x = width.value / 2
  canvas.center.y = height.value / 2
}, { immediate: true })
</script>

<template>
  <div class="canvas-wrapper">
    <canvas id="canvas" ref="canvasEl" :width="width" :height="height - (canvas.cfg.offsetBottom + canvas.cfg.offsetTop)" />
  </div>
</template>
