const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('0 cos', async ({ page }) => {
  await page.click('button:text("0")')
  await page.click('button:text("cos")')

  await expect(page.locator('#display')).toHaveValue('1')
})

test('1 cos', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("cos")')

  const result = parseFloat(await page.locator('#display').inputValue())
  await expect(result).toBeCloseTo(0.5403023058681398, 5)
})

test('0 tan', async ({ page }) => {
  await page.click('button:text("0")')
  await page.click('button:text("tan")')

  await expect(page.locator('#display')).toHaveValue('0')
})

test('1 tan', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("tan")')

  const result = parseFloat(await page.locator('#display').inputValue())
  await expect(result).toBeCloseTo(1.5574077246549023, 5)
})

test('1 sinh', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("sinh")')

  const result = parseFloat(await page.locator('#display').inputValue())
  await expect(result).toBeCloseTo(1.175201193643801, 5)
})

test('1 cosh', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("cosh")')

  const result = parseFloat(await page.locator('#display').inputValue())
  await expect(result).toBeCloseTo(1.543080634815244, 5)
})
