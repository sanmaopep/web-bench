const { test, expect } = require('@playwright/test')
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('likert1 change required', async ({ page }) => {
  await expect(page.locator('*[name="likert1_0"]:optional')).toHaveCount(5)
  await expect(page.locator('*[name="likert1_0"]:required')).toHaveCount(0)
  await expect(page.locator('*[name="likert1_1"]:optional')).toHaveCount(5)
  await expect(page.locator('*[name="likert1_1"]:required')).toHaveCount(0)
  await expect(page.locator('*[name="likert1_2"]:optional')).toHaveCount(5)
  await expect(page.locator('*[name="likert1_2"]:required')).toHaveCount(0)

  await page.locator('#likert1 .q-required').check()
  await expect(page.locator('*[name="likert1_0"]:optional')).toHaveCount(0)
  await expect(page.locator('*[name="likert1_0"]:required')).toHaveCount(5)
  await expect(page.locator('*[name="likert1_1"]:optional')).toHaveCount(0)
  await expect(page.locator('*[name="likert1_1"]:required')).toHaveCount(5)
  await expect(page.locator('*[name="likert1_2"]:optional')).toHaveCount(0)
  await expect(page.locator('*[name="likert1_2"]:required')).toHaveCount(5)
})

test('likert1 validate', async ({ page }) => {
  const line = new Date().getTime() + ''
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('likert1_0')).toBe('0')
    await expect(searchParams.get('likert1_1')).toBe('2')
    await expect(searchParams.get('likert1_2')).toBe('4')
  })

  await page.locator('#likert1 .q-required').check()
  await submit(page)
  await expect(page.locator('*[name="likert1_0"]:invalid')).toHaveCount(5)
  await expect(page.locator('*[name="likert1_1"]:invalid')).toHaveCount(5)
  await expect(page.locator('*[name="likert1_2"]:invalid')).toHaveCount(5)

  await page.locator('*[name="likert1_0"]').nth(0).check()
  await page.locator('*[name="likert1_1"]').nth(2).check()
  await page.locator('*[name="likert1_2"]').nth(4).check()
  await submit(page)
  await expect(page.locator('*[name="likert1_0"]:invalid')).toHaveCount(0)
  await expect(page.locator('*[name="likert1_1"]:invalid')).toHaveCount(0)
  await expect(page.locator('*[name="likert1_2"]:invalid')).toHaveCount(0)
})

test('nps1 change required', async ({ page }) => {
  await expect(page.locator('#nps1 input[type="radio"]:optional')).toHaveCount(11)
  await expect(page.locator('#nps1 input[type="radio"]:required')).toHaveCount(0)

  await page.locator('#nps1 .q-required').check()
  await expect(page.locator('#nps1 input[type="radio"]:optional')).toHaveCount(0)
  await expect(page.locator('#nps1 input[type="radio"]:required')).toHaveCount(11)
})

test('nps1 validate', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('nps1')).toBe('10')
  })

  await page.locator('#nps1 .q-required').check()
  await submit(page)
  await expect(page.locator('#nps1 input[type="radio"]:invalid')).toHaveCount(11)

  await page.locator('#nps1 .score').first().check()
  await page.locator('#nps1 .score').last().check()
  await submit(page)
  await expect(page.locator('#nps1 input[type="radio"]:invalid')).toHaveCount(0)
})

test('rating1 change required', async ({ page }) => {
  await expect(page.locator('#rating1 input[type="radio"]:optional')).toHaveCount(5)
  await expect(page.locator('#rating1 input[type="radio"]:required')).toHaveCount(0)

  await page.locator('#rating1 .q-required').check()
  await expect(page.locator('#rating1 input[type="radio"]:optional')).toHaveCount(0)
  await expect(page.locator('#rating1 input[type="radio"]:required')).toHaveCount(5)
})

test('rating1 validate', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('rating1')).toBe('1')
  })

  await page.locator('#rating1 .q-required').check()
  await submit(page)
  await expect(page.locator('#rating1 input[type="radio"]:invalid')).toHaveCount(5)

  await page.locator('#rating1 .star').first().click()
  await page.locator('#rating1 .star').last().click()
  await submit(page)
  await expect(page.locator('#rating1 input[type="radio"]:invalid')).toHaveCount(0)
})
