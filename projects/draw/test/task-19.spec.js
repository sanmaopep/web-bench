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

  test('create rect', async ({ page }) => {
    const canvas = page.locator('.canvas')
    const shape = canvas.locator('rect')

    await expect(shape).toBeAttached()
    await expect(shape).toHaveAttribute('stroke-width', '9')
    await expect(shape).toHaveAttribute('stroke', '#000000')
    await expect(shape).toHaveAttribute('x', '50')
    await expect(shape).toHaveAttribute('y', '50')
    await expect(shape).toHaveAttribute('width', '50')
    await expect(shape).toHaveAttribute('height', '50')
  })

  test('delete rect', async ({ page }) => {
    const canvas = page.locator('.canvas')
    const shape = canvas.locator('rect')

    // Delete
    await expect(shape).toBeVisible()
    await page.locator('.delete').click()
    await shape.tap()
    // await shape.click()
    await expect(shape).not.toBeAttached()
  })

  test('fill rect', async ({ page }) => {
    const canvas = page.locator('.canvas')
    const rect = canvas.locator('rect')

    // Fill
    await expect(rect).toHaveAttribute('fill', 'white')
    await page.locator('.fill').click()
    await rect.tap()
    const color = await page.locator('.color').inputValue()
    await expect(rect).toHaveAttribute('fill', color)
  })

  test('copy rect', async ({ page }) => {
    const canvas = page.locator('.canvas')

    // Copy
    await page.locator('.copy').click()
    await canvas.locator('rect').nth(0).tap()
    const shape = canvas.locator('rect').nth(1)

    const offsetCanvas = await getOffsetByLocator(canvas)
    const offset = await getOffsetByLocator(shape)
    await expect(offset).toMatchObject({
      left: 70 + offsetCanvas.left,
      top: 70 + offsetCanvas.top,
      width: 50,
      height: 50,
    })
  })
})
