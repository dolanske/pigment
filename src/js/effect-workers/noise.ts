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

  console.log(imageData.data.length / 4)

  for (let i = 0; i < imageData.data.length; i += 4) {
    const [r, g, b, a] = imageData.data.slice(i, i + 4)
    // TODO: figure out how to apply different types of noise
    // - randomly choose which channel gets updated (Rgb)
    // - only apply to alpha

    // https://en.wikipedia.org/wiki/Image_noise?useskin=vector

    let randomR: number = r
    let randomG: number = g
    let randomB: number = b

    if (isGrayscale) {
      if (rndMinMax(0, noiseIntensity) === 4) {
        const grayscale = randomR * 0.3 + randomG * 0.59 + randomB * 0.11
        randomR = grayscale / 0.05
        randomG = grayscale / 0.05
        randomB = grayscale / 0.05
      }
    }
    else {
      randomR = rndMinMax(r - noiseIntensity, r + noiseIntensity)
      randomG = rndMinMax(g - noiseIntensity, g + noiseIntensity)
      randomB = rndMinMax(b - noiseIntensity, b + noiseIntensity)
    }

    setRGB(transformed.data, i,
      randomR,
      randomG,
      randomB,
      a)
  }

  console.log('completed')

  postMessage({ transformed })
}
