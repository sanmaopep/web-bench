import { test, expect } from '@playwright/test'
import {
  isExisted,
  getViewport,
  getOffsetByLocator,
  expectTolerance,
  getComputedStyleByLocator,
} from '@web-bench/test-util'
import { configs, data, getUnionRect, hasUniqueValues } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('StepChart | polylines', async ({ page }) => {
  await expect(page.locator('#step polyline.dataset')).toHaveCount(3)
  await expect(page.locator('#step .dataset-0')).toBeVisible()
  await expect(page.locator('#step .dataset-1')).toBeVisible()
  await expect(page.locator('#step .dataset-2')).toBeVisible()
})

test('StepChart | datasets layout', async ({ page }) => {
  const stepRect = await getOffsetByLocator(page.locator('#step .datasets'))
  const lineFullRect = await getOffsetByLocator(page.locator('#lineFull .datasets'))

  await expectTolerance(stepRect.width, lineFullRect.width, 5)
  await expectTolerance(stepRect.height, lineFullRect.height, 5)
})

// TODO check step y values

test('StepChart | line colors', async ({ page }) => {
  const lines = await page.locator('#step polyline.dataset').all()
  const strokes = []
  for await (const line of lines) {
    const style = await getComputedStyleByLocator(line)
    strokes.push(style.stroke)
  }
  // console.log({ strokes })

  await expect(hasUniqueValues(strokes)).toBeTruthy()
})
