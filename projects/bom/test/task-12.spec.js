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

  await contentFrame?.locator('body').click()
  await expect(page.locator('.back-menu')).not.toBeVisible()
})

test('.forward menu', async ({ page }) => {
  const contentFrame = page.frame('content')
  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/intro/i)

  await page.locator('.forward').click({ button: 'right' })
  await expect(page.locator('.forward-menu')).toBeVisible()

  await contentFrame?.locator('body').click()
  await expect(page.locator('.forward-menu')).not.toBeVisible()
})

test('all doc pages', async ({ page }) => {
  const contentFrame = page.frame('content')
  await page.locator('.address').selectOption({ index: 1 })
  await contentFrame?.waitForURL(/javascript/i)
  await page.locator('.back').click({ button: 'right' })
  await expect(page.locator('.back-menu')).toBeVisible()
  await contentFrame?.locator('body').click()
  await expect(page.locator('.back-menu')).not.toBeVisible()

  await page.locator('.address').selectOption({ index: 2 })
  await contentFrame?.waitForURL(/css/i)
  await page.locator('.back').click({ button: 'right' })
  await expect(page.locator('.back-menu')).toBeVisible()
  await contentFrame?.locator('body').click()
  await expect(page.locator('.back-menu')).not.toBeVisible()

  await page.locator('.address').selectOption({ index: 3 })
  await contentFrame?.waitForURL(/html/i)
  await page.locator('.back').click({ button: 'right' })
  await expect(page.locator('.back-menu')).toBeVisible()
  await contentFrame?.locator('body').click()
  await expect(page.locator('.back-menu')).not.toBeVisible()

  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)
  await page.locator('.back').click({ button: 'right' })
  await expect(page.locator('.back-menu')).toBeVisible()
  await contentFrame?.locator('body').click()
  await expect(page.locator('.back-menu')).not.toBeVisible()
})
