import { test, expect } from '@playwright/test'
import { getContentBoxByLocator, getMarginBoxByLocator } from '@web-bench/test-util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('new page theme default', async ({ page }) => {
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
})

test('new page theme, change index.html theme', async ({ page }) => {
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
  ;[newPage] = await Promise.all([
    page.waitForEvent('popup'), // Wait for the new page to open
    await contentFrame.locator('.open').click(),
  ])
  await expect(newPage.locator('body')).toHaveClass('light')
})

test('new page theme, change index.html theme 2', async ({ page }) => {
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
  await newPage.evaluate(() => location.reload())
  await expect(newPage.locator('body')).toHaveClass('light')
})
