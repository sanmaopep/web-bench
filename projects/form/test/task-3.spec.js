const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('common/MultiSelectionQuestion.js', async ({ page }) => {
  await expect(
    isExisted('common/MultiSelectionQuestion.js', path.join(__dirname, '../src'))
  ).toBeTruthy()
})

test('multi1 controls', async ({ page }) => {
  await expect(page.locator('input[type="checkbox"][name="multi1"]')).toHaveCount(3)
  await expect(page.locator('input[type="checkbox"][name="multi1"]').nth(2)).toBeVisible()
})

test('multi1 submit', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.has('multi1')).toBeTruthy()
    await expect(searchParams.getAll('multi1')).toEqual(['1', '2'])
  })

  await page.locator('input[name="multi1"]').nth(1).check()
  await page.locator('input[name="multi1"]').nth(2).check()
  await submit(page)
})

test('multi1 submit 2', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.has('multi1')).toBeTruthy()
    await expect(searchParams.getAll('multi1')).toEqual(['0', '2'])
  })

  await page.locator('input[name="multi1"]').nth(1).check()
  await page.locator('input[name="multi1"]').nth(1).uncheck()
  await page.locator('input[name="multi1"]').nth(2).check()
  await page.locator('input[name="multi1"]').nth(0).check()
  await submit(page)
})
