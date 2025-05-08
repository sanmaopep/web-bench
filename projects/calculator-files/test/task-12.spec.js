const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('top 4 rows of buttons colors ', async ({ page }) => {
  const btn1Bgcolor = await (
    await page.locator('.buttons button:nth-child(1)')
  ).evaluate((element) => window.getComputedStyle(element).backgroundColor)
  const btn4Bgcolor = await (
    await page.locator('.buttons button:nth-child(4)')
  ).evaluate((element) => window.getComputedStyle(element).backgroundColor)
  const btn8Bgcolor = await (
    await page.locator('.buttons button:nth-child(8)')
  ).evaluate((element) => window.getComputedStyle(element).backgroundColor)
  const btn12Bgcolor = await (
    await page.locator('.buttons button:nth-child(12)')
  ).evaluate((element) => window.getComputedStyle(element).backgroundColor)
  const btn16Bgcolor = await (
    await page.locator('.buttons button:nth-child(16)')
  ).evaluate((element) => window.getComputedStyle(element).backgroundColor)

  await expect(btn1Bgcolor).not.toBe(btn4Bgcolor)
  await expect(btn4Bgcolor).toBe(btn8Bgcolor)
  await expect(btn8Bgcolor).toBe(btn12Bgcolor)
  await expect(btn12Bgcolor).toBe(btn16Bgcolor)
})

test('button colors dark', async ({ page }) => {
  const btn18Bgcolor = await (
    await page.locator('.buttons button:nth-child(18)')
  ).evaluate((element) => window.getComputedStyle(element).backgroundColor)
  const btn19Bgcolor = await (
    await page.locator('.buttons button:nth-child(19)')
  ).evaluate((element) => window.getComputedStyle(element).backgroundColor)

  await expect(btn18Bgcolor).not.toBe(btn19Bgcolor)
})

test('button colors light', async ({ page }) => {
  await page.locator('#toggle').click()

  const btn18Bgcolor = await (
    await page.locator('.buttons button:nth-child(18)')
  ).evaluate((element) => window.getComputedStyle(element).backgroundColor)
  const btn19Bgcolor = await (
    await page.locator('.buttons button:nth-child(19)')
  ).evaluate((element) => window.getComputedStyle(element).backgroundColor)

  await expect(btn18Bgcolor).not.toBe(btn19Bgcolor)
})
