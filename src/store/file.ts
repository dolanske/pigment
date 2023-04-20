import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { LOAD } from '../js/definitions'
import { useToast } from './toast'
import { getCanvasContext } from './canvas'
import { useLoading } from './loading'
import { useEffects } from './effects'

/**
 * Triggers an input element to upload an image and returns the image url
 */
function sendErrorMessage(event: ErrorEvent) {
  console.log('Error when uploading, event')
  const toast = useToast()
  toast.push({
    type: 'error',
    message: event.message,
  })
}

export function triggerUpload(): Promise<HTMLImageElement> {
  const inputEl = document.createElement('input')
  const handler = new Promise<HTMLImageElement>((resolve, reject) => {
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

  handler.finally(() => {
    inputEl.remove()
  })

  return handler
}

/**
 * Store module used to store information about file.
 */
export const useFile = defineStore('file', () => {
  // const canvas = ref<HTMLCanvasElement>()
  const img = ref<HTMLImageElement>()
  const currentScale = reactive({
    width: 0,
    height: 0,
  })
  const crop = reactive({ left: 0, top: 0, right: 0, bottom: 0 })

  async function upload() {
    const { add, del } = useLoading()
    add(LOAD.upload)
    triggerUpload()
      .then((res) => {
        img.value = res
        draw()
      })
      .finally(() => {
        del(LOAD.upload)
      })
  }

  async function update(image: HTMLImageElement) {
    img.value = image
    draw()
  }

  function draw() {
    const ctx = getCanvasContext()
    if (!ctx || !img.value)
      return

    const effects = useEffects()
    const { width, height } = defaultScale()

    Object.assign(currentScale, { width, height })
    const filters = effects.collectEffects()
    ctx.filter = filters

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.drawImage(
      img.value,
      (ctx.canvas.width / 2) - (width / 2),
      (ctx.canvas.height / 2) - (height / 2),
      width,
      height,
    )
  }

  /**
   * Scales the iamge down to fit the canvas and leave some space at the boreder
   */
  function defaultScale(_img?: HTMLImageElement) {
    const image = _img ?? img.value
    const ctx = getCanvasContext()
    if (!ctx || !image)
      return { width: 0, height: 0 }

    const { naturalHeight, naturalWidth } = image
    // Create offset, which is a sum of the desired opposite vertical or
    // horizontal gaps at end of canvas
    const OFFSET = 20
    // The min result of vertical and horizontal scale ratio
    const factor = Math.min(ctx.canvas.width / naturalWidth, ctx.canvas.height / naturalHeight)
    // Scale the image and return the new width and height
    return {
      width: naturalWidth * factor - OFFSET,
      height: naturalHeight * factor - OFFSET,
    }
  }

  function scale(by: number) {
    // const canvas = useCanvas()
    // const ctx = getCanvasContext()
    // if (!ctx)
    //   return

    // ctx.scale(canvas.scale, canvas.scale)
    // draw()
  }

  /**
   * This will load the original image back onto the canvas. Discarding
   * any user made changes
   */
  function revert() {
    const ctx = getCanvasContext()
    if (!ctx || !img.value)
      return

    // Reset any changes made and re-append image
    const effects = useEffects()
    effects.reset()

    const { width, height } = defaultScale()
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.drawImage(
      img.value,
      (ctx.canvas.width / 2) - (width / 2),
      (ctx.canvas.height / 2) - (height / 2),
      width,
      height,
    )
  }

  /**
   * Triggers a file download. Because canvas is full screen but image
   * is not, we need to iterate over canvas pixels and get the bounds.
   * Then when using `getImageData()` we use these bounds to _only_
   * export the actual image instead of the entire canvsa context.
   *
   * Checking for bounds to only export image and not all canvas bounds
   * [https://ourcodeworld.com/articles/read/683/how-to-remove-the-transparent-pixels-that-surrounds-a-canvas-in-javascript]
   *
   * TODO:
   * Once zooming in is supported, it should first fit image into canvas
   *
   */
  function exportFile() {
    const ctx = getCanvasContext()
    if (!ctx || !img.value)
      return

    const { add, del } = useLoading()
    add(LOAD.export)

    // Exporting
    // Define bounds
    const bounds: Record<string, any> = { top: null, left: null, right: null, bottom: null }
    const pixels = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    let x: number
    let y: number

    // Iterate over pixels and define its bounds
    for (let i = 0; i < pixels.data.length; i += 4) {
      if (pixels.data[i + 3] !== 0) {
        x = (i / 4) % ctx.canvas.width
        y = ~~((i / 4) / ctx.canvas.width)

        if (bounds.top === null)
          bounds.top = y

        if (bounds.left === null)
          bounds.left = x
        else if (x < bounds.left)
          bounds.left = x

        if (bounds.right === null)
          bounds.right = x
        else if (bounds.right < x)
          bounds.right = x

        if (bounds.bottom === null)
          bounds.bottom = y
        else if (bounds.bottom < y)
          bounds.bottom = y
      }
    }

    const trimHeight = bounds.bottom - bounds.top
    const trimWidth = bounds.right - bounds.left
    const trimmed = ctx.getImageData(bounds.left, bounds.top, trimWidth, trimHeight)

    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = trimWidth
    tempCanvas.height = trimHeight
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx)
      return

    tempCtx?.putImageData(trimmed, 0, 0)

    const a = document.createElement('a')
    a.href = tempCanvas.toDataURL('image/png')
    a.download = img.value.src.replace(/^.*[\\\/]/, '')
    a.click()
    a.remove()
    del(LOAD.export)
  }

  return {
    upload,
    update,
    export: exportFile,
    revert,
    draw,
    scale,
    img,
    currentScale,
  }
})
