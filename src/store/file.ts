import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from './toast'
import { getCanvasContext, useCanvas } from './canvas'

/**
 * Triggers an input element to upload an image and returns the image url
 */
function sendErrorMessage(event: ErrorEvent) {
  console.log(event)

  const toast = useToast()
  toast.push({
    type: 'error',
    message: event.message,
  })
}

export function triggerUpload(): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const inputEl = document.createElement('input')
    inputEl.setAttribute('accept', 'image/*')
    inputEl.setAttribute('type', 'file')
    inputEl.click()

    inputEl.addEventListener('input', (event) => {
      if (!event.target)
        return reject(new Error('Missing event target'))

      const files = (event.target as HTMLInputElement).files
      if (!files)
        return reject(new Error('Missing file list'))

      const file = files[0]
      const url = URL.createObjectURL(file)
      const image = new Image()
      image.src = url

      image.addEventListener('load', () => {
        return resolve(image)
      })
      image.addEventListener('error', (e) => {
        sendErrorMessage(e)
        return reject(new Error('Failed to upload image'))
      })
    })

    inputEl.addEventListener('error', (e) => {
      sendErrorMessage(e)
      return reject(new Error('Failed to upload image'))
    })
  })
}

/**
 * Store module used to store information about file.
 */
export const useFile = defineStore('file', () => {
  // const canvas = ref<HTMLCanvasElement>()
  const img = ref<HTMLImageElement>()

  async function upload() {
    img.value = await triggerUpload()
    draw()
  }

  function draw() {
    const ctx = getCanvasContext()
    if (!ctx || !img.value)
      return

    const { naturalWidth, naturalHeight } = img.value

    ctx.drawImage(
      img.value,
      (ctx.canvas.width / 2) - (naturalWidth / 2),
      (ctx.canvas.height / 2) - (naturalHeight / 2),
      naturalWidth,
      naturalHeight,
    )
  }

  function scale(by: number) {
    const canvas = useCanvas()
    const ctx = getCanvasContext()
    if (!ctx)
      return

    ctx.scale(canvas.scale, canvas.scale)
    draw()
  }

  return {
    upload,
    draw,
    scale,
    img,
  }
})
