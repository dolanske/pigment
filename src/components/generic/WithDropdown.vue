<script setup lang='ts'>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const wrap = ref()
const open = ref(false)

function toggle() {
  open.value = !open.value
}

onClickOutside(wrap, () => open.value = false)
</script>

<template>
  <div ref="wrap" class="dropdown-wrap">
    <slot :toggle="toggle" :open="open" />
    <div v-if="open" class="dropdown">
      <slot name="list" />
    </div>
  </div>
</template>
