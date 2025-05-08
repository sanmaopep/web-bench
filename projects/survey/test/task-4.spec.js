const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/design.html')
})

test('design save 0 quesiton', async ({ page }) => {
  await page.locator('.save').click()
  const data = JSON.parse(await page.evaluate(() => localStorage.data))

  await expect(data.title).toBeDefined()
  await expect(Array.isArray(data.questions)).toBeTruthy()
  await expect(data.questions.length).toBe(0)
})

test('design save questions', async ({ page }) => {
  await page.locator('.add-question').click()
  await page.locator('.add-question').click()
  await page.locator('.save').click()
  const data = JSON.parse(await page.evaluate(() => localStorage.data))

  await expect(data.title).toBeDefined()
  await expect(data.questions.length).toBe(2)
  await expect(data.questions[0].title).toBeDefined()
  await expect(data.questions[0].name).toBeDefined()
})

test('design preview', async ({ page, context }) => {
  await page.locator('.add-question').click()
  const pagePromise = context.waitForEvent('page')
  await page.locator('.preview').click()
  const newPage = await pagePromise
  // console.log(newPage.url())
  await expect(newPage.url()).toContain('preview')
})
