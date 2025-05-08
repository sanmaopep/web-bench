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

test('LineChart | axes, axes-x, axes-y', async ({ page }) => {
  await expect(page.locator('#lineAxes .axes')).toHaveCount(2)
  await expect(page.locator('#line .axes')).toHaveCount(0)
})

test('LineChart | axis-x & axis-y', async ({ page }) => {
  await expect(page.locator('#lineAxes .axes.axes-x .axis-x')).toHaveCount(1)
  await expect(page.locator('#lineAxes .axis-x')).toBeAttached()
  let style = await getComputedStyleByLocator(page.locator('#lineAxes .axis-x'))
  await expect(style.stroke).not.toBe('none')
  // console.log(style.stroke)

  await expect(page.locator('#lineAxes .axes.axes-y .axis-y')).toHaveCount(1)
  style = await getComputedStyleByLocator(page.locator('#lineAxes .axis-y'))
  await expect(style.stroke).not.toBe('none')

  await expect(page.locator('#line .axes.axes-x')).toHaveCount(0)
  await expect(page.locator('#line .axes.axes-y')).toHaveCount(0)
})
