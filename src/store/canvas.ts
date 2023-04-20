import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

// Query and return canvas context
export function getCanvasContext(id = '#canvas') {
  const canvas = document.querySelector<HTMLCanvasElement>(id)
  return canvas?.getContext('2d') ?? null
}

export const useCanvas = defineStore('canvas', () => {
  const scale = ref(1)
  const cfg = reactive({
    offsetTop: 45,
    offsetBottom: 25,
  })

  const center = reactive({
    x: 0,
    y: 0,
  })

  return {
    cfg,
    scale,
    center,
  }
})
