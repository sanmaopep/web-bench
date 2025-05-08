const { test, expect } = require('@playwright/test')
const { getCmdKey, getOffsetByLocator } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('resize col height', async ({ page }) => {
  const th = page.locator('.table thead tr:nth-child(1) th:nth-child(2)')
  const offset = await getOffsetByLocator(th)

  await th.hover()
  await page.mouse.move(offset.right - 1, offset.centerY, { steps: 10 })
  await page.mouse.down()
  await page.mouse.move(offset.right + offset.width - 1, offset.centerY, { steps: 10 })
  await page.mouse.up()

  const offset1 = await getOffsetByLocator(th)
  await expect(offset.width * 2).toBeCloseTo(offset1.width)
})

test('resize new col height', async ({ page }) => {
  const th = page.locator('.table thead tr:nth-child(1) th:nth-child(2)')

  // insert new col left
  await th.click({ button: 'right' })
  await page.locator('.menu-item-insert-col-left').click()

  const offset = await getOffsetByLocator(th)

  await th.hover()
  await page.mouse.move(offset.right - 1, offset.centerY, { steps: 10 })
  await page.mouse.down()
  await page.mouse.move(offset.right + offset.width - 1, offset.centerY, { steps: 10 })
  await page.mouse.up()

  const offset1 = await getOffsetByLocator(th)
  await expect(offset.width * 2).toBeCloseTo(offset1.width)
})

test('resize col min height', async ({ page }) => {
  const th = page.locator('.table thead tr:nth-child(1) th:nth-child(2)')
  const offset = await getOffsetByLocator(th)

  await th.hover()
  await page.mouse.move(offset.right - 1, offset.centerY, { steps: 10 })
  await page.mouse.down()
  await page.mouse.move(offset.left + 40, offset.centerY, { steps: 10 })
  await page.mouse.up()

  await expect(offset.width).toBeCloseTo(80)
})
