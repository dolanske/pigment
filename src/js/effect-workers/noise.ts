import { rndMinMax, setRGB } from '../util'

onmessage = (e: MessageEvent) => {
  const {
    imageData,
    noiseIntensity,
  }: {
    imageData: ImageData
    noiseIntensity: number
  } = e.data
  const transformed = new ImageData(imageData.width, imageData.height)

  for (let i = 0; i < imageData.data.length; i += 4) {
    const [r, g, b, a] = imageData.data.slice(i, i + 4)
    // REVIEW (is this needed?): use noiseIntensity to determine the final multiplier
    // TODO: figure out how to apply different types of noise
    // - randomly choose which channel gets updated (Rgb)
    // - only apply to alpha

    setRGB(transformed.data, i,
      rndMinMax(r - noiseIntensity, r + noiseIntensity),
      rndMinMax(g - noiseIntensity, g + noiseIntensity),
      rndMinMax(b - noiseIntensity, b + noiseIntensity),
      a)
  }

  postMessage({ transformed })
}
