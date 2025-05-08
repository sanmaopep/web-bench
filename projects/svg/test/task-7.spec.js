const { test, expect } = require('@playwright/test')
const { getOffsetByLocator } = require('../../../libraries/test-util/src')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('copy line', async ({ page }) => {
  const canvas = page.locator('.canvas')

  // Draw
  await page.locator('.line').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

  // Copy
  await page.locator('.copy').click()
  await canvas.locator('line').nth(0).click()
  const shape = canvas.locator('line').nth(1)

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  await expect(offset).toMatchObject({
    left: 70 + offsetCanvas.left,
    top: 70 + offsetCanvas.top,
    width: 50,
    height: 50,
  })
})

test('copy rect', async ({ page }) => {
  const canvas = page.locator('.canvas')

  // Draw
  await page.locator('.rect').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

  // Copy
  await page.locator('.copy').click()
  await canvas.locator('rect').nth(0).click()
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

test('copy ellipse', async ({ page }) => {
  const canvas = page.locator('.canvas')

  // Draw
  await page.locator('.ellipse').click()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 100, y: 100 } })
  await page.mouse.up()

  // Copy
  await page.locator('.copy').click()
  await canvas.locator('ellipse').nth(0).click()
  const shape = canvas.locator('ellipse').nth(1)

  const offsetCanvas = await getOffsetByLocator(canvas)
  const offset = await getOffsetByLocator(shape)
  await expect(offset).toMatchObject({
    left: 70 + offsetCanvas.left,
    top: 70 + offsetCanvas.top,
    width: 50,
    height: 50,
  })
})
