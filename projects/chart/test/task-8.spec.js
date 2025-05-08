import { test, expect } from '@playwright/test'
import {
  isExisted,
  getViewport,
  getOffsetByLocator,
  expectTolerance,
  getComputedStyleByLocator,
} from '@web-bench/test-util'
import { configs, data, getUnionRect, hasUniqueValues, TO } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  await page.locator('#type').selectOption({ value: 'smoothLine' })
  await page.waitForTimeout(TO)
  await expect(page.locator('svg.chart.smoothLine')).toBeAttached()
})

test('SmoothLineChart | smooth curved lines', async ({ page }) => {
  await expect(page.locator('.chart path.dataset')).toHaveCount(3)
  await expect(page.locator('.chart .dataset-0')).toBeVisible()
  await expect(page.locator('.chart .dataset-1')).toBeVisible()
  await expect(page.locator('.chart .dataset-2')).toBeVisible()
})

test('SmoothLineChart | layout', async ({ page }) => {
  const datasetsRect = await getOffsetByLocator(page.locator('.chart .datasets'))
  const legendsRect = await getOffsetByLocator(page.locator('.chart .legends'))
  const axesXRect = await getOffsetByLocator(page.locator('.chart .axes-x'))
  const axesYRect = await getOffsetByLocator(page.locator('.chart .axes-y'))
  // FIXME why narrow?
  const svgRect = await getOffsetByLocator(page.locator('svg.chart'))
  const unionRect = getUnionRect([legendsRect, datasetsRect, axesXRect, axesYRect])

  // console.log({ legendsRect, datasetsRect, axesXRect, axesYRect })
  // console.log({ unionRect, svgRect })
  await expectTolerance(unionRect.width, svgRect.width, 20)
  await expectTolerance(unionRect.height, svgRect.height, 20)
})

test('SmoothLineChart | line colors', async ({ page }) => {
  const lines = await page.locator('.chart .dataset').all()
  const strokes = []
  for await (const line of lines) {
    const style = await getComputedStyleByLocator(line)
    strokes.push(style.stroke)
  }

  await expect(hasUniqueValues(strokes)).toBeTruthy()
})
