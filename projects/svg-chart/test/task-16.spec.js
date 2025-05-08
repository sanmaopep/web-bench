import { test, expect } from '@playwright/test'
import {
  isExisted,
  getViewport,
  getOffsetByLocator,
  expectTolerance,
  getComputedStyleByLocator,
} from '@web-bench/test-util'
import {
  configs,
  data,
  density,
  getUnionRect,
  hasSameValue,
  hasUniqueValues,
  isAscending,
} from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('BarChart | bars', async ({ page }) => {
  await expect(page.locator('#bar g.dataset')).toHaveCount(3)
  await expect(page.locator('#bar .dataset-0')).toBeVisible()
  await expect(page.locator('#bar .dataset-1')).toBeVisible()
  await expect(page.locator('#bar .dataset-2')).toBeVisible()
})

test('BarChart | grids', async ({ page }) => {
  await expect(page.locator('#bar .grids')).toBeAttached()
  await expect(page.locator('#bar .grids .grid-x')).toHaveCount(6)
  await expect(page.locator('#bar .grids .grid-x-0')).toBeAttached()

  const offset0 = await getOffsetByLocator(page.locator('#bar .grid-x-0'))
  const offset1 = await getOffsetByLocator(page.locator('#bar .grid-x-1'))
  const offset2 = await getOffsetByLocator(page.locator('#bar .axis-x'))
  await expectTolerance((offset1.left - offset0.left) / density, offset2.width / density / 5, 5)
})

test('BarChart | datasets layout', async ({ page }) => {
  const barRect = await getOffsetByLocator(page.locator('#bar .datasets'))
  const lineFullRect = await getOffsetByLocator(page.locator('#lineFull .datasets'))

  await expectTolerance(barRect.width, lineFullRect.width, 20)
  await expectTolerance(barRect.height, lineFullRect.height, 10)
})

test('BarChart | bar colors in a dataset', async ({ page }) => {
  for (let i = 0; i < data.datasets.length; i++) {
    const bars = await page.locator(`#bar .dataset-${i} .bar`).all()
    const fills = []
    for await (const bar of bars) {
      const style = await getComputedStyleByLocator(bar)
      fills.push(style.fill)
    }

    await expect(hasSameValue(fills)).toBeTruthy()
  }
})

test('BarChart | bar colors between datasets', async ({ page }) => {
  const bars = await page.locator('#bar .dataset .bar-0').all()
  const fills = []
  for await (const bar of bars) {
    const style = await getComputedStyleByLocator(bar)
    fills.push(style.fill)
  }

  await expect(hasUniqueValues(fills)).toBeTruthy()
})

test('BarChart | bars layout in a dataset', async ({ page }) => {
  for (let i = 0; i < data.datasets.length; i++) {
    const bars = await page.locator(`#bar .dataset-${i} .bar`).all()
    const xs = []
    for await (const bar of bars) {
      const offset = await getOffsetByLocator(bar)
      xs.push(offset.centerX)
    }

    await expect(isAscending(xs)).toBeTruthy()
  }
})

test('BarChart | bars layout in a column', async ({ page }) => {
  const bars = await page.locator('#bar .dataset .bar-0').all()
  const xs = []
  for await (const bar of bars) {
    const offset = await getOffsetByLocator(bar)
    xs.push(offset.centerX)
  }

  await expect(isAscending(xs)).toBeTruthy()
})
