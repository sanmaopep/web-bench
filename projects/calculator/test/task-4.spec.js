const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('0 sin', async ({ page }) => {
  await page.click('button:text("0")')
  await page.click('button:text("sin")')

  await expect(page.locator('#display')).toHaveValue('0')
})

test('1 sin', async ({ page }) => {
  await page.click('button:text("1")')
  await page.click('button:text("sin")')

  const result = parseFloat(await page.locator('#display').inputValue())
  await expect(result).toBeCloseTo(0.8414709848078965, 5)
})

// test('π sin', async ({ page }) => {
//   await page.click('button:text("1")')
//   await page.click('button:text("sin")')

//   const result = parseFloat(await page.locator('#display').inputValue())
//   await expect(result).toBeClose(0.8414709848078965, 5)
// })
