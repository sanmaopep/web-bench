const { test, expect } = require('@playwright/test')
const { getOffsetByLocator, isExisted } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('common/layout.js', async ({ page }) => {
  await expect(isExisted('common/layout.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('resize tbody row height', async ({ page }) => {
  const td = page.locator('.table tbody tr:nth-child(1) td:nth-child(2)')
  const offset = await getOffsetByLocator(td)

  await td.hover()
  await page.mouse.move(offset.centerX, offset.bottom - 1, { steps: 10 })
  await page.mouse.down()
  await page.mouse.move(offset.centerX, offset.bottom + offset.height - 1, { steps: 10 })
  await page.mouse.up()

  const offset1 = await getOffsetByLocator(td)
  await expect(offset.height * 2).toBeCloseTo(offset1.height)
})

test('resize tbody new row height', async ({ page }) => {
  const td = page.locator('.table tbody tr:nth-child(1) td:nth-child(2)')

  // insert new row above
  await td.click({ button: 'right' })
  await page.locator('.menu-item-insert-row-above').click()

  const offset = await getOffsetByLocator(td)
  
  await td.hover()
  await page.mouse.move(offset.centerX, offset.bottom - 1, { steps: 10 })
  await page.mouse.down()
  await page.mouse.move(offset.centerX, offset.bottom + offset.height - 1, { steps: 10 })
  await page.mouse.up()

  const offset1 = await getOffsetByLocator(td)
  await expect(offset.height * 2).toBeCloseTo(offset1.height)
})

test('resize thead row height', async ({ page }) => {
  const th = page.locator('.table thead tr:nth-child(1) th:nth-child(2)')
  const offset = await getOffsetByLocator(th)

  await th.hover()
  await page.mouse.move(offset.centerX, offset.bottom - 1, { steps: 10 })
  await page.mouse.down()
  await page.mouse.move(offset.centerX, offset.bottom + offset.height - 1, { steps: 10 })
  await page.mouse.up()

  const offset1 = await getOffsetByLocator(th)
  await expect(offset.height * 2).toBeCloseTo(offset1.height)
})

test('resize row min height', async ({ page }) => {
  const td = page.locator('.table tbody tr:nth-child(1) td:nth-child(2)')
  const offset = await getOffsetByLocator(td)

  await td.hover()
  await page.mouse.move(offset.centerX, offset.bottom - 1, { steps: 10 })
  await page.mouse.down()
  await page.mouse.move(offset.centerX, offset.top + 20, { steps: 10 })
  await page.mouse.up()

  await expect(offset.height).toBeCloseTo(40)
})
