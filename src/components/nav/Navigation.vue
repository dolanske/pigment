<script setup lang='ts'>
import {
  IconRedoVariant,
  IconUndoVariant,
  IconZoomIn,
  IconZoomOut,
} from '@iconify-prerendered/vue-mdi'
import { getCanvasContext, useCanvas } from '../../store/canvas'
import { useFile } from '../../store/file'
import WithDropdown from '../generic/WithDropdown.vue'
import { useLoading } from '../../store/loading'
import { useEffects } from '../../store/effects'

const file = useFile()
const effects = useEffects()
const canvas = useCanvas()
const loading = useLoading()

function resetApp() {
  // Reset file
  file.img = undefined
  file.originalImg = undefined
  file.currentScale.width = 0
  file.currentScale.height = 0
  file.rotation = 0
  file.transformScale.horizontal = 1
  file.transformScale.vertical = 1
  file.transformScale.zoom = 1

  // Reset effects
  effects.reset()

  canvas.center.x = 0
  canvas.center.y = 0

  const ctx = getCanvasContext()
  if (ctx)
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}
</script>

<template>
  <header class="navigation" :style="{ height: `${canvas.cfg.offsetTop}px` }">
    <div class="progress-bar-wrap" :class="{ 'is-active': loading.progress }">
      <div
        class="progress-bar"
        :style="{ width: `${loading.progress}%` }"
      />
    </div>

    <div class="nav-logo">
      <img src="/logo/logo.svg" alt="">
    </div>

    <div class="nav-dropdowns fixed">
      <WithDropdown>
        <template #header="{ toggle, open }">
          <button class="button btn-white" :class="{ 'btn-gray': open }" @click="toggle">
            File
          </button>
        </template>
        <button class="button" @click="file.upload()">
          New File
        </button>
        <button class="button" @click="file.revert()">
          Revert Changes
        </button>
        <hr>
        <button class="button" @click="file.export()">
          Save
        </button>
        <button class="button" @click="file.export()">
          Save As
        </button>
        <hr>
        <button class="button" @click="resetApp()">
          Clear
        </button>
      </WithDropdown>
      <!-- <button class="button btn-white">
        EDIT
      </button>
      <button class="button btn-white">
        SETTINGS
      </button>
      <button class="button btn-white">
        HELP
      </button> -->
    </div>

    <!-- <div class="divider" />

    <div class="nav-dropdowns">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="[tab.id === effects.activeTab ? 'btn-gray' : 'btn-white']"
        :data-title-bottom="tab.id"
        class="button btn-tab"
        @click="effects.$patch({ activeTab: tab.id })"
      >
        <component :is="tab.icon" />
        {{ tab.id }}
      </button>
    </div> -->
    <div class="flex-1" />

    <div class="flex-1" />

    <div class="fn-dropdowns">
      <button class="button btn-white btn-icon" data-title-bottom="Zoom In" @click="file.transformScale.zoom += 1">
        <IconZoomIn />
      </button>

      <button class="button btn-white btn-icon" data-title-bottom="Zoom Out" @click="file.transformScale.zoom -= 1">
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
