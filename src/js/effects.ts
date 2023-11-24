import { useLoading } from '../store/loading'
import { clamp } from '../js/util'

interface WorkerMessage {
  progress?: number
  transformed?: ImageData
}

interface WorkerParams {
  imageData: ImageData
  [key: string]: unknown
}

function runWorker(params: WorkerParams, workerUrl: string): Promise<ImageData> {
  const { setProgress, clearProgress } = useLoading()
  // Initialize worker
  const worker = new Worker(new URL(workerUrl, import.meta.url), {
    type: 'module',
  })

  return new Promise((resolve) => {
    worker.postMessage(params)
    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const { progress, transformed } = event.data

      // This returns the loading progress
      if (progress)
        setProgress(progress)

      // Returns the transformed ImageData which get added to the canvas
      if (transformed) {
        clearProgress()
        resolve(transformed)
      }
    }
  })
}

/**
 * Filter definitions
 */

export function addNoise(imageData: ImageData, noiseIntensity: number, isGrayscale: boolean) {
  // Don't perform effect if noiseIntensity is at 0, simply return the
  // same image
  if (noiseIntensity === 0)
    return Promise.resolve(imageData)

  return runWorker({ imageData, noiseIntensity, isGrayscale }, './effect-workers/noise.ts')
}

export function addReduction(imageData: ImageData, hard?: boolean, threshold?: number) {
  return runWorker({ imageData, hard, threshold }, './effect-workers/reduce.ts')
}

/**
 * Runs image date through (optionaly recursive) quality degradation through low
 * quality JPEG compression.
 *
 * @param imageData
 * @param quality Image quality between 0-100
 * @param repetitions How many times the function should run recursively
 */
export async function degradeQuality(data: ImageData, quality: number, repetitions = 1): Promise<ImageData> {
  // Should run AT least once no matter the input
  repetitions = Math.max(1, repetitions)
  // Run degrataion once
  let degradedData = await performDegradation(data, quality)

  if (repetitions === 1)
    return degradedData

  // Recursive run with the previous image data
  for (let i = 0; i <= repetitions; i++)
    degradedData = await performDegradation(degradedData, quality)

  return degradedData
}

// REVIEW This can be optimized if we don't create canvas & image on each run
// Instead we could create them in the `degradeQuality` function above and simply
// pass them into this function.
// Could potentially improve performance if we run the following function 50 times

function performDegradation(data: ImageData, quality: number): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    // Clamp quality to the allowed range between 0 and 100
    quality = clamp(0, quality, 100)

    const canvas = document.createElement('canvas')
    canvas.width = data.width
    canvas.height = data.height

    const ctx = canvas.getContext('2d')

    if (ctx) {
      ctx.putImageData(data, 0, 0)
      // Export data s jpeg with the provided quality (or degradation :)
      const source = canvas.toDataURL('image/jpeg', quality / 100)
      const image = new Image()
      image.src = source

      image.onload = () => {
        // Save to canvas and get data back
        ctx.drawImage(image, 0, 0, data.width, data.height)
        resolve(ctx.getImageData(0, 0, data.width, data.height))
      }

      image.onerror = () => reject(new Error('Failed to load updated image'))
    }
  })
}
