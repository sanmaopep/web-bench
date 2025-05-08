const { test, expect, devices } = require('@playwright/test')
const { getOffsetByLocator } = require('../../../libraries/test-util/src')
const { pan } = require('./util/util')

// test.use({ ...devices['iPhone 12'] })
test.use({ ...devices['Pixel 7'] })

test.describe('Touch Device', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html')

    const canvas = page.locator('.canvas')
    const offsetCanvas = await getOffsetByLocator(canvas)
    const shape = canvas.locator('rect')

    await page.locator('.rect').click()
    await expect(canvas).toBeAttached()
    await expect(shape).not.toBeAttached()
    await pan(canvas, { x: 50, y: 50, deltaX: 50, deltaY: 50 })
    await expect(shape).toBeAttached()
    const offset = await getOffsetByLocator(shape)
    await expect(offset).toMatchObject({
      left: 50 + offsetCanvas.left,
      top: 50 + offsetCanvas.top,
      width: 50,
      height: 50,
    })
  })

  test('move rect', async ({ page }) => {
    await page.locator('.rect').click()

    const canvas = page.locator('.canvas')
    const offsetCanvas = await getOffsetByLocator(canvas)
    const shape = canvas.locator('rect')

    // Move
    await page.locator('.move').click()
    await pan(shape, { deltaX: 50, deltaY: 50 })
    const offset1 = await getOffsetByLocator(shape)
    await expect(offset1).toMatchObject({
      left: 100 + offsetCanvas.left,
      top: 100 + offsetCanvas.top,
      width: 50,
      height: 50,
    })
  })

  test('rotate rect', async ({ page }) => {
    await page.locator('.rect').click()

    const canvas = page.locator('.canvas')
    const offsetCanvas = await getOffsetByLocator(canvas)
    const shape = canvas.locator('rect')

    // Rotate
    await page.locator('.rotate').click()
    await pan(shape, { x: 50, y: 0, deltaX: 0, deltaY: 50 })
    const offset1 = await getOffsetByLocator(shape)
    await expect(offset1).toMatchObject({
      left: 50 + offsetCanvas.left,
      top: 50 + offsetCanvas.top,
      width: 50,
      height: 50,
    })
  })

  test('zoom rect', async ({ page }) => {
    await page.locator('.rect').click()

    const canvas = page.locator('.canvas')
    const offsetCanvas = await getOffsetByLocator(canvas)
    const shape = canvas.locator('rect')

    // Zoom
    await page.locator('.zoom').click()
    await pan(shape, { x: 50, y: 25, deltaX: 25, deltaY: 0 })
    const offset1 = await getOffsetByLocator(shape)
    await expect(offset1).toMatchObject({
      left: 25 + offsetCanvas.left,
      top: 25 + offsetCanvas.top,
      width: 100,
      height: 100,
    })
  })
})
