import { expect, test } from 'vitest'
import { clamp, rndMinMax } from '../js/util'

test('Generate random numbers', () => {
  expect(rndMinMax(100, 100)).toBe(100)

  const randomRange = rndMinMax(5, 10)

  expect(randomRange).toBeGreaterThanOrEqual(5)
  expect(randomRange).toBeLessThanOrEqual(10)
})

test('Numbers to fit in the range', () => {
  expect(clamp(0, 5, 10)).toBe(5)
  expect(clamp(0, 5, 10)).toBe(5)
  expect(clamp(0, 15, 10)).toBe(10)
  expect(clamp(0, -100, 10)).toBe(0)
})
