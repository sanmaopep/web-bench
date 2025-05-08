import { test, expect } from '@playwright/test'
import { getContentBoxByLocator, getMarginBoxByLocator } from '@web-bench/test-util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.back menu', async ({ page }) => {
  const contentFrame = page.frame('content')
  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click({ button: 'right' })
  await expect(page.locator('.back-menu')).toBeVisible()
})

test('.back menu items', async ({ page }) => {
  const contentFrame = page.frame('content')
  await page.locator('.address').selectOption({ index: 3 })
  await contentFrame?.waitForURL(/html/i)
  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click({ button: 'right' })
  await expect(page.locator('.back-menu .menu-item')).toHaveCount(2)
  await expect(page.locator('.back-menu .menu-item').nth(0)).toContainText(/intro/i)
  await expect(page.locator('.back-menu .menu-item').nth(1)).toContainText(/html/i)
})

test('.back menu item click', async ({ page }) => {
  const contentFrame = page.frame('content')
  await page.locator('.address').selectOption({ index: 3 })
  await contentFrame?.waitForURL(/html/i)
  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click({ button: 'right' })
  await expect(page.locator('.back-menu .menu-item').nth(0)).toContainText(/intro/i)
  await page.locator('.back-menu .menu-item').nth(0).click()
  await contentFrame?.waitForURL(/intro/i)

  await page.locator('.back').click({ button: 'right' })
  await expect(page.locator('.back-menu .menu-item')).toHaveCount(3)
  await expect(page.locator('.back-menu .menu-item').nth(0)).toContainText(/intro/i)
  await expect(page.locator('.back-menu .menu-item').nth(1)).toContainText(/html/i)
  await expect(page.locator('.back-menu .menu-item').nth(2)).toContainText(/nodejs/i)
})

test('.back & menu', async ({ page }) => {
  const contentFrame = page.frame('content')
  await page.locator('.address').selectOption({ index: 3 })
  await contentFrame?.waitForURL(/html/i)
  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/html/i)

  await page.locator('.back').click({ button: 'right' })
  await expect(page.locator('.back-menu .menu-item')).toHaveCount(1)
  await expect(page.locator('.back-menu .menu-item').nth(0)).toContainText(/intro/i)
})
