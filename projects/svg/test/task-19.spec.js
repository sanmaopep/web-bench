const { test, expect } = require('@playwright/test')
const { getOffsetByLocator } = require('../../../libraries/test-util/src')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('zoom line', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('line')

  // Draw
  await page.locator('.line').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

  // Zoom
  await page.locator('.zoom').click()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 125 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  // console.log({ offsetCanvas, offset })
  await expect(offset).toMatchObject({
    left: 25 + offsetCanvas.left,
    top: 25 + offsetCanvas.top,
    width: 100,
    height: 100,
  })
})

test('zoom rect', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('rect')

  // Draw
  await page.locator('.rect').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

  // Zoom
  await page.locator('.zoom').click()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 125 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  // console.log({ offsetCanvas, offset })
  await expect(offset).toMatchObject({
    left: 25 + offsetCanvas.left,
    top: 25 + offsetCanvas.top,
    width: 100,
    height: 100,
  })
})

test('zoom ellipse | zoom in', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('ellipse')

  // Draw
  await page.locator('.ellipse').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

  // Zoom
  await page.locator('.zoom').click()
  await canvas.hover({ position: { x: 100, y: 75 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 75 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  // console.log({ offsetCanvas, offset })
  await expect(offset).toMatchObject({
    left: 25 + offsetCanvas.left,
    top: 25 + offsetCanvas.top,
    width: 100,
    height: 100,
  })
})

test('zoom ellipse | zoom out', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('ellipse')

  // Draw
  await page.locator('.ellipse').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 110, y: 110 } })
  await page.mouse.up()

  // Zoom
  await page.locator('.zoom').click()
  await canvas.hover({ position: { x: 110, y: 80 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 95, y: 80 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  // console.log({ offsetCanvas, offset })
  await expect(offset).toMatchObject({
    left: 65 + offsetCanvas.left,
    top: 65 + offsetCanvas.top,
    width: 30,
    height: 30,
  })
})

test('zoom polygon', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('polygon')

  // Draw
  await page.locator('.hexagon').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 150, y: 150 } })
  await page.mouse.up()
  const offsetCanvas = await getOffsetByLocator(canvas)
  let offset = await getOffsetByLocator(shape)
  await expect(offset).toMatchObject({
    left: 50 + offsetCanvas.left,
    top: 50 + offsetCanvas.top,
    width: 100,
    height: 100,
  })

  // Rotate
  await page.locator('.zoom').click()
  await canvas.hover({ position: { x: 100, y: 150 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 200 } })
  await page.mouse.up()

  offset = await getOffsetByLocator(shape)
  await expect(offset).toMatchObject({
    left: 0 + offsetCanvas.left,
    top: 0 + offsetCanvas.top,
    width: 200,
    height: 200,
  })
})