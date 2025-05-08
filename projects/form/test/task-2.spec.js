const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('common/SingleSelectionQuestion.js', async ({ page }) => {
  await expect(
    isExisted('common/SingleSelectionQuestion.js', path.join(__dirname, '../src'))
  ).toBeTruthy()
})

test('single1 controls', async ({ page }) => {
  await expect(page.locator('input[type="radio"][name="single1"]')).toHaveCount(3)
  await expect(page.locator('input[type="radio"][name="single1"]').nth(2)).toBeVisible()
})

test('single1 submit', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('single1')).toBe('2')
  })

  await page.locator('input[name="single1"]').nth(2).check()
  await submit(page)
})

test('single1 submit 2', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('single1')).toBe('0')
  })

  await page.locator('input[name="single1"]').nth(2).check()
  await page.locator('input[name="single1"]').nth(1).check()
  await page.locator('input[name="single1"]').nth(0).check()
  await submit(page)
})
