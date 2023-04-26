function runWorker(ctx: CanvasRenderingContext2D, params: any = {}, workerUrl: string): Promise<HTMLImageElement> {
  const worker = new Worker(new URL(workerUrl, import.meta.url), {
    type: 'module',
  })

  return new Promise((resolve) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)

    worker.postMessage({
      imageData,
      ...params,
    })

    worker.onmessage = (event: MessageEvent<ImageData>) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (ctx) {
        ctx.putImageData(event.data, 0, 0)

        const image = new Image()
        image.src = ctx.canvas.toDataURL()
        image.onload = () => {
          resolve(image)
        }
      }
    }
  })
}

/**
 * Noise function
 */

export function addNoise(ctx: CanvasRenderingContext2D, noiseAmount: number) {
  return runWorker(ctx, { noiseAmount }, './effect-workers/noise.ts')
}
