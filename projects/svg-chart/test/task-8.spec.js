import { expect, test } from '@playwright/test'
import {
  expectTolerance,
  getComputedStyleByLocator,
  getOffsetByLocator,
} from '@web-bench/test-util'
import { data, getUnionRect } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('LineChart | points', async ({ page }) => {
  await expect(page.locator('#linePointsCircle .points')).toHaveCount(3)
  await expect(page.locator('#linePointsCircle .points-0 circle.point')).toHaveCount(5)
  await expect(page.locator('#linePointsCircle .points-0 circle.point-0')).toBeVisible()
  await expect(page.locator('#linePointsCircle .points-0 circle.point-4')).toBeVisible()

  await expect(page.locator('#line .points')).toHaveCount(0)
})

test('LineChart | points | rect', async ({ page }) => {
  await expect(page.locator('#linePointsRect .points')).toHaveCount(3)
  await expect(page.locator('#linePointsRect .points-0 rect.point')).toHaveCount(5)
  await expect(page.locator('#linePointsRect .points-0 rect.point-0')).toBeVisible()
  await expect(page.locator('#linePointsRect .points-0 rect.point-4')).toBeVisible()
})

test('LineChart | points color', async ({ page }) => {
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const line = page.locator(`#linePointsCircle .dataset-${i}`)
    const lineStyle = await getComputedStyleByLocator(line)
    for await (const [j, item] of Object.entries(dataset.data)) {
      const point = page.locator(`#linePointsCircle .points-${i} .point-${j}`)
      await expect(point).toHaveCSS('fill', lineStyle.stroke)
    }
  }
})

test('LineChart | points layout', async ({ page }) => {
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const pointsRect = await getOffsetByLocator(page.locator(`#linePointsCircle .points-${i}`))
    const lineRect = await getOffsetByLocator(page.locator(`#linePointsCircle .dataset-${i}`))
    await expectTolerance(pointsRect.centerX, lineRect.centerX, 10)
    await expectTolerance(pointsRect.centerY, lineRect.centerY, 10)
  }
})
