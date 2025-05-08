const { test, expect } = require('@playwright/test')
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('common/NpsQuestion.js', async ({ page }) => {
  await expect(isExisted('common/NpsQuestion.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('nps1', async ({ page }) => {
  await expect(page.locator('#nps1 .score')).toHaveCount(11)
})

test('nps1 submit 10', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('nps1')).toBe('10')
  })

  await page.locator('#nps1 .score').nth(10).click()
  await submit(page)
})

test('nps1 submit 0', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('nps1')).toBe('0')
  })

  await page.locator('#nps1 .score').nth(0).click()
  await submit(page)
})
