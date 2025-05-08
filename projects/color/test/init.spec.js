const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('body', async ({ page }) => {
  await expect(page.locator('body')).toBeAttached()
})

test('.root', async ({ page }) => {
  await expect(page.locator('.root')).toBeAttached()
})

test('.color.rgb', async ({ page }) => {
  await expect(page.locator('.color.rgb')).toBeAttached()
  await expect(page.locator('.color.rgb .prop')).toHaveCount(4)
})

test('change props to change bg | component range', async ({ page }) => {
  const ranges = await page.locator('.rgb input[type="range"]').all()
  await expect(ranges[0]).toHaveAttribute('min', '0')
  await expect(ranges[0]).toHaveAttribute('max', '255')
  await expect(ranges[1]).toHaveAttribute('min', '0')
  await expect(ranges[1]).toHaveAttribute('max', '255')
  await expect(ranges[2]).toHaveAttribute('min', '0')
  await expect(ranges[2]).toHaveAttribute('max', '255')
})