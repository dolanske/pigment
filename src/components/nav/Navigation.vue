<script setup lang='ts'>
import {
  IconCircleHalfFull,
  IconCrop,
  IconGradientHorizontal,
  IconRedoVariant,
  IconReflectVertical,
  IconUndoVariant,
  IconWaterCircle,
  IconWhiteBalanceSunny,
  IconZoomIn,
  IconZoomOut,
} from '@iconify-prerendered/vue-mdi'
import { useFile } from '../../store/file'
import WithDropdown from '../generic/WithDropdown.vue'

const file = useFile()
</script>

<template>
  <header class="navigation">
    <div class="nav-logo">
      <img src="/logo/logo.svg" alt="">
    </div>

    <div class="nav-dropdowns">
      <WithDropdown>
        <template #default="{ toggle }">
          <button class="button btn-white" @click="toggle">
            File
          </button>
        </template>
        <template #list>
          <button class="button" @click="file.upload()">
            New File
          </button>
          <button class="button">
            Revert
          </button>
          <hr>
          <button class="button">
            Export
          </button>
        </template>
      </WithDropdown>
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

    <div class="divider" />

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

      <button class="button btn-white btn-icon" data-title-bottom="Grayscale">
        <IconGradientHorizontal />
      </button>

      <button class="button btn-white btn-icon" data-title-bottom="Crop">
        <IconCrop />
      </button>
    </div>

    <div class="divider" />
    <div class="fn-dropdowns">
      <button class="button btn-white btn-icon" data-title-bottom="Vertical Effects">
        <IconReflectVertical />
      </button>
    </div>

    <div class="flex-1" />

    <div class="fn-dropdowns">
      <button class="button btn-white btn-icon" data-title-bottom="Zoom In">
        <IconZoomIn />
      </button>

      <button class="button btn-white btn-icon" data-title-bottom="Zoom Out">
        <IconZoomOut />
      </button>

      <button class="button btn-white btn-icon" data-title-bottom="Undo">
        <IconUndoVariant />
      </button>

      <button class="button btn-white btn-icon" data-title-bottom="Redo">
        <IconRedoVariant />
      </button>
    </div>
  </header>
</template>
