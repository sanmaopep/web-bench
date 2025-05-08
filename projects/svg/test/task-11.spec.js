const { test, expect } = require('@playwright/test')
const { getOffsetByLocator } = require('../../../libraries/test-util/src')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('create trapezoid', async ({ page }) => {
  await page.locator('.trapezoid').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('polygon')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 140, y: 100 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('stroke-width', '9')
  await expect(shape).toHaveAttribute('stroke', '#000000')
  await expect(shape).toHaveAttribute(
    'points',
    /50[\s,]+100[\s,]+140[\s,]+100[\s,]+110[\s,]+50[\s,]+80[\s,]+50/
  )
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)

  await expect(offset).toMatchObject({
    left: 50 + offsetCanvas.left,
    top: 50 + offsetCanvas.top,
    width: 90,
    height: 50,
  })
})

test('create trapezoid with props', async ({ page }) => {
  await page.locator('.line-width').fill('21')
  await page.locator('.color').fill('#ff0000')
  await page.locator('.trapezoid').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('polygon')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 140, y: 100 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('stroke-width', '21')
  await expect(shape).toHaveAttribute('stroke', '#ff0000')
  await expect(shape).toHaveAttribute(
    'points',
    /50[\s,]+100[\s,]+140[\s,]+100[\s,]+110[\s,]+50[\s,]+80[\s,]+50/
  )
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)

  await expect(offset).toMatchObject({
    left: 50 + offsetCanvas.left,
    top: 50 + offsetCanvas.top,
    width: 90,
    height: 50,
  })
})

test('create trapezoid | x1 < x2 && y1 < y2', async ({ page }) => {
  await page.locator('.trapezoid').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('polygon')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 140, y: 100 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('stroke-width', '9')
  await expect(shape).toHaveAttribute('stroke', '#000000')
  await expect(shape).toHaveAttribute(
    'points',
    /50[\s,]+100[\s,]+140[\s,]+100[\s,]+110[\s,]+50[\s,]+80[\s,]+50/
  )
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)

  await expect(offset).toMatchObject({
    left: 50 + offsetCanvas.left,
    top: 50 + offsetCanvas.top,
    width: 90,
    height: 50,
  })
})
