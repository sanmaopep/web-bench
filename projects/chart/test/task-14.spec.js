import { expect, test } from '@playwright/test'
import {
  expectTolerance,
  getComputedStyleByLocator,
  getOffsetByLocator,
} from '@web-bench/test-util'
import { data, getUnionRect, TO } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  await page.locator('#type').selectOption({ value: 'bar' })
  await page.locator('#dataLabels').check()
  await page.waitForTimeout(TO)
  await expect(page.locator('svg.chart.bar')).toBeAttached()
})

test('BarChart | dataLabels', async ({ page }) => {
  await expect(page.locator('.chart .dataLabels')).toHaveCount(3)
  await expect(page.locator('.chart .dataLabels-0 .dataLabel')).toHaveCount(5)
  await expect(page.locator('.chart .dataLabels-0 .dataLabel-0')).toBeVisible()
  await expect(page.locator('.chart .dataLabels-0 .dataLabel-4')).toBeVisible()
})

test('BarChart | dataLabels color', async ({ page }) => {
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const bar = page.locator(`.chart .dataset-${i} .bar-0`)
    const style = await getComputedStyleByLocator(bar)
    for await (const [j, item] of Object.entries(dataset.data)) {
      const dataLabel = page.locator(`.chart .dataLabels-${i} .dataLabel-${j}`)
      await expect(dataLabel).toHaveCSS('fill', style.fill)
    }
  }
})

test('BarChart | dataLabels layout', async ({ page }) => {
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const dataLabelsRect = await getOffsetByLocator(page.locator(`.chart .dataLabels-${i}`))
    const barsRect = await getOffsetByLocator(page.locator(`.chart .dataset-${i}`))
    await expectTolerance(dataLabelsRect.centerX, barsRect.centerX, 10)
    await expectTolerance(dataLabelsRect.top, barsRect.top, 20)
  }
})
