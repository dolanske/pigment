<script setup lang='ts'>
import { IconArrowLeftTop, IconArrowRightTop, IconFlipHorizontal, IconFlipVertical } from '@iconify-prerendered/vue-mdi'
import { computed } from 'vue'
import { useFile } from '../../../store/file'

const file = useFile()

const rotation = computed({
  get: () => file.rotation,
  set: value => file.rotate(value),
})
</script>

<template>
  <div class="sidebar-section">
    <div class="section-title">
      <strong>Rotate</strong>
    </div>

    <div class="rotation-basic">
      <button class="button btn-gray btn-large" @click="file.rotate((d) => d - 90)">
        <IconArrowLeftTop />
        90°
      </button>
      <button class="button btn-gray btn-large" @click="file.rotate((d) => d + 90)">
        90°
        <IconArrowRightTop />
      </button>

      <input v-model="rotation" type="number">
    </div>
  </div>

  <div class="sidebar-section">
    <div class="section-title">
      <strong>Flip</strong>
    </div>

    <div class="rotation-basic">
      <button class="button btn-gray btn-tall" @click="file.flip('horizontal')">
        <IconFlipHorizontal />
        Horizontal
      </button>
      <button class="button btn-gray btn-tall" @click="file.flip('vertical')">
        <IconFlipVertical />
        Vertical
      </button>
    </div>
  </div>
</template>
