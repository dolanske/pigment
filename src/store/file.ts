import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'
import { LOAD } from '../js/definitions'
import { useToast } from './toast'
import { getCanvasContext } from './canvas'
import { useLoading } from './loading'
import { useEffects } from './effects'
import { useHistory } from './history'

type AfterDrawCallback = (imgData: ImageData) => void

/**
 * Triggers an input element to upload an image and returns the image url
 */
function sendErrorMessage(event: ErrorEvent) {
  console.log('Error when uploading, event')
  const toast = useToast()
  toast.push({
    type: 'error',
    message: event?.message ?? 'Idk err',
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
        reject(new Error('Missing event target'))

      const files = (event.target as HTMLInputElement).files
      if (!files)
        reject(new Error('Missing file list'))

      const file = files[0]
      const url = URL.createObjectURL(file)
      const image = new Image()
      image.src = url
      image.addEventListener('load', () => {
        return resolve(image)
      })
      image.addEventListener('error', (e) => {
        sendErrorMessage(e)
        reject(new Error('Failed to upload image'))
      })
    })

    inputEl.addEventListener('error', (e) => {
      sendErrorMessage(e)
      reject(new Error('Failed to upload image'))
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
  const img = ref<HTMLImageElement>()
  const originalImg = ref<HTMLImageElement>()
  const currentScale = reactive({
    width: 0,
    height: 0,
  })
  // const crop = reactive({ left: 0, top: 0, right: 0, bottom: 0 })
  const rotation = ref(0)
  const transformScale = reactive({
    horizontal: 1,
    vertical: 1,
    zoom: 1,
  })

  async function upload() {
    const loading = useLoading()
    useEffects().reset()
    useHistory().reset()

    loading.add(LOAD.upload)
    triggerUpload()
      .then(setNewImage)
      .finally(() => {
        loading.del(LOAD.upload)
      })
  }

  async function setNewImage(image: HTMLImageElement) {
    if (!image)
      return

    img.value = image
    originalImg.value = image.cloneNode() as HTMLImageElement
    draw()
  }

  function update(image: ImageData) {
    const ctx = getCanvasContext()
    if (!ctx || !img.value)
      return console.warn('[file.update] Missing context or root image element')

    ctx.putImageData(image, 0, 0)
    img.value.src = ctx.canvas.toDataURL('image/png')
    img.value.onload = () => draw()
  }

  // Redraw on every canvas transform
  watch(() => transformScale.zoom, draw)

  // Lifecycle method. Called after next canvas draw
  // Methods are only called once and then removed
  const afterDrawCollector = new Set<AfterDrawCallback>()
  function afterDraw(fn: AfterDrawCallback) {
    afterDrawCollector.add(fn)
  }

  // Main draw function
  // Before drawing, applies all canvas effects
  function draw() {
    const ctx = getCanvasContext()

    if (!ctx || !img.value)
      return console.warn('[file.draw] Missing context or root image element')

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    const effects = useEffects()
    const { width, height } = defaultScale()

    Object.assign(currentScale, { width, height })
    const filters = effects.collectEffects()
    ctx.filter = filters

    // Rotate image by setting scale
    ctx.scale(transformScale.horizontal, transformScale.vertical)

    const transformedImageWidth = width * transformScale.horizontal
    const transformedImageHeight = height * transformScale.vertical

    const transformedX = (ctx.canvas.width / 2) - (width / 2) * transformScale.zoom
    const transformedY = (ctx.canvas.height / 2) - (height / 2) * transformScale.zoom

    // TODO: move in canvas can be done by manually setting canvas center and updating that later
    ctx.drawImage(
      img.value,
      transformedX,
      transformedY,
      transformedImageWidth * transformScale.zoom,
      transformedImageHeight * transformScale.zoom,
    )

    // Retrieve data back to make it available in lifecycle hooks
    const imageData = ctx.getImageData(
      (ctx.canvas.width / 2) - (width / 2) * transformScale.zoom,
      (ctx.canvas.height / 2) - (height / 2) * transformScale.zoom,
      transformedImageWidth * transformScale.zoom,
      transformedImageHeight * transformScale.zoom,
    )

    // Run lifecycle
    for (const entry of afterDrawCollector.values()) {
      entry(imageData)
      afterDrawCollector.delete(entry)
    }
  }

  /**
   * Scales the iamge down to fit the canvas and leave some space at the boreder
   */
  function defaultScale(_img?: HTMLImageElement, _ctx?: CanvasRenderingContext2D) {
    const image = _img ?? img.value
    const ctx = _ctx ?? getCanvasContext()
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

  function rotate(fn: ((rotation: number) => number) | number) {
    const ctx = getCanvasContext()
    if (!ctx)
      return console.warn('[file.rotate] Missing context')

    rotation.value = typeof fn === 'number' ? fn : fn(rotation.value)

    draw()

    // Save before changes are made
    // const image = ctx.canvas

    // const { width, height } = defaultScale()
    // ctx.save()
    // // ctx.setTransform(1, 0, 0, 1, 0, 0) // sets scale and origin
    // ctx.rotate(rotation.value * Math.PI / 180)

    // // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    // ctx.drawImage(image, -image.width / 2, -image.height / 2)

    // // ctx.setTransform(1, 0, 0, 1, 0, 0)
    // ctx.restore()
  }

  /**
   * This will load the original image back onto the canvas. Discarding
   * any user made changes
   */
  function revert() {
    const ctx = getCanvasContext()
    if (!ctx || !img.value || !originalImg.value)
      return console.warn('[file.revert] Missing context, root image or orirignal image')

    // Reset any changes made and re-append image
    useEffects().reset()
    useHistory().reset()

    img.value.src = originalImg.value.src
    img.value.onload = () => draw()

    // ctx.drawImage(
    //   originalImg.value,
    //   (ctx.canvas.width / 2) - (width / 2),
    //   (ctx.canvas.height / 2) - (height / 2),
    //   width,
    //   height,
    // )
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
  function exportFile(exportAs = false) {
    const ctx = getCanvasContext()
    if (!ctx || !img.value)
      return console.warn('[file.exportFile] Missing context and root image')

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
        // ???
        // It's been over 7 months since I wrote this, I have no idea what is it doing
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

    if (exportAs) {
      // Opens a save file prompt
      // window.requestFile
    }
    else {
      // Downloads it
      const a = document.createElement('a')
      a.href = tempCanvas.toDataURL('image/jpeg', 0)
      a.download = img.value.src.replace(/^.*[\\\/]/, '')
      a.click()
      a.remove()
    }

    del(LOAD.export)
  }

  function flip(type: 'horizontal' | 'vertical') {
    const ctx = getCanvasContext()
    if (!ctx || !img.value)
      return

    transformScale.horizontal = type === 'horizontal' ? (transformScale.horizontal * -1) : 1
    transformScale.vertical = type === 'vertical' ? (transformScale.vertical * -1) : 1
    draw()
  }

  return {
    upload,
    update,
    setNewImage,
    rotate,
    flip,
    export: exportFile,
    revert,
    draw,
    scale,
    img,
    originalImg,
    rotation,
    currentScale,
    defaultScale,
    transformScale,
    afterDraw,
  }
})
