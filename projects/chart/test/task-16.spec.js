import { expect, test } from '@playwright/test'
import {
  expectTolerance,
  getComputedStyleByLocator,
  getOffsetByLocator,
} from '@web-bench/test-util'
import { getUnionRect, hasUniqueValues, TO } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  await page.locator('#type').selectOption({ value: 'pie' })
  await page.waitForTimeout(TO)
  await expect(page.locator('svg.chart.pie')).toBeAttached()
})

test('PieChart | pies', async ({ page }) => {
  await expect(page.locator('.chart g.dataset')).toHaveCount(1)
  await expect(page.locator('.chart .dataset-0')).toBeVisible()
  await expect(page.locator('.chart .dataset-0 path.sector')).toHaveCount(5)

  await expect(page.locator('.chart .grids')).toBeHidden()
  await expect(page.locator('.chart .axes')).toBeHidden()
})

test('PieChart | sector colors', async ({ page }) => {
  const sectors = await page.locator(`.chart .dataset-0 .sector`).all()
  const fills = []
  for await (const sector of sectors) {
    const style = await getComputedStyleByLocator(sector)
    fills.push(style.fill)
  }

  await expect(hasUniqueValues(fills)).toBeTruthy()
})

test('PieChart | sector layout', async ({ page }) => {
  const sectors = await page.locator(`.chart .dataset-0 .sector`).all()
  const offsets = []
  for await (const sector of sectors) {
    const offset = await getOffsetByLocator(sector)
    offsets.push(offset)
  }

  const rect = getUnionRect(offsets)

  // await expect(rect.width).toBeCloseTo(rect.height)
  expectTolerance(rect.width, rect.height, 5)
})

test('PieChart | checkboxes & #datasets', async ({ page }) => {
  await expect(page.locator('#axes')).toBeDisabled()
  await expect(page.locator('#grids')).toBeDisabled()
  await expect(page.locator('#pointStyle')).toBeDisabled()
  // @ts-ignore
  await expect(await page.locator('#datasets').evaluate((el) => el.multiple)).toBeFalsy()

  await page.locator('#type').selectOption({ value: 'line' })
  await expect(page.locator('#axes')).not.toBeDisabled()
  await expect(page.locator('#grids')).not.toBeDisabled()
  await expect(page.locator('#pointStyle')).not.toBeDisabled()
  // @ts-ignore
  await expect(await page.locator('#datasets').evaluate((el) => el.multiple)).toBeTruthy()
})
