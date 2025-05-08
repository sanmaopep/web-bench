const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')

test('SurveyPreview files', async ({ page }) => {
  await expect(isExisted('common/SurveyPreview.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('preview 0 question', async ({ page }) => {
  await page.goto('/preview.html')
  await expect(page.locator('fieldset.q')).toHaveCount(0)
})

test('preview questions', async ({ page, context }) => {
  await page.goto('/design.html')
  await page.locator('.add-question').click()
  await page.locator('.add-question').click()

  const previewPagePromise = context.waitForEvent('page')
  await page.locator('.preview').click()

  const previewPage = await previewPagePromise
  await expect(previewPage.locator('fieldset.q')).toHaveCount(2)
})

test('preview question, readonly title, no config', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-question').click()
  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await expect(previewPage.locator('.q-config')).toBeHidden()
  const title = previewPage.locator('.q-title')
  await expect(title).not.toHaveAttribute('contenteditable', 'true')
  await title.click({ force: true })
  await expect(title).not.toHaveAttribute('contenteditable', 'true')
})
