import { expect, test } from '@playwright/test'
import { getOffsetByLocator } from '@web-bench/test-util'
import { data, length, TO } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  await page.locator('#type').selectOption({ value: 'pie' })
  await page.waitForTimeout(TO)
  await expect(page.locator('svg.chart.pie')).toBeAttached()
})

test('PieChart | tooltips | init', async ({ page }) => {
  await expect(page.locator('.chart .tooltips')).toHaveCount(1)
  await expect(page.locator('.chart .tooltips')).toBeHidden()
})

test('PieChart | tooltips | show', async ({ page }) => {
  const dataset = data.datasets[0]
  const tooltips = page.locator('.chart .tooltips')
  const sectors = await page.locator('.chart .sector').all()
  for await (const [i, sector] of Object.entries(sectors)) {
    const offset = await getOffsetByLocator(sector)
    // console.log({ i, data: dataset.data[i], offset })
    await page.mouse.move(offset.centerX, offset.centerY, { steps: 10 })
    await expect(tooltips).toBeVisible()
    await expect(tooltips).toContainText(`${dataset.data[i]}`)
  }
})

test('PieChart | tooltips | hide', async ({ page }) => {
  const tooltips = page.locator('.chart .tooltips')
  const sectors = await page.locator('.chart .sector').all()
  const offsetLegends = await getOffsetByLocator(page.locator('.chart .legends'))
  for await (const [, sector] of Object.entries(sectors)) {
    const offset = await getOffsetByLocator(sector)
    await page.mouse.move(offset.centerX, offset.centerY, { steps: 10 })
    await expect(tooltips).not.toHaveClass(/hidden/i)
    await expect(tooltips).toBeVisible()

    await page.mouse.move(offsetLegends.centerX, offsetLegends.centerY, { steps: 10 })
    // await expect(tooltips).not.toBeVisible() // WHY failed?
    await expect(tooltips).toHaveClass(/hidden/i)
  }
})

test('PieChart | tooltips | position', async ({ page }) => {
  const tooltips = page.locator('.chart .tooltips')
  const gridXs = await page.locator('.chart .sector').all()
  for await (const [i, gridX] of Object.entries(gridXs)) {
    const offset = await getOffsetByLocator(gridX)
    await page.mouse.move(offset.centerX, offset.centerY, { steps: 10 })

    const offset1 = await getOffsetByLocator(tooltips)
    const length1 = length(0, 0, offset1.width, offset1.height)
    const distance = length(offset.centerX, offset.centerY, offset1.centerX, offset1.centerY)
    await expect(distance).toBeLessThanOrEqual(length1)
  }
})
