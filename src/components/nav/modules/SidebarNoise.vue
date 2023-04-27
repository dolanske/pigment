<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import InputSelect from '../../form/InputSelect.vue'
import InputCheckbox from '../../form/InputCheckbox.vue'
import { useFile } from '../../../store/file'
import { addNoise } from '../../../js/effects'
import { getCanvasContext } from '../../../store/canvas'

const noiseType = ref('random')
const noiseGrayscale = ref(false)
const noiseAmount = ref<number>(0)

const beforeNoiseEl = ref<HTMLCanvasElement>()
const afterNoiseEl = ref<HTMLCanvasElement>()

const options = {
  gaussian: 'Gaussian',
  random: 'Randomized',
}

let beforeCtx: CanvasRenderingContext2D
let afterCtx: CanvasRenderingContext2D

// First, when this mounts, we get current image and assign it to both canvas contexts
onMounted(() => {
  if (beforeNoiseEl.value && afterNoiseEl.value) {
    const _beforeCtx = beforeNoiseEl.value.getContext('2d', { willReadFrequently: true })
    const _afterCtx = afterNoiseEl.value.getContext('2d', { willReadFrequently: true })

    if (_beforeCtx && _afterCtx) {
      beforeCtx = _beforeCtx
      afterCtx = _afterCtx
    }
  }

  updatePreview()
})

const file = useFile()

async function updatePreview() {
  if (!file.img)
    return

  const { width, height } = file.defaultScale(file.img, beforeCtx)

  beforeCtx.drawImage(
    file.img,
    (beforeCtx.canvas.width / 2) - (width * 2),
    (beforeCtx.canvas.height / 2) - (height * 2),
    width * 4,
    height * 4,
  )

  setPreviewNoise()
}

async function setPreviewNoise() {
  addNoise(
    beforeCtx.getImageData(0, 0, afterCtx.canvas.width, afterCtx.canvas.height),
    noiseAmount.value,
    noiseGrayscale.value,
  )
    .then((data) => {
      afterCtx.putImageData(data, 0, 0)
    })
}

// Update previes when image changes
watch(() => file.img, updatePreview)

// Update noise when slider changes
watchDebounced(noiseAmount, setPreviewNoise, { debounce: 300 })

// When applying noise to the image, we don't want to perform filtering
// at runtime. Most of these effects are very cost.
// -
// Instead we'll apply these to the file itself meaning that on
// re-render with filters, these changes will always be present from now
// on. Only issue that can arise are that if image already contains
// noise and we run this effect again, it couold double it
// -
// For that, when we click apply, we reference the original as the base

function applyNoise() {
  const ctx = getCanvasContext()
  const tempCanvas = document.createElement('canvas')
  const tempContext = tempCanvas.getContext('2d')
  if (!tempContext || !file.originalImg || !ctx || !file.img)
    return

  const { naturalWidth, naturalHeight } = file.originalImg

  tempCanvas.width = naturalWidth
  tempCanvas.height = naturalHeight
  tempContext.drawImage(file.originalImg, 0, 0, naturalWidth, naturalHeight)

  const tempData = tempContext.getImageData(0, 0, naturalWidth, naturalHeight)

  addNoise(tempData, noiseAmount.value, noiseGrayscale.value)
    .then((data) => {
      tempContext.putImageData(data, 0, 0)
      const url = tempCanvas.toDataURL()

      if (file.img) {
        file.img.src = url
        file.img.onload = () => file.draw()
      }
    })
}
</script>

<template>
  <div class="sidebar-section">
    <div class="section-title">
      <strong>Noise</strong>
    </div>

    <div class="noise-preview">
      <canvas id="before" ref="beforeNoiseEl" width="134" height="134" />
      <canvas id="after" ref="afterNoiseEl" width="134" height="134" />
    </div>

    <div class="noise-properties">
      <InputSelect v-model="noiseType" :options="options" cantclear :multiple="false" />
      <InputCheckbox v-model="noiseGrayscale" reverse label="Grayscale" />
    </div>

    <div class="filter-inputs">
      <input
        v-model.number="noiseAmount"
        type="range"
        min="0"
        max="100"
      >
      <input v-model="noiseAmount" type="number">
    </div>

    <div class="section-title">
      <button class="button btn-gray w-100 btn-tall" @click="applyNoise">
        Apply
      </button>
    </div>
  </div>
</template>
