const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('toggle button exists', async ({ page }) => {
  await expect(page.locator('button#toggle')).toBeInViewport()
})

test('toggle button click', async ({ page }) => {
  const values = ['light', 'dark']

  const text1 = await page.locator('button#toggle').textContent()
  await expect(text1 && values.includes(text1.toLowerCase())).toBeTruthy()

  await page.click('button#toggle')
  const text2 = await page.locator('button#toggle').textContent()
  await expect(text2 && values.includes(text2.toLowerCase())).toBeTruthy()
})
