<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import InputSelect from '../../form/InputSelect.vue'
import InputCheckbox from '../../form/InputCheckbox.vue'
import { useFile } from '../../../store/file'

const noiseType = ref('gaussian')
const noiseGrayscale = ref(true)
const noiseAmount = ref(0)

const beforeNoiseEl = ref<HTMLCanvasElement>()
const afterNoiseEl = ref<HTMLCanvasElement>()

const options = {
  gaussian: 'Gaussian',
  random: 'Randomized',
}

let beforeCtx: CanvasRenderingContext2D
let afterCtx: CanvasRenderingContext2D

onMounted(() => {
  if (beforeNoiseEl.value && afterNoiseEl.value) {
    beforeCtx ??= beforeNoiseEl.value.getContext('2d')
    afterCtx ??= afterNoiseEl.value.getContext('2d')
  }

  // const first =
  // First, when this mounts, we get current image and assign it to both canvas contexts

  // It should render the image scaled by 4x and centered, we only need a sample of it
  updatePreview()
})

const file = useFile()

function updatePreview() {
  if (!file.img)
    return
}
</script>

<template>
  <div class="sidebar-section">
    <div class="section-title">
      <strong>Noise</strong>
    </div>

    <div class="noise-preview">
      <canvas id="before" ref="left" width="134" height="134" />
      <canvas id="after" ref="right" width="134" height="134" />
    </div>

    <div class="noise-properties">
      <InputSelect v-model="noiseType" :options="options" cantclear :multiple="false" />
      <InputCheckbox v-model="noiseGrayscale" reverse label="Grayscale" />
    </div>

    <div class="filter-inputs">
      <input
        v-model="noiseAmount"
        type="range"
        min="0"
        max="100"
      >
      <input v-model="noiseAmount" type="number">
    </div>

    <div class="section-title">
      <button class="button btn-gray w-100 btn-tall">
        Apply
      </button>
    </div>
  </div>
</template>
