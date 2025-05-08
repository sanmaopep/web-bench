const { test, expect } = require('@playwright/test')
const { clamp } = require('./util.js')

test('clamp', async ({ page }) => {
  expect(clamp(1, 0, 2)).toBe(1)
  expect(clamp(0, 0, 2)).toBe(0)
  expect(clamp(-1, 0, 2)).toBe(0)
  expect(clamp(2, 0, 2)).toBe(2)
  expect(clamp(3, 0, 2)).toBe(2)
})
