const { test, expect } = require('@playwright/test')
const { getCssRawText } = require('./util')

let css = ''

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  css = await getCssRawText(page)
})

test('links', async ({ page }) => {
  const items = page.locator(`#table tr:nth-child(1) td:nth-child(4) a`)

  await expect(items.nth(0)).toHaveCSS('text-decoration', /underline/i)
  await expect(items.nth(1)).toHaveCSS('text-decoration', /underline/i)
  await expect(items.nth(2)).toHaveCSS('text-decoration', /underline/i)
})

test('click segment links', async ({ page }) => {
  const items = page.locator(`#table tr:nth-child(1) td:nth-child(4) a`)

  await items.nth(0).click()
  await expect(page.locator(`#table`)).toHaveCSS('background-color', 'rgb(144, 238, 144)')

  await items.nth(1).click()
  await expect(page.locator(`#form`)).toHaveCSS('background-color', 'rgb(144, 238, 144)')
})

test('active link', async ({ page }) => {
  const items = page.locator(`#table tr:nth-child(1) td:nth-child(4) a`)

  await items.nth(0).hover()
  await page.mouse.down()
  await expect(items.nth(0)).toHaveCSS('outline-color', 'rgb(0, 0, 255)')
})

// test('click page links', async ({ page }) => {
//   const items = page.locator(`#table tr:nth-child(1) td:nth-child(4) a`)

//   await items.nth(2).click()
//   await page.waitForLoadState('load')

//   await expect(page.locator(`#table tr:nth-child(1) td:nth-child(4) a:visited`)).toHaveCount(1)

//   // const [newPage] = await Promise.all([
//   //   page.context().waitForEvent('page'), // Wait for a new page
//   //   items.nth(2).click() // Click the link
//   // ]);
//   // await newPage.waitForLoadState('load'); // Wait for full page load

//   await expect(items.nth(2)).toHaveCSS('text-decoration', /none/i)
// })
