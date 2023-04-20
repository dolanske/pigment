import { IconCrop, IconDotsHexagon, IconPalette, IconReflectVertical } from '@iconify-prerendered/vue-mdi'
import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'
import { getCanvasContext } from './canvas'
import { useFile } from './file'

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter#examples

const effectDefaults: Record<string, number> = {
  'saturate': 100,
  'contrast': 100,
  'brightness': 100,
  'grayscale': 0,
  'hue-rotate': 0,
  'invert': 0,
  'sepia': 0,
}

export const tabs = [
  {
    id: 'filters',
    icon: IconPalette,
  },
  {
    id: 'advanced',
    icon: IconReflectVertical,
  },
  {
    id: 'transform',
    icon: IconCrop,
  },
  {
    id: 'noise',
    icon: IconDotsHexagon,
  },
] as const

// General storage of editor effects, their defaults and current state
export const useEffects = defineStore('effects', () => {
  const file = useFile()
  const state = reactive<Record<keyof typeof effectDefaults, any>>({
    'saturate': {
      value: 100,
      min: 0,
      max: 1000,
      run: (amount: number) => {
        return `saturate(${amount / 100})`
      },
    },
    'contrast': {
      value: 100,
      min: 0,
      max: 300,
      run: (amount: number) => {
        return `contrast(${amount / 100})`
      },
    },
    'brightness': {
      value: 100,
      min: 0,
      max: 300,
      run: (amount: number) => {
        return `brightness(${amount / 100})`
      },
    },
    'grayscale': {
      value: 0,
      min: 0,
      max: 100,
      run: (amount: number) => {
        return `grayscale(${amount / 100})`
      },
    },
    'hue-rotate': {
      value: 0,
      min: 0,
      max: 360,
      run: (amount: number) => {
        return `hue-rotate(${amount}deg)`
      },
    },
    'invert': {
      value: 0,
      min: 0,
      max: 100,
      run: (amount: number) => {
        return `invert(${amount / 100})`
      },
    },
    'sepia': {
      value: 0,
      min: 0,
      max: 100,
      run: (amount: number) => {
        return `sepia(${amount / 100})`
      },
    },
  })

  const resetting = ref(false)

  function reset() {
    resetting.value = true
    for (const key of Object.keys(state))
      state[key].value = effectDefaults[key]
    resetting.value = false
  }

  watch(state, () => {
    if (resetting.value)
      return

    applyEffects()
  }, { deep: true })

  function collectEffects() {
    return Object.values(state).map((item) => {
      return item.run(item.value)
    }).join(' ')
  }

  // @internal
  function applyEffects() {
    const ctx = getCanvasContext()
    if (!ctx)
      return

    const filterString = collectEffects()
    // Set filter
    ctx.filter = filterString
    // In order to apply filter to canvas we need to re-draw the it
    file.draw()
  }

  // Store active tab
  const activeTab = ref<string>(tabs[0].id)

  return {
    activeTab,
    state,
    reset,
    collectEffects,
  }
})
