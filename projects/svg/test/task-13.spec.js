const { test, expect } = require('@playwright/test')
const { getOffsetByLocator } = require('../../../libraries/test-util/src')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('create curve', async ({ page }) => {
  await page.locator('.curve').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('path')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 150, y: 150 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('stroke-width', '9')
  await expect(shape).toHaveAttribute('stroke', '#000000')
  await expect(shape).toHaveAttribute('d', /M[\s,]*50[\s,]+150[\s,]+Q[\s,]*100[\s,]+50[\s,]+150[\s,]+150/)
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)

  await expect(offset).toMatchObject({
    left: 50 + offsetCanvas.left,
    top: 100 + offsetCanvas.top,
    width: 100,
    height: 50,
  })
})

test('create curve with props', async ({ page }) => {
  await page.locator('.line-width').fill('21')
  await page.locator('.color').fill('#ff0000')
  await page.locator('.curve').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('path')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 150, y: 150 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('stroke-width', '21')
  await expect(shape).toHaveAttribute('stroke', '#ff0000')
  await expect(shape).toHaveAttribute('d', /M[\s,]*50[\s,]+150[\s,]+Q[\s,]*100[\s,]+50[\s,]+150[\s,]+150/)
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)

  await expect(offset).toMatchObject({
    left: 50 + offsetCanvas.left,
    top: 100 + offsetCanvas.top,
    width: 100,
    height: 50,
  })
})

test('create curve | x1 < x2 && y1 < y2', async ({ page }) => {
  await page.locator('.curve').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('path')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 150, y: 150 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('stroke-width', '9')
  await expect(shape).toHaveAttribute('stroke', '#000000')
  await expect(shape).toHaveAttribute('d', /M[\s,]*50[\s,]+150[\s,]+Q[\s,]*100[\s,]+50[\s,]+150[\s,]+150/)
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)

  await expect(offset).toMatchObject({
    left: 50 + offsetCanvas.left,
    top: 100 + offsetCanvas.top,
    width: 100,
    height: 50,
  })
})
