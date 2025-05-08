const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/design.html')
})

test('common/Question.js', async ({ page }) => {
  await expect(isExisted('common/Question.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/Question.scss', path.join(__dirname, '../src'))).toBeTruthy()
})

test('add question', async ({ page }) => {
  await expect(page.locator('.add-question')).toBeVisible()
  await page.locator('.add-question').click()
  await expect(page.locator('fieldset.q')).toHaveCount(1)
  await expect(page.locator('fieldset.q legend.q-title')).toBeVisible()
  await expect(page.locator('fieldset.q legend.q-title + .q-body')).toBeAttached()
})

test('add questions', async ({ page }) => {
  await expect(page.locator('.add-question')).toBeVisible()
  await page.locator('.add-question').click()
  await page.locator('.add-question').click()
  await expect(page.locator('.q')).toHaveCount(2)
})
