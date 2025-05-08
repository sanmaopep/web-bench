import { test, expect } from '@playwright/test'
import { getContentBoxByLocator, getMarginBoxByLocator } from '@web-bench/test-util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.theme', async ({ page }) => {
  await expect(page.locator('.theme')).toBeVisible()
  await expect(page.locator('.theme option')).toHaveCount(2)
  await expect(page.locator('.theme option').nth(0)).toHaveAttribute('value', 'dark')
  await expect(page.locator('.theme option').nth(1)).toHaveAttribute('value', 'light')
})

test('change theme, index.html', async ({ page }) => {
  await page.locator('.theme').selectOption({ index: 1 })
  await expect(page.locator('body')).toHaveClass('light')
  await page.locator('.theme').selectOption({ index: 0 })
  await expect(page.locator('body')).toHaveClass('dark')
})

test('change theme, current doc page', async ({ page }) => {
  const contentFrame = page.frame('content')
  await expect(contentFrame).toBeDefined()
  if (!contentFrame) return

  await page.locator('.theme').selectOption({ index: 1 })
  await expect(contentFrame.locator('body')).toHaveClass('light')
  await page.locator('.theme').selectOption({ index: 0 })
  await expect(contentFrame.locator('body')).toHaveClass('dark')
})

test('change theme, change doc page', async ({ page }) => {
  const contentFrame = page.frame('content')
  await expect(contentFrame).toBeDefined()
  if (!contentFrame) return

  await page.locator('.theme').selectOption({ index: 1 })
  await expect(contentFrame.locator('body')).toHaveClass('light')
  await page.locator('.address').selectOption({ index: 2 })
  await expect(contentFrame.locator('body')).toHaveClass('light')
  
  await page.locator('.theme').selectOption({ index: 0 })
  await expect(contentFrame.locator('body')).toHaveClass('dark')
  await page.locator('.address').selectOption({ index: 1 })
  await expect(contentFrame.locator('body')).toHaveClass('dark')
})
