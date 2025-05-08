const { test, expect } = require('@playwright/test')
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test.beforeEach(async ({ page }) => {
  await page.goto('/design.html')
})

test('multi change required', async ({ page: designPage }) => {
  await designPage.locator('.add-multi').click()
  await expect(designPage.locator('input[type="checkbox"]:required')).toHaveCount(0)

  await designPage.locator('.q-required').check()
  await expect(designPage.locator('input[type="checkbox"]:required')).toHaveCount(0)
})

test('multi validate', async ({ page: designPage, context }) => {
  await designPage.locator('.add-multi').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? `${+new Date()}`
  await designPage.locator('.q-required').check()

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(searchParams.getAll(name)).toEqual(['0', '2'])
  })
  previewPage.on('dialog', async (dialog) => {
    if (dialog.type() === 'alert') {
      await dialog.accept()
    }
  })
  await submit(previewPage)
  await expect(previewPage.locator('input[type="checkbox"]:invalid')).toHaveCount(0)
  await previewPage.locator('input[type="checkbox"]').nth(0).check()
  await previewPage.locator('input[type="checkbox"]').nth(2).check()
  await submit(previewPage)
})
