import { rndMinMax, setRGB } from '../util'

onmessage = (e: MessageEvent) => {
  const {
    imageData,
    noiseIntensity,
    isGrayscale,
  }: {
    imageData: ImageData
    noiseIntensity: number
    isGrayscale: boolean
  } = e.data
  const transformed = new ImageData(imageData.width, imageData.height)

  for (let i = 0; i < imageData.data.length; i += 4) {
    const [r, g, b, a] = imageData.data.slice(i, i + 4)
    // REVIEW (is this needed?): use noiseIntensity to determine the final multiplier
    // TODO: figure out how to apply different types of noise
    // - randomly choose which channel gets updated (Rgb)
    // - only apply to alpha

    let randomR = rndMinMax(r - noiseIntensity, r + noiseIntensity)
    let randomG = rndMinMax(g - noiseIntensity, g + noiseIntensity)
    let randomB = rndMinMax(b - noiseIntensity, b + noiseIntensity)

    if (isGrayscale) {
      const grayscale = randomR * 0.3 + randomG * 0.59 + randomB * 0.11
      randomR = grayscale
      randomG = grayscale
      randomB = grayscale
    }

    setRGB(transformed.data, i,
      randomR,
      randomG,
      randomB,
      a)
  }

  postMessage({ transformed })
}
