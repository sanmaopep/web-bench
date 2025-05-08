import { expect, test } from '@playwright/test'
import {
  expectTolerance,
  getComputedStyleByLocator,
  getOffsetByLocator,
} from '@web-bench/test-util'
import { data, getUnionRect } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  await page.locator('#dataLabels').check()
  await page.locator('#pointStyle').selectOption({ index: 1 })
})

test('LineChart | click legend to hide', async ({ page }) => {
  await expect(page.locator('.chart .dataset-0')).not.toHaveClass(/hidden/)
  await expect(page.locator('.chart .dataLabels-0')).not.toHaveClass(/hidden/)
  await expect(page.locator('.chart .points-0')).not.toHaveClass(/hidden/)

  await page.locator('.chart .legend-0 circle').click()
  await expect(page.locator('.chart .dataset-0')).toHaveClass(/hidden/)
  await expect(page.locator('.chart .dataLabels-0')).toHaveClass(/hidden/)
  await expect(page.locator('.chart .points-0')).toHaveClass(/hidden/)
})

test('LineChart | click legend to show', async ({ page }) => {
  await expect(page.locator('.chart .dataset-0')).not.toHaveClass(/hidden/)
  await expect(page.locator('.chart .dataLabels-0')).not.toHaveClass(/hidden/)
  await expect(page.locator('.chart .points-0')).not.toHaveClass(/hidden/)

  await page.locator('.chart .legend-0 circle').click()
  await expect(page.locator('.chart .dataset-0')).toHaveClass(/hidden/)
  await expect(page.locator('.chart .dataLabels-0')).toHaveClass(/hidden/)
  await expect(page.locator('.chart .points-0')).toHaveClass(/hidden/)

  await page.locator('.chart .legend-0 circle').click()
  await expect(page.locator('.chart .dataset-0')).not.toHaveClass(/hidden/)
  await expect(page.locator('.chart .dataLabels-0')).not.toHaveClass(/hidden/)
  await expect(page.locator('.chart .points-0')).not.toHaveClass(/hidden/)
})
