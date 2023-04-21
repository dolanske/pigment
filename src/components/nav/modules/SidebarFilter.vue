<script setup lang='ts'>
import { computed } from 'vue'
import { IconRefresh } from '@iconify-prerendered/vue-mdi'
import type { EffectDefinition } from '../../../store/effects'
import { effectDefinitions, useEffects } from '../../../store/effects'

const props = defineProps<{
  data: EffectDefinition
  id: keyof typeof effectDefinitions
}>()

const effects = useEffects()

const effectValue = computed({
  get: () => effects.state[props.id].value,
  set: value => effects.state[props.id].value = value,
})

function reset() {
  effectValue.value = effectDefinitions[props.id].default
}
</script>

<template>
  <div class="sidebar-filter">
    <div class="filter-title">
      <component :is="props.data.icon" class="icon" />
      <span>{{ props.data.name }}</span>

      <button class="button btn-white btn-icon" data-title-top="Reset" @click="reset">
        <IconRefresh />
      </button>
    </div>

    <div class="filter-inputs">
      <input
        v-model="effectValue"
        type="range"
        :min="effects.state[props.id].min"
        :max="effects.state[props.id].max"
      >
      <input v-model="effectValue" type="number">
    </div>
  </div>
</template>
