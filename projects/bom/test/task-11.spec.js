import { test, expect } from '@playwright/test'
import { getContentBoxByLocator, getMarginBoxByLocator } from '@web-bench/test-util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.forward menu', async ({ page }) => {
  const contentFrame = page.frame('content')
  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/intro/i)

  await page.locator('.forward').click({ button: 'right' })
  await expect(page.locator('.forward-menu')).toBeVisible()
})

test('.forward menu items', async ({ page }) => {
  const contentFrame = page.frame('content')
  await page.locator('.address').selectOption({ index: 3 })
  await contentFrame?.waitForURL(/html/i)
  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/html/i)
  await page.locator('.back').click()
  await contentFrame?.waitForURL(/intro/i)

  await page.locator('.forward').click({ button: 'right' })
  await expect(page.locator('.forward-menu .menu-item')).toHaveCount(2)
  await expect(page.locator('.forward-menu .menu-item').nth(0)).toContainText(/nodejs/i)
  await expect(page.locator('.forward-menu .menu-item').nth(1)).toContainText(/html/i)
})

test('.forward menu item click', async ({ page }) => {
  const contentFrame = page.frame('content')
  await page.locator('.address').selectOption({ index: 3 })
  await contentFrame?.waitForURL(/html/i)
  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/html/i)
  await page.locator('.back').click()
  await contentFrame?.waitForURL(/intro/i)

  await page.locator('.forward').click({ button: 'right' })
  await expect(page.locator('.forward-menu .menu-item').nth(1)).toContainText(/html/i)
  await page.locator('.forward-menu .menu-item').nth(1).click()
  await contentFrame?.waitForURL(/html/i)

  await expect(page.locator('.forward')).toHaveAttribute('disabled')
  await page.locator('.back').click({ button: 'right' })
  await expect(page.locator('.back-menu .menu-item')).toHaveCount(1)
  await expect(page.locator('.back-menu .menu-item').nth(0)).toContainText(/intro/i)
})

test('.forward & menu', async ({ page }) => {
  const contentFrame = page.frame('content')
  await page.locator('.address').selectOption({ index: 3 })
  await contentFrame?.waitForURL(/html/i)
  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/html/i)
  await page.locator('.back').click()
  await contentFrame?.waitForURL(/intro/i)

  await page.locator('.forward').click()
  await contentFrame?.waitForURL(/html/i)

  await page.locator('.forward').click({ button: 'right' })
  await expect(page.locator('.forward-menu .menu-item')).toHaveCount(1)
  await expect(page.locator('.forward-menu .menu-item').nth(0)).toContainText(/nodejs/i)
})
