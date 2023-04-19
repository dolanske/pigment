<script setup lang='ts'>
import {
  IconCircleHalfFull,
  IconCrop,
  IconGradientHorizontal,
  IconImageFilterVintage,
  IconInvertColors,
  IconRedoVariant,
  IconReflectVertical,
  IconRotateLeft,
  IconUndoVariant,
  IconWaterCircle,
  IconWhiteBalanceSunny,
  IconZoomIn,
  IconZoomOut,
} from '@iconify-prerendered/vue-mdi'
import { useCanvas } from '../../store/canvas'
import { useFile } from '../../store/file'
import WithDropdown from '../generic/WithDropdown.vue'
import { useEffects } from '../../store/effects'

const file = useFile()
const effects = useEffects()
const canvas = useCanvas()
</script>

<template>
  <header class="navigation" :style="{ height: `${canvas.cfg.offsetTop}px` }">
    <div class="nav-logo">
      <img src="/logo/logo.svg" alt="">
    </div>

    <div class="nav-dropdowns">
      <WithDropdown>
        <template #default="{ toggle, open }">
          <button class="button btn-white" :class="{ 'btn-gray': open }" @click="toggle">
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
      <WithDropdown>
        <template #default="{ toggle, open }">
          <button class="button btn-white btn-icon" :class="{ 'btn-gray': open }" data-title-bottom="Saturation" @click="toggle">
            <IconWaterCircle />
          </button>
        </template>
        <template #list>
          <input
            v-model="effects.state.saturate.value"
            type="range"
            :min="effects.state.saturate.min"
            :max="effects.state.saturate.max"
          >
          {{ effects.state.saturate.value / 100 }}
        </template>
      </WithDropdown>

      <WithDropdown>
        <template #default="{ toggle, open }">
          <button class="button btn-white btn-icon" :class="{ 'btn-gray': open }" data-title-bottom="Contrast" @click="toggle">
            <IconCircleHalfFull />
          </button>
        </template>
        <template #list>
          <input
            v-model="effects.state.contrast.value"
            type="range"
            :min="effects.state.contrast.min"
            :max="effects.state.contrast.max"
          >
          {{ effects.state.contrast.value / 100 }}
        </template>
      </WithDropdown>

      <WithDropdown>
        <template #default="{ toggle, open }">
          <button class="button btn-white btn-icon" :class="{ 'btn-gray': open }" data-title-bottom="Brightness" @click="toggle">
            <IconWhiteBalanceSunny />
          </button>
        </template>
        <template #list>
          <input
            v-model="effects.state.brightness.value"
            type="range"
            :min="effects.state.brightness.min"
            :max="effects.state.brightness.max"
          >
          {{ effects.state.brightness.value / 100 }}
        </template>
      </WithDropdown>

      <WithDropdown>
        <template #default="{ toggle, open }">
          <button class="button btn-white btn-icon" :class="{ 'btn-gray': open }" data-title-bottom="Grayscale" @click="toggle">
            <IconGradientHorizontal />
          </button>
        </template>
        <template #list>
          <input
            v-model="effects.state.grayscale.value"
            type="range"
            :min="effects.state.grayscale.min"
            :max="effects.state.grayscale.max"
          >
          {{ effects.state.grayscale.value / 100 }}
        </template>
      </WithDropdown>

      <WithDropdown>
        <template #default="{ toggle, open }">
          <button class="button btn-white btn-icon" :class="{ 'btn-gray': open }" data-title-bottom="Hue Rotate" @click="toggle">
            <IconRotateLeft />
          </button>
        </template>
        <template #list>
          <input
            v-model="effects.state['hue-rotate'].value"
            type="range"
            :min="effects.state['hue-rotate'].min"
            :max="effects.state['hue-rotate'].max"
          >
          {{ effects.state['hue-rotate'].value / 100 }}
        </template>
      </WithDropdown>

      <WithDropdown>
        <template #default="{ toggle, open }">
          <button class="button btn-white btn-icon" :class="{ 'btn-gray': open }" data-title-bottom="Invert" @click="toggle">
            <IconInvertColors />
          </button>
        </template>
        <template #list>
          <input
            v-model="effects.state.invert.value"
            type="range"
            :min="effects.state.invert.min"
            :max="effects.state.invert.max"
          >
          {{ effects.state.invert.value / 100 }}
        </template>
      </WithDropdown>

      <WithDropdown>
        <template #default="{ toggle, open }">
          <button class="button btn-white btn-icon" :class="{ 'btn-gray': open }" data-title-bottom="Seipa" @click="toggle">
            <IconImageFilterVintage />
          </button>
        </template>
        <template #list>
          <input
            v-model="effects.state.seipa.value"
            type="range"
            :min="effects.state.seipa.min"
            :max="effects.state.seipa.max"
          >
          {{ effects.state.seipa.value / 100 }}
        </template>
      </WithDropdown>
    </div>

    <div class="divider" />
    <div class="fn-dropdowns">
      <button class="button btn-white btn-icon" data-title-bottom="Crop">
        <IconCrop />
      </button>
      <button class="button btn-white btn-icon" data-title-bottom="Vertical Effects">
        <IconReflectVertical />
      </button>
    </div>

    <div class="flex-1" />

    <div class="fn-dropdowns">
      <button class="button btn-white btn-icon" data-title-bottom="Zoom In" @click="canvas.scale += 1">
        <IconZoomIn />
      </button>

      <button class="button btn-white btn-icon" data-title-bottom="Zoom Out" @click="canvas.scale -= 1">
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
