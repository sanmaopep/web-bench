const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check Submit Work Blog', async ({ page }) => {
  await page.getByText('Add Blog').click()
  await page.getByLabel('title').fill('Work')
  await page.getByLabel('detail').fill('Work in ByteDance is pleasant!')
  await page.locator('.submit-btn').click()

  await expect(page.locator('.list-item:has-text("Work")')).toBeVisible()
  await expect(page.getByText('Work in ByteDance is pleasant!')).toBeVisible()
})

test('Check Submit Family Blog', async ({ page }) => {
  await page.getByText('Add Blog').click()
  await page.getByLabel('title').fill('Family')
  await page.getByLabel('detail').fill('I love my family!')
  await page.locator('.submit-btn').click()

  await expect(page.locator('.list-item:has-text("Family")')).toBeVisible()
  await expect(page.getByText('I love my family!')).toBeVisible()
})

test('Check Keep Mock Data', async ({ page }) => {
  await expect(page.locator('.list-item:has-text("Morning")')).toBeVisible()
  await expect(page.locator('.list-item:has-text("Travel")')).toBeVisible()
})
