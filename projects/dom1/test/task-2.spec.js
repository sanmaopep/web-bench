const path = require('path')
const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')

  const addFile = page.locator('.tools button:text("file")')
  await addFile.click()
})

test('> 1 file existed', async ({ page }) => {
  const count = await page.locator('.entries > .file').count()
  await expect(count).toBeGreaterThan(0)
})

test('file entry', async ({ page }) => {
  await expect(page.locator('.entries > .entry.file:nth-child(1)')).toBeVisible()
})

test('add files', async ({ page }) => {
  const addFile = page.locator('.tools button:text("file")')
  const count1 = await page.locator('.entries .file').count()
  await addFile.click()
  const count2 = await page.locator('.entries .file').count()
  await expect(count2).toBe(count1 + 1)

  await expect(await page.locator('.entries > .file:nth-child(1)').getAttribute('id')).not.toBe(
    await page.locator('.entries > .file:nth-child(2)').getAttribute('id')
  )
})

test('click file', async ({ page }) => {
  const addFile = page.locator('.tools button:text("file")')
  await addFile.click()
  await addFile.click()
  await addFile.click()

  const locators = await page.locator('.tools .file').all()
  for (const locator of locators) {
    await locator.click()
    const content = (await locator.getAttribute('data-content')) ?? ''
    await expect(page.locator('.editor')).toHaveText(content)
  }
})
