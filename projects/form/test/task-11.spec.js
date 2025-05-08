const { test, expect } = require('@playwright/test')
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')
const exp = require('constants')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('question config', async ({ page }) => {
  await expect(page.locator('#single1 .q-config')).toBeVisible()
  await expect(page.locator('#single1 input[type="checkbox"].q-required')).toBeVisible()
})

test('single1 change required', async ({ page }) => {
  await expect(page.locator('#single1 input[type="radio"]:optional')).toHaveCount(3)
  await expect(page.locator('#single1 input[type="radio"]:required')).toHaveCount(0)

  await page.locator('#single1 .q-required').check()
  await expect(page.locator('#single1 input[type="radio"]:optional')).toHaveCount(0)
  await expect(page.locator('#single1 input[type="radio"]:required')).toHaveCount(3)
})

test('single1 validate', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('single1')).toBe('2')
  })

  await page.locator('#single1 .q-required').check()
  await submit(page)
  await expect(page.locator('#single1 input[type="radio"]:invalid')).toHaveCount(3)

  await page.locator('#single1 input[type="radio"]').nth(0).check()
  await page.locator('#single1 input[type="radio"]').nth(2).check()
  await submit(page)
})

test('form checkValidity()', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('single1')).toBe('2')
  })

  await page.locator('#single1 .q-required').check()
  await submit(page)
  /** @type {boolean} */
  const valid = await page
    .locator('form')
    .first()
    // @ts-ignore
    .evaluate((el) => el.checkValidity())

  await expect(valid).toBeFalsy()
})
