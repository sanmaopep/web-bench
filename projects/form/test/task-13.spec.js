const { test, expect } = require('@playwright/test')
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('open1 change required', async ({ page }) => {
  await expect(page.locator('*[name="open1"]:optional')).toHaveCount(1)
  await expect(page.locator('*[name="open1"]:required')).toHaveCount(0)

  await page.locator('#open1 .q-required').check()
  await expect(page.locator('*[name="open1"]:optional')).toHaveCount(0)
  await expect(page.locator('*[name="open1"]:required')).toHaveCount(1)
})

test('open1 validate', async ({ page }) => {
  const line = new Date().getTime() + ''
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('open1')).toBe(line)
  })

  await page.locator('#open1 .q-required').check()
  await submit(page)
  await expect(page.locator('*[name="open1"]:invalid')).toHaveCount(1)

  await page.locator('*[name="open1"]').clear()
  await page.locator('*[name="open1"]').fill(line)
  await submit(page)
  await expect(page.locator('*[name="open1"]:invalid')).toHaveCount(0)
})

test('open2 change required', async ({ page }) => {
  await expect(page.locator('textarea[name="open2"]:optional')).toHaveCount(1)
  await expect(page.locator('textarea[name="open2"]:required')).toHaveCount(0)

  await page.locator('#open2 .q-required').check()
  await expect(page.locator('textarea[name="open2"]:optional')).toHaveCount(0)
  await expect(page.locator('textarea[name="open2"]:required')).toHaveCount(1)
})

test('open2 validate', async ({ page }) => {
  const line = new Date().getTime() + ''
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('open2')).toBe(line)
  })

  await page.locator('#open2 .q-required').check()
  await submit(page)
  await expect(page.locator('textarea[name="open2"]:invalid')).toHaveCount(1)

  await page.locator('textarea[name="open2"]').clear()
  await page.locator('textarea[name="open2"]').fill(line)
  await submit(page)
  await expect(page.locator('textarea[name="open2"]:invalid')).toHaveCount(0)
})

test('open2 validate minLength', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('open2')).toBe('123')
  })

  await page.locator('#open2 .q-required').check()
  await submit(page)
  await expect(page.locator('textarea[name="open2"]:invalid')).toHaveCount(1)

  await page.locator('textarea[name="open2"]').evaluate((el) => el.setAttribute('minLength', '3'))
  await page.locator('textarea[name="open2"]').fill('12')
  await submit(page)
  await expect(page.locator('textarea[name="open2"]:invalid')).toHaveCount(1)

  await page.locator('textarea[name="open2"]').fill('123')
  await submit(page)
  await expect(page.locator('textarea[name="open2"]:invalid')).toHaveCount(0)
})
