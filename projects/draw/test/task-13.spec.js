const { test, expect } = require('@playwright/test')
const { getOffsetByLocator } = require('../../../libraries/test-util/src')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('rotate line', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('line')

  // Draw
  await page.locator('.line').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

  // Rotate
  await page.locator('.rotate').click()
  await canvas.hover({ position: { x: 100, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

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

test('rotate rect | clockwise 90deg', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('rect')

  // Draw
  await page.locator('.rect').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

  // Rotate
  await page.locator('.rotate').click()
  await canvas.hover({ position: { x: 100, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

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

test('rotate rect | counterclockwise 90deg', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('rect')

  // Draw
  await page.locator('.rect').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

  // Rotate
  await page.locator('.rotate').click()
  await canvas.hover({ position: { x: 100, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.up()

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

test('rotate ellipse', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('ellipse')

  // Draw
  await page.locator('.ellipse').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

  // Rotate
  await page.locator('.rotate').click()
  await canvas.hover({ position: { x: 100, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

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

test('rotate ellipse | counterclockwise 45deg', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('ellipse')

  // Draw
  await page.locator('.ellipse').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

  // Rotate
  await page.locator('.rotate').click()
  await canvas.hover({ position: { x: 100, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 75, y: 50 } })
  await page.mouse.up()

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
