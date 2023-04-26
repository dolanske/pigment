export function rndMinMax(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}

export function compare(firstR: number, secondR: number, threshold: number) {
  return Math.abs(firstR - secondR) <= threshold
}

/**
 * Inserts a pixel within an ImageData data Array. Each pixel takes 4
 * spaces within that array so to use this method the pixel iterator
 * must be jumping by 4 steps each
 *
 *
 */
export function setRGB(imageData: Uint8ClampedArray, index: number, r = 0, g = 0, b = 0, a = 255) {
  imageData[index] = clampColor(r)
  imageData[index + 1] = clampColor(g)
  imageData[index + 2] = clampColor(b)
  imageData[index + 3] = clampColor(a)
}

/**
 * Shorthand for `Array.every(check => check)`
 */
export function and(...checks: boolean[]) {
  return checks.every(b => b)
}

/**
 * Shorthand for `Array.some(check => check)`
 */
export function or(...checks: boolean[]) {
  return checks.some(b => b)
}

export function clampColor(number: number) {
  return Math.min(255, Math.max(0, number))
}
