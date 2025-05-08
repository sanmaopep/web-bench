const { test, expect } = require('@playwright/test')
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('question title index', async ({ page }) => {
  const qcount = await page.locator('form .q-title').count()
  await expect(qcount).toBeGreaterThanOrEqual(10)
  const count = await page.locator('.contents .contents-item').count()
  await expect(count).toBeGreaterThanOrEqual(10)

  await expect(page.locator('form .q-title').nth(0)).toContainText(/^1\./)
  await expect(page.locator('form .q-title').nth(9)).toContainText(/^10\./)

  await expect(page.locator('.contents .contents-item').nth(0)).toContainText(/^1\./)
  await expect(page.locator('.contents .contents-item').nth(9)).toContainText(/^10\./)
})

test('move question & title index', async ({ page }) => {
  const item1 = page.locator('.contents .contents-item:nth-child(1)')
  const item2 = page.locator('.contents .contents-item:nth-child(2)')
  const text1 = (await item1.textContent()) ?? `${+new Date()}`
  const text2 = (await item2.textContent()) ?? `${+new Date()}`
  const offset1 = await getOffsetByLocator(item1)

  await item2.hover() // scroll to it
  await page.mouse.down()
  await item1.hover({ position: { x: offset1.width / 2, y: 0 } })
  await page.mouse.up()

  await expect(item1).not.toHaveText(text2)
  await expect(item2).not.toHaveText(text1)

  await expect(page.locator('form .q-title').nth(0)).toContainText(/^1\./)
  await expect(page.locator('form .q-title').nth(1)).toContainText(/^2\./)

  await expect(page.locator('.contents .contents-item').nth(0)).toContainText(/^1\./)
  await expect(page.locator('.contents .contents-item').nth(1)).toContainText(/^2\./)
})
