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

test('LineChart | legends', async ({ page }) => {
  await expect(page.locator('#lineAxesGridsLegends .legends')).toHaveCount(1)
  await expect(page.locator('#lineAxesGrids .legends')).toHaveCount(0)
  await expect(page.locator('#lineAxes .legends')).toHaveCount(0)
  await expect(page.locator('#line .legends')).toHaveCount(0)
})

test('LineChart | legend', async ({ page }) => {
  await expect(page.locator('#lineAxesGridsLegends .legend')).toHaveCount(3)
  await expect(page.locator('#lineAxesGridsLegends .legend-0')).toBeAttached()
  await expect(page.locator('#lineAxesGridsLegends .legend-1')).toBeAttached()
  await expect(page.locator('#lineAxesGridsLegends .legend-2')).toBeAttached()
})

test('LineChart | legend content', async ({ page }) => {
  const dot = page.locator('#lineAxesGridsLegends .legend-0 circle')
  const style = await getComputedStyleByLocator(page.locator('#lineAxesGridsLegends .dataset-0'))

  await expect(dot).toBeAttached()
  await expect(dot).toHaveCSS('fill', style.stroke)
  await expect(page.locator('#lineAxesGridsLegends .legend-0 text')).toHaveText(
    data.datasets[0].label
  )
})

test('LineChart | legends & axes & datasets layout', async ({ page }) => {
  const legendsRect = await getOffsetByLocator(page.locator('#lineAxesGridsLegends .legends'))
  const datasetsRect = await getOffsetByLocator(page.locator('#lineAxesGridsLegends .datasets'))
  const axesXRect = await getOffsetByLocator(page.locator('#lineAxesGridsLegends .axes-x'))
  const axesYRect = await getOffsetByLocator(page.locator('#lineAxesGridsLegends .axes-y'))
  const svgRect = await getOffsetByLocator(page.locator('#lineAxesGridsLegends'))
  const unionRect = getUnionRect([legendsRect, datasetsRect, axesXRect, axesYRect])
  // console.log({ datasetsRect, svgRect })

  await expectTolerance(unionRect.width, svgRect.width, 15)
  await expectTolerance(unionRect.height, svgRect.height, 15)
})