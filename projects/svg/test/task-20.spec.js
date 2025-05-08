const { test, expect } = require('@playwright/test')
const { getOffsetByLocator } = require('../../../libraries/test-util/src')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('combined transforms to rect | move-rotate', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('rect')

  // Draw
  await page.locator('.rect').click()
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
  // Rotate
  await page.locator('.rotate').click()
  await canvas.hover({ position: { x: 150, y: 100 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 150, y: 150 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  await expect(offset).toMatchObject({
    left: 100 + offsetCanvas.left,
    top: 100 + offsetCanvas.top,
    width: 50,
    height: 50,
  })
})

test('combined transforms to rect | rotate-move', async ({ page }) => {
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
  // Move
  await page.locator('.move').click()
  await shape.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 125 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  await expect(offset).toMatchObject({
    left: 100 + offsetCanvas.left,
    top: 100 + offsetCanvas.top,
    width: 50,
    height: 50,
  })
})

test('combined transforms to line | move-rotate-zoom', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('line')

  // Draw
  await page.locator('.line').click()
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
  // Rotate
  await page.locator('.rotate').click()
  await canvas.hover({ position: { x: 150, y: 100 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 150, y: 150 } })
  await page.mouse.up()
  // Zoom
  await page.locator('.zoom').click()
  await canvas.hover({ position: { x: 150, y: 150 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 175, y: 175 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  await expect(offset).toMatchObject({
    left: 75 + offsetCanvas.left,
    top: 75 + offsetCanvas.top,
    width: 100,
    height: 100,
  })
})

test('combined transforms to rect | move-rotate-zoom', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('rect')

  // Draw
  await page.locator('.rect').click()
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
  // Rotate
  await page.locator('.rotate').click()
  await canvas.hover({ position: { x: 150, y: 100 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 150, y: 150 } })
  await page.mouse.up()
  // Zoom
  await page.locator('.zoom').click()
  await canvas.hover({ position: { x: 150, y: 150 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 175, y: 175 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  await expect(offset).toMatchObject({
    left: 75 + offsetCanvas.left,
    top: 75 + offsetCanvas.top,
    width: 100,
    height: 100,
  })
})

test('combined transforms to ellipse | move-rotate-zoom', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('ellipse')

  // Draw
  await page.locator('.ellipse').click()
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
  // Rotate
  await page.locator('.rotate').click()
  await canvas.hover({ position: { x: 150, y: 100 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 150, y: 150 } })
  await page.mouse.up()
  // Zoom
  await page.locator('.zoom').click()
  await canvas.hover({ position: { x: 150, y: 125 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 175, y: 125 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  await expect(offset).toMatchObject({
    left: 75 + offsetCanvas.left,
    top: 75 + offsetCanvas.top,
    width: 100,
    height: 100,
  })
})

test('combined transforms to rect | zoom-rotate-move', async ({ page }) => {
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
  await canvas.hover({ position: { x: 100, y: 75 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 75 } })
  await page.mouse.up()
  // Rotate
  await page.locator('.rotate').click()
  await canvas.hover({ position: { x: 125, y: 25 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 125 } })
  await page.mouse.up()
  // Move
  await page.locator('.move').click()
  await shape.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 125 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  await expect(offset).toMatchObject({
    left: 75 + offsetCanvas.left,
    top: 75 + offsetCanvas.top,
    width: 100,
    height: 100,
  })
})

test('combined transforms to rect | rotate-zoom-move', async ({ page }) => {
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
  // Zoom
  await page.locator('.zoom').click()
  await canvas.hover({ position: { x: 100, y: 75 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 75 } })
  await page.mouse.up()
  // Move
  await page.locator('.move').click()
  await shape.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 125 } })
  await page.mouse.up()

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  await expect(offset).toMatchObject({
    left: 75 + offsetCanvas.left,
    top: 75 + offsetCanvas.top,
    width: 100,
    height: 100,
  })
})
