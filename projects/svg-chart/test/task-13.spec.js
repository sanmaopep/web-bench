import { expect, test } from '@playwright/test'
import {
  expectTolerance,
  getComputedStyleByLocator,
  getOffsetByLocator,
} from '@web-bench/test-util'
import { data, getUnionRect } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  await page.locator('#scatter').scrollIntoViewIfNeeded()
})

test('ScatterChart | datasets hidden', async ({ page }) => {
  await expect(page.locator('#scatter .dataset-0')).toBeHidden()
  await expect(page.locator('#scatter .dataset-1')).toBeHidden()
  await expect(page.locator('#scatter .dataset-2')).toBeHidden()
})

test('ScatterChart | dataLabels', async ({ page }) => {
  await expect(page.locator('#scatter .dataLabels')).toHaveCount(3)
  await expect(page.locator('#scatter .dataLabels-0 .dataLabel')).toHaveCount(5)
  await expect(page.locator('#scatter .dataLabels-0 .dataLabel-0')).toBeVisible()
  await expect(page.locator('#scatter .dataLabels-0 .dataLabel-4')).toBeVisible()

  await expect(page.locator('#line .dataLabels')).toHaveCount(0)
})

test('LineChart | points', async ({ page }) => {
  await expect(page.locator('#scatter .points')).toHaveCount(3)
  await expect(page.locator('#scatter .points-0 circle.point')).toHaveCount(5)
  await expect(page.locator('#scatter .points-0 circle.point-0')).toBeVisible()
  await expect(page.locator('#scatter .points-0 circle.point-4')).toBeVisible()
})

test('LineChart | dataLabels & points layout', async ({ page }) => {
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const pointsRect = await getOffsetByLocator(page.locator(`#scatter .points-${i}`))
    const dataLabelsRect = await getOffsetByLocator(
      page.locator(`#scatter .dataLabels-${i}`)
    )
    await expectTolerance(pointsRect.centerX, dataLabelsRect.centerX, 10)
    await expectTolerance(pointsRect.centerY, dataLabelsRect.centerY, 10)
  }
})
