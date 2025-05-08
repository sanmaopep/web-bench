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

test('speed number input', async ({ page }) => {
  await expect(page.locator('#speed')).toBeVisible()
  const speed = parseFloat((await page.locator('#speed').inputValue()) ?? '0')
  await expect(speed).toBeCloseTo(1)
})

test('change speed', async ({ page }) => {
  const dur0 = await page.locator('animateMotion').nth(0).getAttribute('dur')
  await page.locator('#speed').fill('2')
  await page.locator('#speed').blur() // trigger change event
  const speed = parseFloat((await page.locator('#speed').inputValue()) ?? '0')
  await expect(speed).toBeCloseTo(2)
  const dur1 = await page.locator('animateMotion').nth(0).getAttribute('dur')
  // console.log({ dur0, dur1, speed })
  await expect(parseFloat(dur0 ?? '0') / 2).toBeCloseTo(parseFloat(dur1 ?? '0'))
})

test('change speed | planet-satellites', async ({ page }) => {
  await page.locator('#speed').fill('2')
  await page.locator('#speed').blur() // trigger change event

  const offset = await getOffsetByLocator(page.locator('.jupiter'))
  await page.mouse.move(offset.centerX, offset.centerY)
  await page.locator('.jupiter').click()

  const speed = parseFloat((await page.locator('#speed').inputValue()) ?? '0')
  await expect(speed).toBeCloseTo(2)
  await expect(page.locator('animateMotion').nth(0)).toHaveAttribute('dur', '1s')

  await page.locator('#speed').fill('1')
  await page.locator('#speed').blur() // trigger change event
  await expect(page.locator('animateMotion').nth(0)).toHaveAttribute('dur', '2s')
})
