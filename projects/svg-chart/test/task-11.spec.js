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

test('LineChart | smooth curved lines', async ({ page }) => {
  await expect(page.locator('#lineSmoothFull path.dataset')).toHaveCount(3)
  await expect(page.locator('#lineSmoothFull .dataset-0')).toBeVisible()
  await expect(page.locator('#lineSmoothFull .dataset-1')).toBeVisible()
  await expect(page.locator('#lineSmoothFull .dataset-2')).toBeVisible()
})

test('LineChart | datasets layout 2', async ({ page }) => {
  const lineSmoothFullRect = await getOffsetByLocator(page.locator('#lineSmoothFull .datasets'))
  const lineFullRect = await getOffsetByLocator(page.locator('#lineFull .datasets'))
  // console.log({ datasetsRect, svgRect })

  await expectTolerance(lineSmoothFullRect.width, lineFullRect.width, 5)
  await expectTolerance(lineSmoothFullRect.height, lineFullRect.height, 5)
})

test('LineChart | line colors', async ({ page }) => {
  const lines = await page.locator('#lineSmoothFull .dataset').all()
  const strokes = []
  for await (const line of lines) {
    const style = await getComputedStyleByLocator(line)
    strokes.push(style.stroke)
  }
  // console.log({ strokes })

  await expect(hasUniqueValues(strokes)).toBeTruthy()
})
