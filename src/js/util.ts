export function rndMinMax(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}

export function compare(firstR: number, secondR: number, threshold: number) {
  return Math.abs(firstR - secondR) <= threshold
}

export function clamp(min: number, value: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/**
 * Inserts a pixel within an ImageData data Array. Each pixel takes 4
 * spaces within that array so to use this method the pixel iterator
 * must be jumping by 4 steps each
 *
 *
 */
export function setRGB(imageData: Uint8ClampedArray, index: number, r = 0, g = 0, b = 0, a = 255) {
  imageData[index] = clamp(0, r, 255)
  imageData[index + 1] = clamp(0, g, 255)
  imageData[index + 2] = clamp(0, b, 255)
  imageData[index + 3] = clamp(0, a, 255)
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
