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

test('LineChart | areas', async ({ page }) => {
  await expect(page.locator('#area .areas')).toHaveCount(1)
  await expect(page.locator('#area .areas .area')).toHaveCount(3)
  await expect(page.locator('#area .areas .area-0')).toBeVisible()
  await expect(page.locator('#area .areas .area-1')).toBeVisible()
  await expect(page.locator('#area .areas .area-2')).toBeVisible()

  await expect(page.locator('#line .areas')).toHaveCount(0)
})

test('LineChart | areas color', async ({ page }) => {
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const line = page.locator(`#area .dataset-${i}`)
    const lineStyle = await getComputedStyleByLocator(line)
    const area = page.locator(`#area .areas .area-${i}`)
    const style = await getComputedStyleByLocator(area)
    await expect(style.fill).toBe(lineStyle.stroke)
    await expect(parseFloat(style.opacity)).toBeLessThan(1)
  }
})

test('LineChart | areas layout', async ({ page }) => {
  const areasRect = await getOffsetByLocator(page.locator(`#area .areas`))
  const datasetsRect = await getOffsetByLocator(page.locator(`#area .datasets`))

  await expectTolerance(areasRect.centerX, datasetsRect.centerX, 5)
  await expectTolerance(areasRect.centerY, datasetsRect.centerY, 10)
})

test('LineChart | area layout', async ({ page }) => {
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const areaRect = await getOffsetByLocator(page.locator(`#area .area-${i}`))
    const lineRect = await getOffsetByLocator(page.locator(`#area .dataset-${i}`))
    await expectTolerance(areaRect.centerX, lineRect.centerX, 1)
    await expect(areaRect.centerY).toBeGreaterThanOrEqual(lineRect.centerY)
  }
})
