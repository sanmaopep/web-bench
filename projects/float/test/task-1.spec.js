const { test, expect } = require('@playwright/test')
const {
  getComputedStyle,
  getOffset,
  getHtmlElement,
  expectTolerance,
} = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.root no flex & grid', async ({ page }) => {
  await expect(page.locator('.root')).not.toHaveCSS('display', /grid|flex/i)
  await expect(page.locator('.root')).toHaveCSS('position', /static/i)
})

test('.header .footer .content visible', async ({ page }) => {
  await expect(page.locator('.header')).toBeVisible()
  await expect(page.locator('.footer')).toBeVisible()
  await expect(page.locator('.content')).toBeVisible()
})

test('.header fixed top', async ({ page }) => {
  const offset = await getOffset(page, '.header')
  expect(offset.top).toEqual(0)
  expect(offset.left).toEqual(0)
})

test('.footer fixed bottom', async ({ page }) => {
  const offset = await getOffset(page, '.footer')
  const bodyHeight = (await getOffset(page, 'body')).height
  expect(offset.left).toEqual(0)
  expect(offset.bottom).toEqual(bodyHeight)
})

test('.content uses remaining height', async ({ page }) => {
  const header = await getOffset(page, '.header')
  const footer = await getOffset(page, '.footer')
  const content = await getOffset(page, '.content')
  const body = await getOffset(page, 'body')
  expectTolerance(header.height + footer.height + content.height, body.height, 1)
})
