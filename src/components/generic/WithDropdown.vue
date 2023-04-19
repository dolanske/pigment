<script setup lang='ts'>
import type { Component } from 'vue'
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps<{
  icon?: Component
  text?: string
  title?: string
}>()
const wrap = ref()
const open = ref(false)

function toggle() {
  open.value = !open.value
}

onClickOutside(wrap, () => open.value = false)
</script>

<template>
  <div ref="wrap" class="dropdown-wrap">
    <slot v-if="$slots.header" name="header" :toggle="toggle" :open="open" />
    <button v-else :data-title-bottom="props.title" class="button btn-white" :class="{ 'btn-gray': open }" @click="toggle">
      <Component :is="props.icon" v-if="props.icon" />
      {{ text }}
    </button>
    <div v-if="open" class="dropdown">
      <slot />
    </div>
  </div>
</template>
