const { test, expect } = require('@playwright/test')
const { getOffset } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/xxxxxxxxxxxx')
})

test('/xxxxxxxxxxxx which is a 404 Page', async ({ page }) => {
  await expect(
    page.getByText('Oops! Looks like you have wandered off the beaten path.')
  ).toBeVisible()
})

test('Test go back to home', async ({ page }) => {
  await page.locator(`.not-found-go-to-home`).click()
  await expect(page).toHaveURL('/')
  await expect(page.getByText('Welcome to Shopping Mart').first()).toBeVisible()
})

test('Test go to home From Header', async ({ page }) => {
  await page.getByText('WebBench Shopping Mart').click()
  await expect(page).toHaveURL('/')
  await expect(page.getByText('Welcome to Shopping Mart').first()).toBeVisible()
})

test('Check 404 Page Layout', async ({ page }) => {
  await expect(page.getByText('WebBench Shopping Mart')).toBeVisible()
  await expect(page.getByText('Copyright: Web Bench')).toBeVisible()
})
