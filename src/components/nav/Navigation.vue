<script setup lang='ts'>
import {
  IconRedoVariant,
  IconUndoVariant,
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
