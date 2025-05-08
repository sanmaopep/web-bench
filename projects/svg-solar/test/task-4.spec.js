const { test, expect } = require('@playwright/test')
const { isExisted, expectTolerance, getOffsetByLocator } = require('@web-bench/test-util')
const { starData, density } = require('./util/util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('planet', async ({ page }) => {
  await expect(page.locator('circle.planet')).toHaveCount(8)
})

test('planet attributes', async ({ page }) => {
  const planet = page.locator('.planet').nth(0)
  const body = starData.bodies[0]
  await expect(planet).toHaveAttribute('r', `${body.r}`)
  await expect(planet).toHaveAttribute('fill', `${body.color}`)
})

test('planet layout', async ({ page }) => {
  await Promise.all(
    starData.bodies.map(async (body, i) => {
      const planet = page.locator('.planet').nth(i)
      const offset = await getOffsetByLocator(planet)
      await expectTolerance(offset.centerX, (80 + body.rx) * density)
      await expectTolerance(offset.centerY, 80 * density)
    })
  )
})
