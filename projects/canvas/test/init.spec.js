const { test, expect } = require('@playwright/test')
const { getOffset, expectTolerance } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})


test('should create canvas element with correct dimensions', async ({ page }) => {
  // Check if canvas element exists
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible()

  // Check canvas dimensions
  const width = await canvas.evaluate((el) => el.width)
  const height = await canvas.evaluate((el) => el.height)
  
  expect(width/height).toBe(0.75) 
})