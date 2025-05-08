const { test, expect } = require('@playwright/test')
const { getOffsetByLocator } = require('../../../libraries/test-util/src')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('create circle', async ({ page }) => {
  await page.locator('.circle').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('circle')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('stroke-width', '9')
  await expect(shape).toHaveAttribute('stroke', '#000000')
  await expect(shape).toHaveAttribute('cx', '75')
  await expect(shape).toHaveAttribute('cy', '75')
  await expect(shape).toHaveAttribute('r', '25')
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)

  await expect(offset).toMatchObject({
    left: 50 + offsetCanvas.left,
    top: 50 + offsetCanvas.top,
    width: 50,
    height: 50,
  })
})

test('create circle with props', async ({ page }) => {
  await page.locator('.line-width').fill('21')
  await page.locator('.color').fill('#ff0000')
  await page.locator('.circle').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('circle')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('stroke-width', '21')
  await expect(shape).toHaveAttribute('stroke', '#ff0000')
  await expect(shape).toHaveAttribute('cx', '75')
  await expect(shape).toHaveAttribute('cy', '75')
  await expect(shape).toHaveAttribute('r', '25')
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  // console.log({ offsetCanvas, offset })

  await expect(offset).toMatchObject({
    left: 50 + offsetCanvas.left,
    top: 50 + offsetCanvas.top,
    width: 50,
    height: 50,
  })
})

test('create circle | width < height', async ({ page }) => {
  await page.locator('.circle').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('circle')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 110 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('stroke-width', '9')
  await expect(shape).toHaveAttribute('stroke', '#000000')
  await expect(shape).toHaveAttribute('cx', '75')
  await expect(shape).toHaveAttribute('cy', '80')
  await expect(shape).toHaveAttribute('r', '25')
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)

  await expect(offset).toMatchObject({
    left: 50 + offsetCanvas.left,
    top: 55 + offsetCanvas.top,
    width: 50,
    height: 50,
  })
})

test('create circle | width > height', async ({ page }) => {
  await page.locator('.circle').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('circle')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 110, y: 100 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('stroke-width', '9')
  await expect(shape).toHaveAttribute('stroke', '#000000')
  await expect(shape).toHaveAttribute('cx', '80')
  await expect(shape).toHaveAttribute('cy', '75')
  await expect(shape).toHaveAttribute('r', '30')
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)

  await expect(offset).toMatchObject({
    left: 50 + offsetCanvas.left,
    top: 45 + offsetCanvas.top,
    width: 60,
    height: 60,
  })
})

test('create circle | x1 < x2 && y1 < y2', async ({ page }) => {
  await page.locator('.circle').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('circle')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('stroke-width', '9')
  await expect(shape).toHaveAttribute('stroke', '#000000')
  await expect(shape).toHaveAttribute('cx', '75')
  await expect(shape).toHaveAttribute('cy', '75')
  await expect(shape).toHaveAttribute('r', '25')
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)

  await expect(offset).toMatchObject({
    left: 50 + offsetCanvas.left,
    top: 50 + offsetCanvas.top,
    width: 50,
    height: 50,
  })
})
