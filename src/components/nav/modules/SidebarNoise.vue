<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import InputSelect from '../../form/InputSelect.vue'
import InputCheckbox from '../../form/InputCheckbox.vue'
import { useFile } from '../../../store/file'
import { addNoise, degradeQuality } from '../../../js/effects'
import { getCanvasContext } from '../../../store/canvas'
import { UpdateType, useHistory } from '../../../store/history'
import { useEffects } from '../../../store/effects'
import InputText from '../../form/InputText.vue'

// TODO
// Both noise and quality reducers should have an "apply" button at the bottom of the sidebar
// When changes are applied, all their properties are set to default state
// prevew should also show quality reductions in that case

const history = useHistory()
const effects = useEffects()

const beforeNoiseEl = ref<HTMLCanvasElement>()
const afterNoiseEl = ref<HTMLCanvasElement>()

const drawing = ref(false)

const previewSize = 161

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
  // If preview is updated and no image file exists, reset to defaults
  if (!file.img) {
    beforeCtx.clearRect(0, 0, previewSize, previewSize)
    afterCtx.clearRect(0, 0, previewSize, previewSize)
    effects.noise.amount = 0
    effects.noise.isGrayscale = false
    effects.noise.type = 'random'
    return
  }

  const { width, height } = file.defaultScale(file.img, beforeCtx)

  beforeCtx.drawImage(
    file.img,
    (beforeCtx.canvas.width / 2) - (width * 2),
    (beforeCtx.canvas.height / 2) - (height * 2),
    width * 4,
    height * 4,
  )

  setPreview()
}

async function setPreview() {
  if (drawing.value)
    return

  const noiseResult = await addNoise(
    beforeCtx.getImageData(0, 0, afterCtx.canvas.width, afterCtx.canvas.height),
    effects.noise.amount,
    effects.noise.isGrayscale,
  )

  degradeQuality(
    noiseResult,
    effects.reduction.quality,
    effects.reduction.repetitions,
  )
    .then((data) => {
      afterCtx.putImageData(data, 0, 0)
    })
}

// Update previes when image changes
watch(() => file.img, updatePreview)

// Update noise when slider changes
watchDebounced(
  [() => effects.noise, () => effects.reduction],
  setPreview,
  { debounce: 300, deep: true },
)

// When applying noise to the image, we don't want to perform filtering
// at runtime. Most of these effects are very costly.
// -
// Instead we'll apply these to the file itself meaning that on
// re-render with filters, these changes will always be present from now
// on. Only issue that can arise are that if image already contains
// noise and we run this effect again, it will add on top of it.
// -
// For that, when we click apply, we reference the original as the base
async function apply() {
  const ctx = getCanvasContext()
  const tempCanvas = document.createElement('canvas')
  const tempContext = tempCanvas.getContext('2d')
  if (!tempContext || !file.img || !ctx)
    return

  drawing.value = true

  const { width, height } = file.defaultScale()
  tempCanvas.width = width
  tempCanvas.height = height
  tempContext.drawImage(file.img, 0, 0, width, height)
  const tempData = tempContext.getImageData(0, 0, width, height)

  // const noiseResult = await addNoise(
  //   tempData,
  //   effects.noise.amount,
  //   effects.noise.isGrayscale,
  // )

  degradeQuality(
    tempData,
    effects.reduction.quality,
    effects.reduction.repetitions,
  )
    .then((imageData) => {
      file.afterDraw(() => {
        history.add({
          imageData,
          type: UpdateType.NOISE,
          payload: {
            amount: effects.noise.amount,
            isGrayscale: effects.noise.isGrayscale,
            type: effects.noise.type,
            repetitions: effects.reduction.repetitions,
            quality: effects.reduction.quality,
          },
        })

        effects.resetNoise()
        drawing.value = false
      })

      file.update(imageData)
    })
}
</script>

<template>
  <div class="sidebar-section">
    <div class="noise-preview">
      <span v-if="!file.img">Upload an image <br> to see the preview.</span>
      <canvas id="before" ref="beforeNoiseEl" :width="previewSize" :height="previewSize" />
      <canvas id="after" ref="afterNoiseEl" :width="previewSize" :height="previewSize" />
    </div>

    <div class="noise-properties">
      <InputSelect v-model="effects.noise.type" :options="options" cantclear :multiple="false" />
      <InputCheckbox v-model="effects.noise.isGrayscale" reverse label="Grayscale" />
    </div>

    <div class="filter-inputs noise">
      <input
        v-model.number="effects.noise.amount"
        type="range"
        min="0"
        max="100"
      >
      <InputText v-model="effects.noise.amount" type="number" />
    </div>
  </div>
  <hr>
  <div class="sidebar-section">
    <div class="section-title">
      <strong>Quality Reducer</strong>
    </div>

    <div class="filter-inputs noise">
      <div class="quality-wrap">
        <input
          v-model.number="effects.reduction.quality"
          type="range"
          min="0"
          max="100"
        >
        <span>{{ effects.reduction.quality }}%</span>
      </div>
      <div class="flex">
        <label>Repetitions</label>
        <InputText v-model="effects.reduction.repetitions" type="number" />
      </div>
    </div>
  </div>
  <hr>
  <div class="section-title">
    <button class="button btn-gray-light w-100 btn-tall" @click="apply">
      Apply Changes
    </button>
  </div>
</template>
