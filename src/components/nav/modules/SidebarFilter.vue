<script setup lang='ts'>
import { computed } from 'vue'
import { IconRefresh } from '@iconify-prerendered/vue-mdi'
import type { EffectDefinition } from '../../../store/effects'
import { effectDefinitions, useEffects } from '../../../store/effects'
import { debounce } from '../../../js/util'
import { UpdateType, useHistory } from '../../../store/history'
import { useFile } from '../../../store/file'

const props = defineProps<{
  data: EffectDefinition
  id: keyof typeof effectDefinitions
}>()

const effects = useEffects()
const file = useFile()
const history = useHistory()

const effectValue = computed({
  get: () => effects.state[props.id].value,
  set: debounce((value: number) => {
    effects.state[props.id].value = value

    file.afterDraw((imageData) => {
      history.add({
        imageData,
        updates: [{
          type: UpdateType.FILTER,
          key: props.id,
          value,
        }],
      })
    })
  }, 100),
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

      <button class="button btn-white btn-icon" data-title-left="Reset" @click="reset">
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
