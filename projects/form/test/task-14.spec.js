const { test, expect } = require('@playwright/test')
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('multi1 change required', async ({ page }) => {
  await expect(page.locator('input[type="checkbox"][name="multi1"]:optional')).toHaveCount(3)
  await expect(page.locator('input[type="checkbox"][name="multi1"]:required')).toHaveCount(0)

  await page.locator('#multi1 .q-required').check()
  await expect(page.locator('input[type="checkbox"][name="multi1"]:optional')).toHaveCount(3)
  await expect(page.locator('input[type="checkbox"][name="multi1"]:required')).toHaveCount(0)
})

test('multi1 validate', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.getAll('multi1')).toEqual(['0'])
  })

  page.on('dialog', async (dialog) => {
    if (dialog.type() === 'alert') {
      await dialog.accept()
    }
  })

  await page.locator('#multi1 .q-required').check()
  await submit(page)
  await expect(page.locator('input[type="checkbox"][name="multi1"]:invalid')).toHaveCount(0)

  await page.locator('input[type="checkbox"][name="multi1"]').first().check()
  await submit(page)
})
