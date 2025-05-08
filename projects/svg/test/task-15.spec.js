const { test, expect } = require('@playwright/test')
const { getOffsetByLocator } = require('../../../libraries/test-util/src')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('create text', async ({ page }) => {
  await page.locator('.text').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('text')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 150, y: 100 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('fill', '#000000')
  await expect(shape).toHaveText('Text')
  // const offsetCanvas = await getOffsetByLocator(canvas)
  // const offset = await getOffsetByLocator(shape)
  // await expect(offset).toMatchObject({
  //   left: 50 + offsetCanvas.left,
  //   top: 50 + offsetCanvas.top,
  //   width: 50,
  //   height: 50,
  // })
})

test('create text with props', async ({ page }) => {
  await page.locator('.color').fill('#ff0000')
  await page.locator('.text').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('text')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 150, y: 100 } })
  await page.mouse.up()
  await expect(shape).toBeVisible()
  await expect(shape).toHaveAttribute('fill', '#ff0000')
  await expect(shape).toHaveText('Text')
})

test('create text | x1 < x2 && y1 < y2', async ({ page }) => {
  await page.locator('.text').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('text')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 150, y: 100 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.up()
  await expect(shape).toHaveText('Text')
})

test('edit text', async ({ page }) => {
  await page.locator('.text').click()

  const canvas = page.locator('.canvas')
  const shape = canvas.locator('text').nth(0)
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 150, y: 100 } })
  await page.mouse.up()
  await expect(shape).toHaveText('Text')

  await page.locator('.move').click()
  const newText = 'New Text'
  page.on('dialog', (dialog) => {
    if (dialog.type() === 'prompt') {
      dialog.accept(newText)
    }
  })
  await shape.dblclick()
  await expect(shape).toHaveText(newText)
})
