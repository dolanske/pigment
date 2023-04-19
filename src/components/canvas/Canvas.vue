<script setup lang='ts'>
import { useEventListener } from '@vueuse/core'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useCanvas } from '../../store/canvas'
import { useFile } from '../../store/file'
import { useLoading } from '../../store/loading'
import { LOAD } from '../../js/definitions'

const canvasEl = ref<HTMLCanvasElement>()
const canvas = useCanvas()
const file = useFile()
const loading = useLoading()

/**
 * Two ideas how to handle resizing zooming and moving in a canvas
 *
 * #1 Canvas...
 *  - is as large as the image we are working with
 *  - is absolutely positioned
 *  - zooming in moving and so on simply transforms the canvas instead of the image on it
 *
 * #2 Canvas...
 *  - is always the size as a window
 *  - all image handling is being done within canvas itsel
 *
 */

// This variable is the sum of header and footer height
// const { width, height } = useWindowSize()

const width = ref<number>(0)
const height = ref<number>(0)

onMounted(() => {
  setCanvasSizeToDocSize()
})

useEventListener('resize', async () => {
  setCanvasSizeToDocSize()
  await nextTick()
  file.draw()
}, { passive: true })

function setCanvasSizeToDocSize() {
  width.value = window.document.documentElement.clientWidth
  height.value = window.document.documentElement.clientHeight
}

watch([width, height], ([w, h]) => {
  if (!w || !h)
    return
  canvas.center.x = w / 2
  canvas.center.y = h / 2
})

// Handle uploading of dragged files
const dragging = ref(false)

onMounted(() => {
  const el = document.querySelector('.canvas-wrapper')
  if (el) {
    el.addEventListener('dragenter', handleDrop, false)
    el.addEventListener('dragleave', handleDrop, false)
    el.addEventListener('dragover', handleDrop, false)
    el.addEventListener('drop', handleDrop, false)
    el.addEventListener('input', handleDrop, false)
  }
})

// REVIEW: What is the correct type?
function handleDrop(e: any) {
  e.preventDefault()
  e.stopPropagation()
  const draggedFile = e.dataTransfer?.files[0]
  dragging.value = false

  if (!draggedFile)
    return

  loading.add(LOAD.upload)

  const url = URL.createObjectURL(draggedFile)
  const img = new Image()
  img.src = url
  img.onload = () => {
    file.update(img)
    loading.del(LOAD.upload)
  }
}
</script>

<template>
  <div
    class="canvas-wrapper"
    :class="{ 'is-dragging': dragging }"
    @dragover="dragging = true"
    @mouseup="dragging = false"
  >
    <canvas
      id="canvas"
      ref="canvasEl"
      :width="width"
      :height="height - (canvas.cfg.offsetBottom + canvas.cfg.offsetTop)"
    />
  </div>
</template>
