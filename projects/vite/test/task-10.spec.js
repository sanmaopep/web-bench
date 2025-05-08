const { test, expect } = require('@playwright/test')

test(`import react component should work`, async ({ page }) => {
  await page.goto(`/index.html`)

  await expect(page.getByText('hello react')).toBeVisible()
})

test(`import vue component should work`, async ({ page }) => {
  await page.goto(`/index.html`)

  await expect(page.getByText('hello vue')).toBeVisible()
})