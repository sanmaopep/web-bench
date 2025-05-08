import { test, expect } from '@playwright/test'
import { getContentBoxByLocator, getMarginBoxByLocator } from '@web-bench/test-util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

/**
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<number>}
 */
async function getReadingTime(page) {
  return parseFloat((await page.locator('.reading-time').textContent()) ?? '0')
}

test('.reading-time', async ({ page }) => {
  await expect(page.locator('.reading-time')).toBeVisible()
  await expect(await getReadingTime(page)).toBe(0)

  await page.waitForTimeout(200)
  await expect(await getReadingTime(page)).toBeGreaterThan(0)
})

test('change doc page', async ({ page }) => {
  await page.waitForTimeout(200)
  await expect(await getReadingTime(page)).toBeGreaterThan(0)

  await page.locator('.address').selectOption({ index: 4 })
  await page.frame('content')?.waitForURL(/nodejs/i)
  await expect(await getReadingTime(page)).toBe(0)
})

test('change doc page by backward', async ({ page }) => {
  const contentFrame = page.frame('content')

  await page.locator('.address').selectOption({ index: 4 })
  await contentFrame?.waitForURL(/nodejs/i)
  await page.waitForTimeout(200)
  await expect(await getReadingTime(page)).toBeGreaterThan(0)

  await page.locator('.back').click()
  await contentFrame?.waitForURL(/intro/i)
  await expect(await getReadingTime(page)).toBe(0)
})

/**
 * @param {import('@playwright/test').Page} page
 * @see https://github.com/microsoft/playwright/issues/2286#issuecomment-1442368623
 */
async function simulatePageVisibility(page, hide = true) {
  await page.evaluate((hide) => {
    Object.defineProperty(document, 'visibilityState', {
      value: hide ? 'hidden' : 'visible',
      writable: true,
    })
    Object.defineProperty(document, 'hidden', { value: hide, writable: true })
    document.dispatchEvent(new Event('visibilitychange'))
  }, hide)
}

test('visibility change', async ({ page }) => {
  await expect(await getReadingTime(page)).toBe(0)
  await simulatePageVisibility(page, true)
  await page.waitForTimeout(200)
  await expect(await getReadingTime(page)).toBe(0)
  await simulatePageVisibility(page, false)
  await page.waitForTimeout(200)
  await expect(await getReadingTime(page)).toBeGreaterThan(0)
})
