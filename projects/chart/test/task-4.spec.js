import { expect, test } from '@playwright/test'
import {
  expectTolerance,
  getComputedStyleByLocator,
  getOffsetByLocator,
} from '@web-bench/test-util'
import { data, getUnionRect, hasUniqueValues } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  await page.locator('#legends').uncheck()
  await page.locator('#legends').check()
})

test('LineChart | uncheck #legends', async ({ page }) => {
  await page.locator('#legends').uncheck()
  await expect(page.locator('.chart .legends')).not.toBeAttached()
})

test('LineChart | check #legends', async ({ page }) => {
  await page.locator('#legends').check()
  await expect(page.locator('.chart .legends')).toBeAttached()
  const rect1 = await getOffsetByLocator(page.locator('.chart .datasets'))

  await page.locator('#legends').uncheck()
  const rect2 = await getOffsetByLocator(page.locator('.chart .datasets'))

  await expect(rect1.height).toBeLessThan(rect2.height)
  await expect(rect1.width).toBeCloseTo(rect2.width)
})

test('LineChart | legends', async ({ page }) => {
  await expect(page.locator('.chart .legends')).toHaveCount(1)
  await expect(page.locator('.chart .legend')).toHaveCount(3)
  await expect(page.locator('.chart .legend-0')).toBeAttached()
  await expect(page.locator('.chart .legend-1')).toBeAttached()
  await expect(page.locator('.chart .legend-2')).toBeAttached()
})

test('LineChart | legend content', async ({ page }) => {
  const dot = page.locator('.chart .legend-0 circle')
  const style = await getComputedStyleByLocator(page.locator('.chart .dataset-0'))

  await expect(dot).toBeAttached()
  await expect(dot).toHaveCSS('fill', style.stroke)
  await expect(page.locator('.chart .legend-0 text')).toHaveText(data.datasets[0].label)
  await expect(page.locator('.chart .legend-1 text')).toHaveText(data.datasets[1].label)
  await expect(page.locator('.chart .legend-2 text')).toHaveText(data.datasets[2].label)
})
