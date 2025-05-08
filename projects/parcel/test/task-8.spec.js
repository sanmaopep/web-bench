const { test, expect } = require('@playwright/test')

test(`Should CSS work`, async ({ page }) => {
  await page.goto(`/index.html`)

  await expect(await getColor(page.getByText('hello css'))).toBe('rgb(0, 0, 255)')
})

test(`Should less work`, async ({ page }) => {
  await page.goto(`/index.html`)

  await expect(await getColor(page.getByText('hello less', { exact: true }))).toBe('rgb(0, 255, 0)')
})

test(`Should less modules work`, async ({ page }) => {
  await page.goto(`/index.html`)

  await expect(await getColor(page.getByText(`hello less modules`, { exact: true }))).toBe('rgb(255, 0, 0)')
})

async function getColor(element) {
  return await element.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('color')
  })
}