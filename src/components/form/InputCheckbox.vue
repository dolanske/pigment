<script setup lang="ts">
import { IconCheckboxBlankOutline, IconCheckboxOutline } from '@iconify-prerendered/vue-mdi'
import { computed } from 'vue'

interface Props {
  label?: string
  modelValue: boolean
  // iconOn?: string
  // iconOff?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const data = computed<boolean>({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const d = computed(() => `id${Math.random().toString(16).slice(2)}`)
</script>

<template>
  <div class="form-checkbox">
    <input :id="d" v-model="data" type="checkbox" :name="d">
    <label :for="d">

      <div class="icon">
        <IconCheckboxBlankOutline v-if="modelValue" />
        <IconCheckboxOutline v-else />
      </div>

      <p v-if="props.label">{{ props.label }}</p>
    </label>
  </div>
</template>
