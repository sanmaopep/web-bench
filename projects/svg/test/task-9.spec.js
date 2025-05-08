const { test, expect } = require('@playwright/test')
const { getOffsetByLocator } = require('../../../libraries/test-util/src')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('create minimal ellipse', async ({ page }) => {
  await page.locator('.ellipse').click()
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('ellipse')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await page.mouse.up()

  await expect(shape).toBeAttached()
  await expect(shape).toHaveAttribute('cx', '54.5')
  await expect(shape).toHaveAttribute('cy', '54.5')
  await expect(shape).toHaveAttribute('rx', '4.5')
  await expect(shape).toHaveAttribute('ry', '4.5')
})

test('create minimal ellipse 2', async ({ page }) => {
  await page.locator('.ellipse').click()
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('ellipse')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 51, y: 51 } })
  await page.mouse.up()

  await expect(shape).toBeAttached()
  await expect(shape).toHaveAttribute('cx', '54.5')
  await expect(shape).toHaveAttribute('cy', '54.5')
  await expect(shape).toHaveAttribute('rx', '4.5')
  await expect(shape).toHaveAttribute('ry', '4.5')
})

test('create minimal ellipse 3', async ({ page }) => {
  await page.locator('.ellipse').click()
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('ellipse')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 60, y: 51 } })
  await page.mouse.up()

  await expect(shape).toBeAttached()
  await expect(shape).toHaveAttribute('cx', '55')
  await expect(shape).toHaveAttribute('cy', '54.5')
  await expect(shape).toHaveAttribute('rx', '5')
  await expect(shape).toHaveAttribute('ry', '4.5')
})

test('create minimal ellipse 4', async ({ page }) => {
  await page.locator('.ellipse').click()
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('ellipse')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 49, y: 49 } })
  await page.mouse.up()

  await expect(shape).toBeAttached()
  await expect(shape).toHaveAttribute('cx', '45.5')
  await expect(shape).toHaveAttribute('cy', '45.5')
  await expect(shape).toHaveAttribute('rx', '4.5')
  await expect(shape).toHaveAttribute('ry', '4.5')
})

test('create minimal circle', async ({ page }) => {
  await page.locator('.circle').click()
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('circle')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await page.mouse.up()

  await expect(shape).toBeAttached()
  await expect(shape).toHaveAttribute('cx', '54.5')
  await expect(shape).toHaveAttribute('cy', '54.5')
  await expect(shape).toHaveAttribute('r', '4.5')
})

test('create minimal circle 1', async ({ page }) => {
  await page.locator('.circle').click()
  const canvas = page.locator('.canvas')
  const shape = canvas.locator('circle')
  await expect(shape).not.toBeAttached()
  await canvas.hover({ position: { x: 50, y: 50 } })
  await page.mouse.down()
  await canvas.hover({ position: { x: 49, y: 49 } })
  await page.mouse.up()

  await expect(shape).toBeAttached()
  await expect(shape).toHaveAttribute('cx', '45.5')
  await expect(shape).toHaveAttribute('cy', '45.5')
  await expect(shape).toHaveAttribute('r', '4.5')
})