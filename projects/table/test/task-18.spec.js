const { test, expect } = require('@playwright/test')
const { getOffsetByLocator, isExisted } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('drag the selected col to other col right half', async ({ page }) => {
  const th11 = page.locator('.table thead tr:nth-child(1) th:nth-child(1)')
  const th13 = page.locator('.table thead tr:nth-child(1) th:nth-child(3)')
  const text = new Date().getTime() + ''

  // edit
  await th11.dblclick()
  await th11.clear()
  await th11.fill(text)
  await page.keyboard.press('Escape')
  await expect(th11).toHaveText(text)
  // select col
  await th11.click({ button: 'right' })
  await page.locator('.menu-item-select-col').click()

  // move col
  const offset11 = await getOffsetByLocator(th11)
  const offset13 = await getOffsetByLocator(th13) // th11 is wider
  // console.log({ offset11, offset13 })
  await page.mouse.move(offset11.centerX, offset11.centerY, { steps: 10 })
  await page.mouse.down()
  // step @see https://github.com/microsoft/playwright/issues/22856#issuecomment-1538765230
  await page.mouse.move(offset13.centerX + 1, offset13.centerY, { steps: 10 })
  await page.mouse.up()

  await expect(th13).toHaveText(text)
})

test('drag the selected col to other col left half', async ({ page }) => {
  const th11 = page.locator('.table thead tr:nth-child(1) th:nth-child(1)')
  const th12 = page.locator('.table thead tr:nth-child(1) th:nth-child(2)')
  const th13 = page.locator('.table thead tr:nth-child(1) th:nth-child(3)')
  const text = new Date().getTime() + ''

  // edit
  await th11.dblclick()
  await th11.clear()
  await th11.fill(text)
  await page.keyboard.press('Escape')
  await expect(th11).toHaveText(text)
  // select col
  await th13.click({ button: 'right' })
  await page.locator('.menu-item-select-col').click()

  // move col
  const offset11 = await getOffsetByLocator(th11)
  const offset13 = await getOffsetByLocator(th13) // th11 is wider
  await page.mouse.move(offset13.centerX, offset13.centerY, { steps: 10 })
  await page.mouse.down()
  // step @see https://github.com/microsoft/playwright/issues/22856#issuecomment-1538765230
  await page.mouse.move(offset11.centerX - 1, offset11.centerY, { steps: 10 })
  await page.mouse.up()

  await expect(th12).toHaveText(text)
})

test('can not drag the col with any unselected cells', async ({ page }) => {
  const th11 = page.locator('.table thead tr:nth-child(1) th:nth-child(1)')
  const th13 = page.locator('.table thead tr:nth-child(1) th:nth-child(3)')
  const text = new Date().getTime() + ''

  // edit
  await th11.dblclick()
  await th11.clear()
  await th11.fill(text)
  await page.keyboard.press('Escape')
  await expect(th11).toHaveText(text)
  await expect(th11).toHaveClass(/selected/i)

  // move col
  const offset11 = await getOffsetByLocator(th11)
  const offset13 = await getOffsetByLocator(th13) // th11 is wider
  // console.log({ offset11, offset13 })
  await page.mouse.move(offset11.centerX, offset11.centerY, { steps: 10 })
  await page.mouse.down()
  // step @see https://github.com/microsoft/playwright/issues/22856#issuecomment-1538765230
  await page.mouse.move(offset13.centerX + 1, offset13.centerY, { steps: 10 })
  await page.mouse.up()

  await expect(th13).not.toHaveText(text)
  await expect(th11).toHaveText(text)
})
