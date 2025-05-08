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

test('LineChart | dataLabels', async ({ page }) => {
  await expect(page.locator('#lineDataLabels .dataLabels')).toHaveCount(3)
  await expect(page.locator('#lineDataLabels .dataLabels-0 .dataLabel')).toHaveCount(5)
  await expect(page.locator('#lineDataLabels .dataLabels-0 .dataLabel-0')).toBeVisible()
  await expect(page.locator('#lineDataLabels .dataLabels-0 .dataLabel-4')).toBeVisible()

  await expect(page.locator('#line .dataLabels')).toHaveCount(0)
})

test('LineChart | dataLabels color', async ({ page }) => {
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const line = page.locator(`#lineDataLabels .dataset-${i}`)
    const lineStyle = await getComputedStyleByLocator(line)
    for await (const [j, item] of Object.entries(dataset.data)) {
      const dataLabel = page.locator(`#lineDataLabels .dataLabels-${i} .dataLabel-${j}`)
      await expect(dataLabel).toHaveCSS('fill', lineStyle.stroke)
    }
  }
})

test('LineChart | dataLabels layout', async ({ page }) => {
  for await (const [i, dataset] of Object.entries(data.datasets)) {
    const dataLabelsRect = await getOffsetByLocator(
      page.locator(`#lineDataLabels .dataLabels-${i}`)
    )
    const lineRect = await getOffsetByLocator(page.locator(`#lineDataLabels .dataset-${i}`))
    await expectTolerance(dataLabelsRect.centerX, lineRect.centerX, 10)
    await expectTolerance(dataLabelsRect.centerY, lineRect.centerY, 20)
  }
})
