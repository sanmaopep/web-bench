const { test, expect } = require('@playwright/test')
const { getOffset } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check HomePage Layout', async ({ page }) => {
  await expect(page.getByText('WebBench Shopping Mart')).toBeVisible()
  await expect(page.getByText('Copyright: Web Bench')).toBeVisible()
})

test('Check LoginPage Layout', async ({ page }) => {
  await page.goto('/login')

  await expect(page.getByText('WebBench Shopping Mart')).toBeVisible()
  await expect(page.getByText('Copyright: Web Bench')).toBeVisible()
})

test('header fixed top', async ({ page }) => {
  const o1 = await getOffset(page, 'header')
  const o2 = await getOffset(page, ':has-text("Welcome to Shopping Mart")')

  expect(o1.top).toBeLessThanOrEqual(o2.top)
})

test('footer fixed bottom', async ({ page }) => {
  const o1 = await getOffset(page, 'footer')
  const o2 = await getOffset(page, ':has-text("Welcome to Shopping Mart")')

  expect(o1.top).toBeGreaterThanOrEqual(o2.top)
})
