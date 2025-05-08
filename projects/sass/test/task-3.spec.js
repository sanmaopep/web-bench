const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {})

test('SurveyDesign files', async ({ page }) => {
  await expect(isExisted('common/SurveyDesign.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/SurveyDesign.scss', path.join(__dirname, '../src'))).toBeTruthy()
})

test('design page', async ({ page }) => {
  await page.goto('/design.html')

  await expect(page.locator('.add-question')).toBeVisible()
  await page.locator('.add-question').click()
  await page.locator('.add-question').click()
  await expect(page.locator('.q')).toHaveCount(2)
})