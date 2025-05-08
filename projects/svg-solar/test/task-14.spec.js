const { test, expect } = require('@playwright/test')
const {
  expectTolerance,
  getOffsetByLocator,
  getComputedStyleByLocator,
} = require('@web-bench/test-util')
const { starData, density } = require('./util/util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('ring symbol', async ({ page }) => {
  await expect(page.locator('symbol#ring')).toBeAttached()
})

test('use ring', async ({ page }) => {
  await Promise.all(
    starData.bodies.map(async (body, i) => {
      if (body.ring) {
        await expect(page.locator(`use#ring_${body.name}`)).toBeVisible()
      }
    })
  )
})
