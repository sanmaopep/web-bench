import { test, expect } from '@playwright/test'
import { getContentBoxByLocator, getMarginBoxByLocator } from '@web-bench/test-util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.open button in iframe', async ({ page }) => {
  const contentFrame = page.frame('content')
  await expect(contentFrame).toBeDefined()
  if (!contentFrame) return

  await contentFrame.waitForURL(/intro/i)
  await expect(contentFrame.locator('.open')).toBeVisible()
})

test('.open button in more doc pages', async ({ page }) => {
  const contentFrame = page.frame('content')
  await expect(contentFrame).toBeDefined()
  if (!contentFrame) return

  await page.locator('.address').selectOption({ index: 1 })
  await contentFrame?.waitForURL(/javascript/i)
  await expect(contentFrame.locator('.open')).toBeVisible()

  await page.locator('.address').selectOption({ index: 2 })
  await contentFrame?.waitForURL(/css/i)
  await expect(contentFrame.locator('.open')).toBeVisible()

  await page.locator('.address').selectOption({ index: 3 })
  await contentFrame?.waitForURL(/html/i)
  await expect(contentFrame.locator('.open')).toBeVisible()

  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)
  await expect(contentFrame.locator('.open')).toBeVisible()
})

test('click .open button in iframe', async ({ page }) => {
  const contentFrame = page.frame('content')
  await expect(contentFrame).toBeDefined()
  if (!contentFrame) return

  await contentFrame.waitForURL(/intro/i)

  const [newPage] = await Promise.all([
    page.waitForEvent('popup'), // Wait for the new page to open
    await contentFrame.locator('.open').click(),
  ])
  // console.log('New window opened with URL:', newPage.url());
  await expect(newPage.url().toLowerCase().includes('intro')).toBeTruthy()
  await expect(newPage.locator('.open')).not.toBeVisible()
})

test('.open button not in iframe', async ({ page }) => {
  await page.goto('/docs/intro.html')
  await expect(page.locator('.open')).not.toBeVisible()
})
