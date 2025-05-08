import { test, devices, expect } from '@playwright/test'
import { getContentBoxByLocator, getMarginBoxByLocator } from '@web-bench/test-util'

// test.beforeEach(async ({ page }) => {
//   await page.goto('/index.html')
// })

test('geolocation default', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation'],
  });
  const page = await context.newPage();
  await page.goto('/index.html');

  await expect(page.locator('.geolocation')).not.toHaveClass(/reached/i)
})

test('geolocation reached', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation'],
  });
  const page = await context.newPage();
  await page.goto('/index.html');

  await context.setGeolocation({ latitude: 30, longitude: 120 })
  await page.waitForTimeout(10)
  await expect(page.locator('.geolocation')).toHaveClass(/reached/i)
})

test('geolocation not reached', async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['geolocation'],
  });
  const page = await context.newPage();
  await page.goto('/index.html');

  await context.setGeolocation({ latitude: 30, longitude: 120 })
  await page.waitForTimeout(10)
  await expect(page.locator('.geolocation')).toHaveClass(/reached/i)

  // clear watch after reaching
  await context.setGeolocation({ latitude: 0, longitude: 0 })
  await page.waitForTimeout(10)
  await expect(page.locator('.geolocation')).toHaveClass(/reached/i)
})
