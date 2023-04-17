<script setup lang='ts'>
import { useWindowSize } from '@vueuse/core'
import { ref } from 'vue'

const canvasEl = ref<HTMLCanvasElement>()

// This variable is the sum of header and footer height
const CANVAS_OFFSET = 75
const { width, height } = useWindowSize()
</script>

<template>
  <div class="canvas-wrapper">
    <canvas id="canvas" ref="canvasEl" :width="width" :height="height - CANVAS_OFFSET" />
  </div>
</template>
