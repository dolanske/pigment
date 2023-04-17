import { defineStore } from 'pinia'

type EfffectType = 'saturation' | 'contrast' | 'brightness' | 'grayscale'

interface Effect {
  type: 'string'
  // defaults:
}

export const useEffects = defineStore('effects', () => {
  /**
   * General storage of editor effects, their defaults and current state
   */

  return {

  }
})
