const { test, expect } = require('@playwright/test')
const { setTimeout } = require('timers/promises')

test.beforeEach(async ({ page }) => {
  await page.goto(`/index.html`)
})

test('Insert Snippet in toolbar', async ({ page }) => {
  await page.locator('#editor').click()
  await page.getByText("Insert Snippet").click()
  expect(await page.locator('#editor').textContent()).toMatch(/true\s+OR\s+false/)
  await page.locator('#editor').press('ArrowRight')
  await page.locator('#editor').press('Shift' + '+ArrowLeft'.repeat(5))
  await page.getByText('Insert Snippet').click()
  expect(await page.locator('#editor').textContent()).toMatch(/true\s+OR\s+true\s+OR\s+false/)
})