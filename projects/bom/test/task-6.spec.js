import { test, expect } from '@playwright/test'
import { getContentBoxByLocator, getMarginBoxByLocator } from '@web-bench/test-util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('intro click', async ({ page }) => {
  const contentFrame = page.frame('content')

  await contentFrame?.waitForURL(/intro/i)
  await expect(page.locator('.address')).toHaveValue(/intro/i)

  await contentFrame?.getByText(/javascript/i).click()
  await contentFrame?.waitForURL(/javascript/i)
  // console.log(await page.locator('.address').getAttribute('data-log'))
  await expect(page.locator('.address')).toHaveValue(/javascript/i)
})

test('.back', async ({ page }) => {
  const contentFrame = page.frame('content')

  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/intro/i)
  await expect(page.locator('.address')).toHaveValue(/intro/i)
})

test('.forward', async ({ page }) => {
  const contentFrame = page.frame('content')

  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/intro/i)
  await expect(page.locator('.address')).toHaveValue(/intro/i)

  await page.locator('.forward').click()
  await contentFrame?.waitForURL(/nodejs/i)
  await expect(page.locator('.address')).toHaveValue(/nodejs/i)
})
