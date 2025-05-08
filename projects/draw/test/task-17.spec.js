const { test, expect } = require('@playwright/test')
const { getOffsetByLocator } = require('../../../libraries/test-util/src')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('create and move', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('line')

  // Draw
  await page.locator('.line').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 150 } })
  await page.mouse.up()
  await expect(page.locator('input[name="operation"]:checked')).toHaveValue('move')

  // Move
  await shape.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 200 } })
  await page.mouse.up()
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  await expect(offset).toMatchObject({
    left: 100 + offsetCanvas.left,
    top: 150 + offsetCanvas.top,
    width: 50,
    height: 100,
  })
})

test('copy and move', async ({ page }) => {
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('line').nth(0)

  // Draw
  await page.locator('.line').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 150 } })
  await page.mouse.up()

  // Copy
  await page.locator('.copy').click()
  await shape.click()
  const shape1 = canvas.locator('line').nth(1)
  await expect(page.locator('input[name="operation"]:checked')).toHaveValue('move')

  // Move
  await shape1.hover()
  await page.mouse.down()
  await canvas.hover({ position: { x: 125, y: 200 } })
  await page.mouse.up()
  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset1 = await getOffsetByLocator(shape1)
  await expect(offset1).toMatchObject({
    left: 100 + offsetCanvas.left,
    top: 150 + offsetCanvas.top,
    width: 50,
    height: 100,
  })
})
