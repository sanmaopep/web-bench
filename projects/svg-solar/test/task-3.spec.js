const { test, expect } = require('@playwright/test')
const {
  getOffsetByLocator,
  expectTolerance,
  getComputedStyleByLocator,
} = require('@web-bench/test-util')
const { starData, density } = require('./util/util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('data', async ({ page }) => {
  await expect(starData.bodies.length).toBe(8)
  const body = starData.bodies[2]
  await expect(body.rx).toBeGreaterThan(1)
  await expect(body.ry).toBeGreaterThan(1)
})

test('orbit', async ({ page }) => {
  await expect(page.locator('path.orbit')).toHaveCount(8)
  const orbit = page.locator('path.orbit').nth(0)
  const body = starData.bodies[0]
  const style = await getComputedStyleByLocator(orbit)
  await expect(orbit).toHaveAttribute('id', `orbit_${body.name}`)
  await expect(style.stroke).toMatch('rgb(255, 255, 255)')
  await expect(style.fill).toMatch(/none|transparent/)
  await expect(style.strokeWidth).toMatch(`1px`)
})

test('orbit layout', async ({ page }) => {
  await Promise.all(
    starData.bodies.map(async (body, i) => {
      // console.log(i, body.name)
      const orbit = page.locator('path.orbit').nth(i)
      const offset = await getOffsetByLocator(orbit)
      await expectTolerance(offset.width, body.rx * 2 * density)
      await expectTolerance(offset.height, body.ry * 2 * density)
      await expectTolerance(offset.centerX, 80 * density)
      await expectTolerance(offset.centerY, 80 * density)
    })
  )
})
