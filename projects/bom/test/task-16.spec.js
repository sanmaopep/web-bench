import { test, expect } from '@playwright/test'
import { getContentBoxByLocator, getMarginBoxByLocator } from '@web-bench/test-util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('1 new page, change index.html theme, use postMessage', async ({ page }) => {
  const contentFrame = page.frame('content')
  await expect(contentFrame).toBeDefined()
  if (!contentFrame) return

  await contentFrame.waitForURL(/intro/i)
  expect(page.locator('body')).toHaveClass('dark')

  let [newPage] = await Promise.all([
    page.waitForEvent('popup'), // Wait for the new page to open
    await contentFrame.locator('.open').click(),
  ])
  await expect(newPage.locator('body')).toHaveClass('dark')

  await page.locator('.theme').selectOption({ value: 'light' })
  await expect(newPage.locator('body')).toHaveClass('light')
})

test('new pages, change index.html theme, use postMessage', async ({ page }) => {
  const contentFrame = page.frame('content')
  await expect(contentFrame).toBeDefined()
  if (!contentFrame) return

  await contentFrame.waitForURL(/intro/i)
  expect(page.locator('body')).toHaveClass('dark')

  const [newPage1] = await Promise.all([
    page.waitForEvent('popup'), // Wait for the new page to open
    await contentFrame.locator('.open').click(),
  ])

  // await page.locator('.address').selectOption({ index: 4 })
  // await contentFrame.waitForURL(/nodejs/i)
  const [newPage2] = await Promise.all([
    page.waitForEvent('popup'), // Wait for the new page to open
    await contentFrame.locator('.open').click(),
  ])

  await expect(newPage1.locator('body')).toHaveClass('dark')
  await expect(newPage2.locator('body')).toHaveClass('dark')
  await page.locator('.theme').selectOption({ value: 'light' })
  await expect(newPage1.locator('body')).toHaveClass('light')
  await expect(newPage2.locator('body')).toHaveClass('light')
})
