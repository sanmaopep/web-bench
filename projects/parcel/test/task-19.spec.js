const { test, expect } = require('@playwright/test')

test(`Image in markdown should be displayed correctly`, async ({ page }) => {
  await page.goto(`/index.html`)

  const imageWidth =  await page.getByAltText('markdown-bird-image').evaluate(el => {
    return el.naturalWidth
  })
  await expect(imageWidth).toBeGreaterThan(0)
})