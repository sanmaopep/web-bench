const { test, expect } = require('@playwright/test')
const { getComputedStyleByLocator } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('default bg', async ({ page }) => {
  const style = await getComputedStyleByLocator(page.locator('.color.lab'))
  await expect(style.backgroundColor).toBe('lab(0 0 0)')
})

test('change props to show result', async ({ page }) => {
  for (let i = 0; i < 3; i++) {
    await page.locator('.lab .prop').nth(0).fill('90')
    await expect(page.locator('.lab .result').nth(0)).toContainText('90')
  }

  await page.locator('.lab .prop').nth(3).fill('0.5')
  await expect(page.locator('.lab .result').nth(3)).toContainText('0.5')
})

test('change props to change bg | component range', async ({ page }) => {
  const ranges = await page.locator('.lab input[type="range"]').all()
  await expect(ranges[0]).toHaveAttribute('min', '0')
  await expect(ranges[0]).toHaveAttribute('max', '100')
  await expect(ranges[1]).toHaveAttribute('min', '-125')
  await expect(ranges[1]).toHaveAttribute('max', '125')
  await expect(ranges[2]).toHaveAttribute('min', '-125')
  await expect(ranges[2]).toHaveAttribute('max', '125')
})

test('change props to change bg', async ({ page }) => {
  await page.locator('.lab .prop').nth(0).fill('90')
  await expect(page.locator('.lab .result').nth(0)).toContainText('90')
  let style = await getComputedStyleByLocator(page.locator('.lab'))
  await expect(style.backgroundColor).toBe('lab(90 0 0)')

  await page.locator('.lab .prop').nth(1).fill('90')
  await expect(page.locator('.lab .result').nth(1)).toContainText('90')
  style = await getComputedStyleByLocator(page.locator('.lab'))
  await expect(style.backgroundColor).toBe('lab(90 90 0)')

  await page.locator('.lab .prop').nth(2).fill('90')
  await expect(page.locator('.lab .result').nth(2)).toContainText('90')
  style = await getComputedStyleByLocator(page.locator('.lab'))
  await expect(style.backgroundColor).toBe('lab(90 90 90)')
})

test('change props to change bg | alpha', async ({ page }) => {
  await page.locator('.lab .prop').nth(3).fill('0.5')
  await expect(page.locator('.lab .result').nth(3)).toContainText('0.5')
  let style = await getComputedStyleByLocator(page.locator('.lab'))
  await expect(style.backgroundColor).toBe('lab(0 0 0 / 0.5)')
})
