<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import InputSelect from '../../form/InputSelect.vue'

const type = ref('gaussian')
const options = {
  gaussian: 'Gaussian Noise',
  random: 'Random',
}

let ctx1: CanvasRenderingContext2D
let ctx2: CanvasRenderingContext2D

onMounted(() => {

})
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
      <InputSelect v-model="type" :options="options" label="Type" cantclear :multiple="false" />
    </div>
  </div>
</template>
