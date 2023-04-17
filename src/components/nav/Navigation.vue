<script setup lang='ts'>
import { IconCircleHalfFull, IconWaterCircle, IconWhiteBalanceSunny } from '@iconify-prerendered/vue-mdi'
</script>

<template>
  <div class="navigation">
    <div class="nav-logo">
      <img src="/logo/logo.svg" alt="">
    </div>

    <div class="nav-dropdowns">
      <button class="button btn-white">
        File
      </button>
      <button class="button btn-white">
        EDIT
      </button>
      <button class="button btn-white">
        SETTINGS
      </button>
      <button class="button btn-white">
        HELP
      </button>
    </div>

    <div class="fn-dropdowns">
      <button class="button btn-white btn-icon" data-title-bottom="Saturation">
        <IconWaterCircle />
      </button>

      <button class="button btn-white btn-icon" data-title-bottom="Contrast">
        <IconCircleHalfFull />
      </button>

      <button class="button btn-white btn-icon" data-title-bottom="Brightness">
        <IconWhiteBalanceSunny />
      </button>
    </div>
  </div>
</template>
