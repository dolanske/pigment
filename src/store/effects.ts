import { defineStore } from 'pinia'
import { reactive, watch } from 'vue'
import { getCanvasContext } from './canvas'
import { useFile } from './file'

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter#examples

// General storage of editor effects, their defaults and current state
export const useEffects = defineStore('effects', () => {
  const file = useFile()
  const state = reactive({
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
    'seipa': {
      value: 0,
      min: 0,
      max: 100,
      run: (amount: number) => {
        return `sepia(${amount / 100})`
      },
    },
  })

  watch(state, () => {
    const ctx = getCanvasContext()
    if (!ctx)
      return

    const filterString = Object.values(state).map((item) => {
      return item.run(item.value)
    }).join(' ')

    // Set filter
    console.log(filterString)
    ctx.filter = filterString
    // In order to apply filter to canvas we need to re-draw the it

    file.draw()
  }, { deep: true })

  return {
    state,
  }
})
