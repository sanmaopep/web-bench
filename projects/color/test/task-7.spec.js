const { test, expect } = require('@playwright/test')
const { getComputedStyleByLocator } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('default bg', async ({ page }) => {
  const style = await getComputedStyleByLocator(page.locator('.color.oklch'))
  await expect(style.backgroundColor).toBe('oklch(0 0 0)')
})

test('change props to show result', async ({ page }) => {
  for (let i = 0; i < 3; i++) {
    await page.locator('.oklch .prop').nth(0).fill('0.2')
    await expect(page.locator('.oklch .result').nth(0)).toContainText('0.2')
  }

  await page.locator('.oklch .prop').nth(3).fill('0.5')
  await expect(page.locator('.oklch .result').nth(3)).toContainText('0.5')
})

test('change props to change bg | component range', async ({ page }) => {
  const ranges = await page.locator('.oklch input[type="range"]').all()
  await expect(ranges[0]).toHaveAttribute('min', '0')
  await expect(ranges[0]).toHaveAttribute('max', '1')
  await expect(ranges[1]).toHaveAttribute('min', '0')
  await expect(ranges[1]).toHaveAttribute('max', '0.4')
  await expect(ranges[2]).toHaveAttribute('min', '0')
  await expect(ranges[2]).toHaveAttribute('max', '360')
})

test('change props to change bg', async ({ page }) => {
  await page.locator('.oklch .prop').nth(0).fill('0.2')
  await expect(page.locator('.oklch .result').nth(0)).toContainText('0.2')
  let style = await getComputedStyleByLocator(page.locator('.oklch'))
  await expect(style.backgroundColor).toBe('oklch(0.2 0 0)')

  await page.locator('.oklch .prop').nth(1).fill('0.2')
  await expect(page.locator('.oklch .result').nth(1)).toContainText('0.2')
  style = await getComputedStyleByLocator(page.locator('.oklch'))
  await expect(style.backgroundColor).toBe('oklch(0.2 0.2 0)')

  await page.locator('.oklch .prop').nth(2).fill('180')
  await expect(page.locator('.oklch .result').nth(2)).toContainText('180')
  style = await getComputedStyleByLocator(page.locator('.oklch'))
  await expect(style.backgroundColor).toBe('oklch(0.2 0.2 180)')
})

test('change props to change bg | alpha', async ({ page }) => {
  await page.locator('.oklch .prop').nth(3).fill('0.5')
  await expect(page.locator('.oklch .result').nth(3)).toContainText('0.5')
  let style = await getComputedStyleByLocator(page.locator('.oklch'))
  await expect(style.backgroundColor).toBe('oklch(0 0 0 / 0.5)')
})
