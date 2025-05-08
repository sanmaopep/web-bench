import { expect, test } from '@playwright/test'
import { expectTolerance, getComputedStyleByLocator, getOffsetByLocator } from '@web-bench/test-util'
import { data, getUnionRect } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('LineChart | grids', async ({ page }) => {
  await expect(page.locator('#lineAxesGrids .grids')).toHaveCount(1)
  await expect(page.locator('#lineAxes .grids')).toHaveCount(0)
  await expect(page.locator('#line .grids')).toHaveCount(0)
})

test('LineChart | grid-x', async ({ page }) => {
  await expect(page.locator('#lineAxesGrids .grid.grid-x')).toHaveCount(5)
  await expect(page.locator('#lineAxesGrids .grid-x-0')).toBeAttached()
  await expect(page.locator('#lineAxesGrids .grid-x-4')).toBeAttached()
  let style = await getComputedStyleByLocator(page.locator('#lineAxesGrids .grid-x-4'))
  await expect(style.stroke).not.toBe('none')
})

test('LineChart | grid-x layout', async ({ page }) => {
  const offset0 = await getOffsetByLocator(page.locator(`#lineAxesGrids .grid-x-0`))
  const offset4 = await getOffsetByLocator(page.locator(`#lineAxesGrids .grid-x-4`))

  await expect(offset0.centerX < offset4.centerX).toBeTruthy()
  await expect(offset0.centerY).toBeCloseTo(offset4.centerY)
})

test('LineChart | grid-y', async ({ page }) => {
  await expect(page.locator('#lineAxesGrids .grid.grid-y')).toHaveCount(6)
  await expect(page.locator('#lineAxesGrids .grid-y-0')).toBeAttached()
  await expect(page.locator('#lineAxesGrids .grid-y-5')).toBeAttached()
  let style = await getComputedStyleByLocator(page.locator('#lineAxesGrids .grid-y-5'))
  await expect(style.stroke).not.toBe('none')
})

test('LineChart | grid-y layout', async ({ page }) => {
  const offset0 = await getOffsetByLocator(page.locator(`#lineAxesGrids .grid-y-0`))
  const offset5 = await getOffsetByLocator(page.locator(`#lineAxesGrids .grid-y-5`))

  await expect(offset0.centerY > offset5.centerY).toBeTruthy()
  await expect(offset0.centerX).toBeCloseTo(offset5.centerX)
})
