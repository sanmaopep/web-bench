const { test, expect } = require('@playwright/test')

test(`import png should work`, async ({ page }) => {
  await page.goto(`/index.html`)

  expect(await page.locator('#bird').getAttribute('src')).toMatch(/(data:image|\.png)/)
})

test(`import svg should work`, async ({ page }) => {
  await page.goto(`/index.html`)

  expect(await page.locator('#svg').getAttribute('src')).toMatch(/(data:image|\.svg)/)
})