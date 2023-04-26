import { useLoading } from '../store/loading'

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

export function addNoise(imageData: ImageData, noiseIntensity: number) {
  // Don't perform effect if noiseIntensity is at 0, simply return the
  // same image
  if (noiseIntensity === 0)
    return Promise.resolve(imageData)

  return runWorker({ imageData, noiseIntensity }, './effect-workers/noise.ts')
}

export function addReduction(imageData: ImageData, hard?: boolean, threshold?: number) {
  return runWorker({ imageData, hard, threshold }, './effect-workers/reduce.ts')
}
