const { test, expect } = require('@playwright/test')
const { getViewport, getOffset, isExisted } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')

  const addFile = page.locator('.tools button:text("file")')
  const addDir = page.locator('.tools button:text("dir")')
  await addFile.click()
  await addDir.click()
})

test('> 1 dir existed', async ({ page }) => {
  const count = await page.locator('.entries > .dir').count()
  await expect(count).toBeGreaterThan(0)
  await expect(page.locator('.entries > .dir:nth-child(2)')).toBeVisible()
})

test('dir entry', async ({ page }) => {
  await expect(page.locator('.entries > .entry.dir:nth-child(2)')).toBeVisible()
})

test('add dirs', async ({ page }) => {
  const addDir = page.locator('.tools button:text("dir")')
  const count1 = await page.locator('.entries .dir').count()
  await addDir.click()
  await addDir.click()
  const count2 = await page.locator('.entries .dir').count()
  await expect(count2).toBe(count1 + 2)
})

test('add dirs and files', async ({ page }) => {
  const addFile = page.locator('.tools button:text("file")')
  const addDir = page.locator('.tools button:text("dir")')

  const fileCount1 = await page.locator('.entries .file').count()
  const dirCount1 = await page.locator('.entries .dir').count()
  await addFile.click()
  await addDir.click()
  await addFile.click()
  await addDir.click()
  await expect(await page.locator('.entries .file').count()).toBe(fileCount1 + 2)
  await expect(await page.locator('.entries .dir').count()).toBe(dirCount1 + 2)
})
