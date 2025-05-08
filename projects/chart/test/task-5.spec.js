import { expect, test } from '@playwright/test'
import {
  expectTolerance,
  getComputedStyleByLocator,
  getOffsetByLocator,
} from '@web-bench/test-util'
import { data, getUnionRect, hasUniqueValues } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  await page.locator('#dataLabels').check()
})

test('LineChart | uncheck #dataLabels', async ({ page }) => {
  await page.locator('#dataLabels').uncheck()
  await expect(page.locator('.chart .dataLabels')).not.toBeAttached()
})

test('LineChart | check #dataLabels', async ({ page }) => {
  await page.locator('#dataLabels').check()
  await expect(page.locator('.chart .dataLabels')).toHaveCount(3)
})

test('LineChart | dataLabels', async ({ page }) => {
  await expect(page.locator('.chart .dataLabels')).toHaveCount(3)
  await expect(page.locator('.chart .dataLabels-0 .dataLabel')).toHaveCount(5)
  await expect(page.locator('.chart .dataLabels-0 .dataLabel-0')).toBeVisible()
  await expect(page.locator('.chart .dataLabels-0 .dataLabel-4')).toBeVisible()

  await expect(page.locator('#line .dataLabels')).toHaveCount(0)
})

test('LineChart | dataLabels color', async ({ page }) => {
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const line = page.locator(`.chart .dataset-${i}`)
    const lineStyle = await getComputedStyleByLocator(line)
    for await (const [j, item] of Object.entries(dataset.data)) {
      const dataLabel = page.locator(`.chart .dataLabels-${i} .dataLabel-${j}`)
      await expect(dataLabel).toHaveCSS('fill', lineStyle.stroke)
    }
  }
})

test('LineChart | dataLabels layout', async ({ page }) => {
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const dataLabelsRect = await getOffsetByLocator(
      page.locator(`.chart .dataLabels-${i}`)
    )
    const lineRect = await getOffsetByLocator(page.locator(`.chart .dataset-${i}`))
    await expectTolerance(dataLabelsRect.centerX, lineRect.centerX, 10)
    await expectTolerance(dataLabelsRect.centerY, lineRect.centerY, 20)
  }
})
