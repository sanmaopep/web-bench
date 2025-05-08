const { test, expect } = require('@playwright/test')
const { getOffsetByLocator } = require('../../../libraries/test-util/src')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('create rect', async ({ page }) => {
  await page.locator('.rect').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('rect')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 150 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('stroke-width', '9')
  await expect(shape).toHaveAttribute('stroke', '#000000')
  await expect(shape).toHaveAttribute('x', '50')
  await expect(shape).toHaveAttribute('y', '50')
  await expect(shape).toHaveAttribute('width', '50')
  await expect(shape).toHaveAttribute('height', '100')
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  // console.log({ offsetCanvas, offset })

  await expect(offset).toMatchObject({
    left: 50 + offsetCanvas.left,
    top: 50 + offsetCanvas.top,
    width: 50,
    height: 100,
  })
})

test('create rect with props', async ({ page }) => {
  await page.locator('.rect').click()
  await page.locator('.line-width').fill('21')
  await page.locator('.color').fill('#ff0000')

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('rect')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 150 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('stroke-width', '21')
  await expect(shape).toHaveAttribute('stroke', '#ff0000')
  await expect(shape).toHaveAttribute('x', '50')
  await expect(shape).toHaveAttribute('y', '50')
  await expect(shape).toHaveAttribute('width', '50')
  await expect(shape).toHaveAttribute('height', '100')
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  // console.log({ offsetCanvas, offset })

  await expect(offset).toMatchObject({
    left: 50 + offsetCanvas.left,
    top: 50 + offsetCanvas.top,
    width: 50,
    height: 100,
  })
})
