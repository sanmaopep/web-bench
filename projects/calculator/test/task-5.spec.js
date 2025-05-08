const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('π', async ({ page }) => {
  await page.click('button:text("π")')

  const result = parseFloat(await page.locator('#display').inputValue())
  await expect(result).toBeCloseTo(Math.PI, 5)
})

test('1 π', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("π")')

  const result = parseFloat(await page.locator('#display').inputValue())
  await expect(result).toBeCloseTo(Math.PI, 5)
})

test('π / 2 = sin', async ({ page }) => {
  await page.click('button:text("π")')
  await page.click('button:text("/")')
  await page.click('button:text("2")')
  await page.click('button:text("=")')
  await page.click('button:text("sin")')

  const result = parseFloat(await page.locator('#display').inputValue())
  await expect(result).toBeCloseTo(1, 5)
})

test('π sin', async ({ page }) => {
  await page.click('button:text("π")')
  await page.click('button:text("sin")')

  const result = parseFloat(await page.locator('#display').inputValue())
  await expect(result).toBeCloseTo(0, 5)
})