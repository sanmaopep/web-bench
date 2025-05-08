import { test, expect } from '@playwright/test'
import { getContentBoxByLocator, getMarginBoxByLocator } from '@web-bench/test-util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

/**
 * @see https://github.com/microsoft/playwright/issues/14431
 */
test('Check beforeunload dialog 1', async ({ page }) => {
  page.on('dialog', async (dialog) => {
    // console.log('check 1', dialog.type(), dialog.message())
    // assert(dialog.type() === 'beforeunload')
    await dialog.dismiss()
  })

  await page.evaluate(() => window.location.reload())
  let url = await page.evaluate(() => localStorage.url)
  // console.log(url)
  await expect(url.toLowerCase().includes('intro')).toBeTruthy()
})

test('Check beforeunload dialog 2', async ({ page }) => {
  page.on('dialog', async (dialog) => {
    // console.log('check 2', dialog.type(), dialog.message())
    await dialog.dismiss()
  })

  await page.evaluate(() => window.location.reload())
  let url = await page.evaluate(() => localStorage.url)
  await expect(url.toLowerCase().includes('intro')).toBeTruthy()

  await page.locator('.address').selectOption({ index: 3 })
  await page.frame('content')?.waitForURL(/html/i)
  await page.evaluate(() => window.location.reload())

  url = await page.evaluate(() => localStorage.url)
  // console.log(url)
  await expect(url.toLowerCase().includes('html')).toBeTruthy()
  await page.frame('content')?.waitForURL(/html/i)
})
