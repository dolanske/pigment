import { IconCircleHalfFull, IconCrop, IconDotsHexagon, IconGradientHorizontal, IconImageFilterVintage, IconInvertColors, IconPalette, IconRotateLeft, IconWaterCircle, IconWhiteBalanceSunny } from '@iconify-prerendered/vue-mdi'
import { defineStore } from 'pinia'
import type { Component } from 'vue'
import { reactive, ref, watch } from 'vue'
import { getCanvasContext } from './canvas'
import { useFile } from './file'

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter#examples

export interface EffectDefinition {
  default: number
  name: string
  icon: Component
}

export interface Effect {
  value: number
  min: number
  max: number
  run: (amount: number) => string
}

export const effectDefinitions: Readonly<Record<string, EffectDefinition>> = {
  'saturate': {
    name: 'Saturation',
    icon: IconWaterCircle,
    default: 100,
  },
  'contrast': {
    name: 'Contrast',
    icon: IconCircleHalfFull,
    default: 100,
  },
  'brightness': {
    default: 100,
    name: 'Brightness',
    icon: IconWhiteBalanceSunny,
  },
  'grayscale': {
    default: 0,
    name: 'Grayscale',
    icon: IconGradientHorizontal,
  },
  'hue-rotate': {
    default: 0,
    name: 'Hue',
    icon: IconRotateLeft,
  },
  'invert': {
    default: 0,
    name: 'Invert',
    icon: IconInvertColors,
  },
  'sepia': {
    default: 0,
    name: 'Sepia',
    icon: IconImageFilterVintage,
  },
}

export const tabs = [
  {
    id: 'filters',
    icon: IconPalette,
  },
  // {
  //   id: 'advanced',
  //   icon: IconReflectVertical,
  // },
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
  const state = reactive<Record<keyof typeof effectDefinitions, Effect>>({
    'saturate': {
      value: 100,
      min: 0,
      max: 800,
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
      state[key].value = effectDefinitions[key].default
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
  const activeTab = ref<string>(tabs[2].id)

  // Store information related to noise
  const noise = reactive({
    amount: 0,
    isGrayscale: false,
    type: 'random',
  })

  return {
    activeTab,
    state,
    reset,
    collectEffects,
    noise,
  }
})
