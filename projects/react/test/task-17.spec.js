const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Test Focus in Comment TextArea with "Charming Blog!"', async ({ page }) => {
  await page.getByText('Fast Comment').click()
  // Comment will not be submitted
  await expect(page.locator('.comment-item:has-text("Charming Blog!")')).toBeHidden()

  // TextArea is focused with text 'Charming Blog!'
  const textArea = page.getByPlaceholder('Enter Your Comment')
  await expect(textArea).toBeFocused()
  await expect(textArea).toHaveValue('Charming Blog!')
})

test('Submit "Fast Comment"', async ({ page }) => {
  await page.getByText('Fast Comment').click()
  await page.locator('.comment-btn').click()

  // Comment will not be submitted
  await expect(page.locator('.comment-item:has-text("Charming Blog!")')).toBeVisible()
})
