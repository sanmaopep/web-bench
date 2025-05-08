import { test, expect } from '@playwright/test'
import { isExisted, getViewport } from '@web-bench/test-util'
import { configs, data } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('Chart.svg', async ({ page }) => {
  await expect(page.locator(`svg#line`)).toBeAttached()

  // await expect(page.locator(`svg.chart.line`)).to(10)
  await expect(await page.locator(`svg.chart.line`).count()).toBeGreaterThanOrEqual(1)

  await expect(page.locator(`svg#line`)).toHaveAttribute('viewBox', '0 0 100 70')
})

test('LineChart', async ({ page }) => {
  await expect(page.locator(`.root svg#line`)).toBeAttached()
})
