const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('common/RatingQuestion.js', async ({ page }) => {
  await expect(isExisted('common/RatingQuestion.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('rating1 submit', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('rating1')).toBe('1')
  })

  await page.locator('#rating1 .star').nth(4).click()
  await submit(page)
})

test('rating2 submit', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('rating2')).toBe('0.5')
  })

  await page.locator('#rating2 .star').nth(4).click()
  await submit(page)
})