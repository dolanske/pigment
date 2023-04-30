import { and, clamp, compare, or, setRGB } from '../util'

onmessage = (event) => {
  const {
    imageData,
    hard = false,
    threshold = 10,
    // options
  }: {
    imageData: ImageData
    hard?: boolean
    threshold?: number
  } = event.data

  const transformed = new ImageData(imageData.width, imageData.height)

  // Store colors in a set of number unions
  // Could have also used an { r,g,b } object
  const similar: Set<[number, number, number]> = new Set()

  const expectedIterations = imageData.data.length
  let currentPercentage = 0

  // Transform data
  for (let i = 0; i < imageData.data.length; i += 4) {
    const [r, g, b, a] = imageData.data.slice(i, i + 4)

    if (i === 0)
      similar.add([r, g, b])

    let foundSimilar = false

    // Iterate over available similar colors
    for (const value of similar.values()) {
      // Split each into 3 strings of length 2
      const [similarR, similarG, similarB] = value

      // If ANY of the new R/G/B values are withing the threshold, return the saved ones instead
      if (hard
        // Hard reduce will be transformed if R || G || B passes
        ? or(compare(similarR, r, threshold), compare(similarG, g, threshold), compare(similarB, b, threshold))
        // Soft only passes if all R && G && B values are passing
        : and(compare(similarR, r, threshold), compare(similarG, g, threshold), compare(similarB, b, threshold))
      ) {
        foundSimilar = true
        setRGB(transformed.data, i, similarR, similarG, similarB, a)
        break
      }
    }

    if (!foundSimilar) {
      similar.add([r, g, b])
      setRGB(transformed.data, i, r, g, b, a)
    }

    // Calculate percentage
    const percentage = clamp(0, Math.round((100 / expectedIterations) * i), 100)
    if (percentage > currentPercentage) {
      postMessage({ progress: percentage })
      currentPercentage = percentage
    }
  }

  postMessage({ transformed })
}
