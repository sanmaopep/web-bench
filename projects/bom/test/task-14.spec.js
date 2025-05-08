import { test, expect } from '@playwright/test'
import { getContentBoxByLocator, getMarginBoxByLocator } from '@web-bench/test-util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.close button in iframe', async ({ page }) => {
  const contentFrame = page.frame('content')
  await expect(contentFrame).toBeDefined()
  if (!contentFrame) return

  await contentFrame.waitForURL(/intro/i)
  await expect(contentFrame.locator('.close')).not.toBeVisible()
})

test('.close button in more doc pages', async ({ page }) => {
  const contentFrame = page.frame('content')
  await expect(contentFrame).toBeDefined()
  if (!contentFrame) return

  await page.locator('.address').selectOption({ index: 1 })
  await contentFrame?.waitForURL(/javascript/i)
  let [newPage] = await Promise.all([
    page.waitForEvent('popup'), // Wait for the new page to open
    await contentFrame.locator('.open').click(),
  ])
  await expect(newPage.locator('.close')).toBeVisible()

  await page.locator('.address').selectOption({ index: 2 })
  await contentFrame?.waitForURL(/css/i)
  ;[newPage] = await Promise.all([
    page.waitForEvent('popup'), // Wait for the new page to open
    await contentFrame.locator('.open').click(),
  ])
  await expect(newPage.locator('.close')).toBeVisible()

  await page.locator('.address').selectOption({ index: 3 })
  await contentFrame?.waitForURL(/html/i)
  ;[newPage] = await Promise.all([
    page.waitForEvent('popup'), // Wait for the new page to open
    await contentFrame.locator('.open').click(),
  ])
  await expect(newPage.locator('.close')).toBeVisible()

  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)
  ;[newPage] = await Promise.all([
    page.waitForEvent('popup'), // Wait for the new page to open
    await contentFrame.locator('.open').click(),
  ])
  await expect(newPage.locator('.close')).toBeVisible()
})

test('click .close button', async ({ page }) => {
  const contentFrame = page.frame('content')
  await expect(contentFrame).toBeDefined()
  if (!contentFrame) return

  await contentFrame.waitForURL(/intro/i)

  const [newPage] = await Promise.all([
    page.waitForEvent('popup'), // Wait for the new page to open
    await contentFrame.locator('.open').click(),
  ])
  await expect(newPage.locator('.close')).toBeVisible()

  const closePromise = newPage.waitForEvent('close')
  await newPage.locator('.close').click()
  await closePromise
})

test('.close button not in iframe', async ({ page }) => {
  await page.goto('/docs/intro.html')
  await expect(page.locator('.close')).not.toBeVisible()
})
