const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('common/OpenQuestion.js', async ({ page }) => {
  await expect(isExisted('common/OpenQuestion.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('single line controls', async ({ page }) => {
  await expect(page.locator('*[name="open1"]')).toHaveCount(1)
})

test('multi lines controls', async ({ page }) => {
  await expect(page.locator('textarea[name="open2"]')).toHaveCount(1)
})

test('submit empty content', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('open1')).toBe('')
    await expect(searchParams.get('open2')).toBe('')
  })

  await submit(page)
})

test('single line submit', async ({ page }) => {
  const line = new Date().getTime() + ''
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('open1')).toBe(line)
  })

  // input or textarea are ok
  await page.locator('*[name="open1"]').clear()
  await page.locator('*[name="open1"]').fill(line)
  await submit(page)
})

test('multi lines submit', async ({ page }) => {
  const lines = new Date().getTime() + '\n' + new Date().getTime()
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('open2')?.replaceAll('\r\n', '\n')).toBe(lines)
  })

  await page.locator('textarea[name="open2"]').clear()
  await page.locator('textarea[name="open2"]').fill(lines)
  await submit(page)
})
