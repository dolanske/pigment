<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import InputSelect from '../../form/InputSelect.vue'
import InputCheckbox from '../../form/InputCheckbox.vue'
import { useFile } from '../../../store/file'

const noiseType = ref('gaussian')
const noiseGrayscale = ref(true)
const noiseAmount = ref(0)

const options = {
  gaussian: 'Gaussian',
  random: 'Randomized',
}

let ctx1: CanvasRenderingContext2D
let ctx2: CanvasRenderingContext2D

onMounted(() => {

})

const file = useFile()
// watch(() => file.img)
</script>

<template>
  <div class="sidebar-section">
    <div class="section-title">
      <strong>Noise</strong>
    </div>

    <div class="noise-preview">
      <canvas id="before" width="134" height="134" />
      <canvas id="after" width="134" height="134" />
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
