const { test, expect } = require('@playwright/test')
const { getOffsetByLocator } = require('../../../libraries/test-util/src')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('move line | right-bottom direction', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('line')

  // Draw
  await page.locator('.line').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 150 } })
  await page.mouse.up()

  // Move
  await page.locator('.move').click()
  await shape.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 200 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  // console.log({ offsetCanvas, offset })
  await expect(offset).toMatchObject({
    left: 100 + offsetCanvas.left,
    top: 150 + offsetCanvas.top,
    width: 50,
    height: 100,
  })
})

test('move line | left-top direction', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('line')

  // Draw
  await page.locator('.line').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 150 } })
  await page.mouse.up()

  // Move
  await page.locator('.move').click()
  await shape.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 50, y: 75 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  // console.log({ offsetCanvas, offset })
  await expect(offset).toMatchObject({
    left: 25 + offsetCanvas.left,
    top: 25 + offsetCanvas.top,
    width: 50,
    height: 100,
  })
})

test('move rect', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('rect')

  // Draw
  await page.locator('.rect').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 150 } })
  await page.mouse.up()

  // Move
  await page.locator('.move').click()
  await shape.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 200 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  // console.log({ offsetCanvas, offset })
  await expect(offset).toMatchObject({
    left: 100 + offsetCanvas.left,
    top: 150 + offsetCanvas.top,
    width: 50,
    height: 100,
  })
})

test('move ellipse', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('ellipse')

  // Draw
  await page.locator('.ellipse').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 150 } })
  await page.mouse.up()

  // Move
  await page.locator('.move').click()
  await shape.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 200 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  // console.log({ offsetCanvas, offset })
  await expect(offset).toMatchObject({
    left: 100 + offsetCanvas.left,
    top: 150 + offsetCanvas.top,
    width: 50,
    height: 100,
  })
})

test('move polygon', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('polygon')

  // Draw
  await page.locator('.triangle').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 150 } })
  await page.mouse.up()

  // Move
  await page.locator('.move').click()
  await shape.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 200 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  // console.log({ offsetCanvas, offset })
  await expect(offset).toMatchObject({
    left: 100 + offsetCanvas.left,
    top: 150 + offsetCanvas.top,
    width: 50,
    height: 100,
  })
})

test('move polyline', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('polyline')

  // Draw
  await page.locator('.polyline').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

  // Move
  await page.locator('.move').click()
  await shape.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 125 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  // console.log({ offsetCanvas, offset })
  await expect(offset).toMatchObject({
    left: 100 + offsetCanvas.left,
    top: 100 + offsetCanvas.top,
    width: 50,
    height: 50,
  })
})

test('move path', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('path')

  // Draw
  await page.locator('.curve').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 150, y: 100 } })
  await page.mouse.up()

  // Move
  await page.locator('.move').click()
  await canvas.hover({ position: { x: 100, y: 75 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 150, y: 100 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  // console.log({ offsetCanvas, offset })
  await expect(offset).toMatchObject({
    left: 100 + offsetCanvas.left,
    top: 100 + offsetCanvas.top,
    width: 100,
    height: 25,
  })
})

test('move text', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('text')

  // Draw
  await page.locator('.text').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 150 } })
  await page.mouse.up()

  // Move
  await page.locator('.move').click()
  await shape.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 200 } })
  await page.mouse.up()
})
