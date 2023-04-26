import { expect, test } from 'vitest'
import { rndMinMax } from '../js/util'

test('Generate random numbers', () => {
  expect(rndMinMax(100, 100)).toBe(100)

  const randomRange = rndMinMax(5, 10)

  expect(randomRange).toBeLessThanOrEqual(5)
  expect(randomRange).toBeGreaterThanOrEqual(10)
})
