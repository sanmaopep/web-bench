const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check Blog Length', async ({ page }) => {
  await expect(page.locator('.blog-list-len')).toContainText('3')

  await page.getByText('Add Blog').click()
  await page.getByLabel('title').fill('Len Check')
  await page.getByLabel('detail').fill('Len Check 1')
  await page.locator('.submit-btn').click()
  await expect(page.locator('.blog-list-len')).toContainText('4')

  await page.getByText('Add Blog').click()
  await page.getByLabel('title').fill('Len Check 2')
  await page.getByLabel('detail').fill('Len Check 2')
  await page.locator('.submit-btn').click()
  await expect(page.locator('.blog-list-len')).toContainText('5')
})

test('Check Submit Work Blog', async ({ page }) => {
  await page.getByText('Add Blog').click()
  await page.getByLabel('title').fill('Work')
  await page.getByLabel('detail').fill('Work in ByteDance is pleasant!')
  await page.locator('.submit-btn').click()

  await expect(page.locator('.list-item:has-text("Work")')).toBeVisible()
  await expect(page.getByText('Work in ByteDance is pleasant!')).toBeVisible()
})

test('Check Submit Blog With Check Duplication', async ({ page }) => {
  await page.getByText('Add Blog').click()
  await page.getByLabel('title').fill('DuplicationCheck')
  await page.getByLabel('detail').fill('DuplicationCheck Content 1')

  await page.locator('.submit-btn').click()

  const duplicationCheckListItem = page.locator('.list-item:has-text("DuplicationCheck")')
  await expect(duplicationCheckListItem).toBeVisible()
  await duplicationCheckListItem.click()
  await expect(page.getByText('DuplicationCheck Content 1')).toBeVisible()
  await expect(page.locator('.blog-list-len')).toContainText('4')

  await page.getByText('Add Blog').click()
  await page.getByLabel('title').fill('DuplicationCheck')
  await page.getByLabel('detail').fill('DuplicationCheck Content 2')

  const submitButton = page.locator('.submit-btn')

  // Check if the button is clickable, in some case will prevent
  if (!(await submitButton.isEnabled())) {
    // Submit button is not clickable, returning early.
    return
  }

  // If the button is clickable, click it
  await submitButton.click()

  expect(await page.locator('.list-item:has-text("DuplicationCheck")').count()).toBe(1)
  await expect(page.locator('.blog-list-len')).toContainText('4')
})
