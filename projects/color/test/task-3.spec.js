const { test, expect } = require('@playwright/test')
const { getComputedStyleByLocator } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('default bg', async ({ page }) => {
  const style = await getComputedStyleByLocator(page.locator('.color.hsl'))
  await expect(style.backgroundColor).toBe('rgb(0, 0, 0)')
})

test('change props to show result', async ({ page }) => {
  for (let i = 0; i < 3; i++) {
    await page.locator('.hsl .prop').nth(0).fill('90')
    await expect(page.locator('.hsl .result').nth(0)).toContainText('90')
  }

  await page.locator('.hsl .prop').nth(3).fill('0.5')
  await expect(page.locator('.hsl .result').nth(3)).toContainText('0.5')
})

test('change props to change bg | component range', async ({ page }) => {
  const ranges = await page.locator('.hsl input[type="range"]').all()
  await expect(ranges[0]).toHaveAttribute('min', '0')
  await expect(ranges[0]).toHaveAttribute('max', '360')
  await expect(ranges[1]).toHaveAttribute('min', '0')
  await expect(ranges[1]).toHaveAttribute('max', '100')
  await expect(ranges[2]).toHaveAttribute('min', '0')
  await expect(ranges[2]).toHaveAttribute('max', '100')
})

test('change props to change bg', async ({ page }) => {
  await page.locator('.hsl .prop').nth(0).fill('90')
  await expect(page.locator('.hsl .result').nth(0)).toContainText('90')
  let style = await getComputedStyleByLocator(page.locator('.hsl'))
  await expect(style.backgroundColor).toBe('rgb(0, 0, 0)')

  await page.locator('.hsl .prop').nth(1).fill('90')
  await expect(page.locator('.hsl .result').nth(1)).toContainText('90')
  style = await getComputedStyleByLocator(page.locator('.hsl'))
  await expect(style.backgroundColor).toBe('rgb(0, 0, 0)')

  await page.locator('.hsl .prop').nth(2).fill('90')
  await expect(page.locator('.hsl .result').nth(2)).toContainText('90')
  style = await getComputedStyleByLocator(page.locator('.hsl'))
  await expect(style.backgroundColor).toBe('rgb(230, 252, 207)')
})

test('change props to change bg | alpha', async ({ page }) => {
  await page.locator('.hsl .prop').nth(3).fill('0.5')
  await expect(page.locator('.hsl .result').nth(3)).toContainText('0.5')
  let style = await getComputedStyleByLocator(page.locator('.hsl'))
  await expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0.5)')
})
