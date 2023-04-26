import {rnd}

onmessage = (e: MessageEvent) => {
  const {
    imageData,
    noiseAmount,
  }: {
    imageData: ImageData
    noiseAmount: number
    canvas: HTMLCanvasElement
  } = e.data
  // const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
  const transformedData = new ImageData(imageData.width, imageData.height)

  for (let i = 0; i < imageData.data.length; i += 4) {
    const [r, g, b, a] = imageData.data.slice(i, i + 4)
    // TODO: use noiseAmount to determine the final multiplier
    // const modifier = rndMinMax(0, 10) === 5 ? 3 : 1

    transformedData.data[i] = r
    transformedData.data[i + 1] = g
    transformedData.data[i + 2] = b
    transformedData.data[i + 3] = a
  }

  postMessage(transformedData)
}
