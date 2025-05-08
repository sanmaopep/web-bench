import { test, expect } from '@playwright/test'
import { getContentBoxByLocator, getMarginBoxByLocator } from '@web-bench/test-util';

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.toolbar buttons', async ({ page }) => {
  await expect(page.locator('.toolbar .homepage')).toBeVisible()
  await expect(page.locator('.toolbar .back')).toBeVisible()
  await expect(page.locator('.toolbar .forward')).toBeVisible()
  await expect(page.locator('.toolbar .refresh')).toBeVisible()
})

// test('elements together fill .topbar', async ({ page }) => {
//   const topbar = await getContentBoxByLocator(page.locator('.topbar'))
//   const toolbar = await getMarginBoxByLocator(page.locator('.toolbar'))
//   await expect(toolbar.height).toBeCloseTo(topbar.height)
// })

test('.homepage', async ({ page }) => {
  const contentFrame = page.frame('content')
  const options = page.locator('.address option')
  const url0 = (await options.nth(0).getAttribute('value')) ?? ''
  await expect(page.locator('.content')).toHaveAttribute('src', url0)
  await contentFrame?.waitForURL(/intro/i)

  await page.locator('.homepage').click()

  await contentFrame?.waitForURL(/intro/i)
})

test('.back', async ({ page }) => {
  const contentFrame = page.frame('content')
  
  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/intro/i)
})

test('.forward', async ({ page }) => {
  const contentFrame = page.frame('content')
  
  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/intro/i)

  await page.locator('.forward').click()
  await contentFrame?.waitForURL(/nodejs/i)
})

test('.refresh', async ({ page }) => {
  const contentFrame = page.frame('content')
  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.refresh').click()
  await contentFrame?.waitForURL(/nodejs/i)
})

test('combo actions', async ({ page }) => {
  const contentFrame = page.frame('content')

  await contentFrame?.waitForURL(/intro/i)

  await page.locator('.address').selectOption({ index: 2 })
  await contentFrame?.waitForURL(/css/i)

  await page.locator('.address').selectOption({ index: 3 })
  await contentFrame?.waitForURL(/html/i)

  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/html/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/css/i)

  await page.locator('.forward').click()
  await contentFrame?.waitForURL(/html/i)

  await page.locator('.refresh').click()
  await contentFrame?.waitForURL(/html/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/css/i)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/intro/i)

  // disabled
  // await page.locator('.back').click()
  // await contentFrame?.waitForURL(/intro/i)
})
