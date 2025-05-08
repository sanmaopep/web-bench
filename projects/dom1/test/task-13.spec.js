// @ts-nocheck
const { test, expect } = require('@playwright/test')
const { getEntryName } = require('./util/index')
const { getViewport, getOffset, getComputedStyle, isExisted } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')

  const addFile = page.locator('.tools button:text("file")')
  const addDir = page.locator('.tools button:text("dir")')
  await addFile.click()
  await addDir.click()
  // add to sub dir
  await addFile.click()
  await addDir.click() // selected
})

test('edit file', async ({ page }) => {
  await page.locator('.entries > .file').click()
  const oldContent = await page.locator('.entries > .file').getAttribute('data-content')
  await expect(page.locator('.editor')).toHaveValue(oldContent)
  const newContent = Math.random() + ''
  await page.locator('.editor').clear()
  await page.locator('.editor').focus()
  await page.keyboard.type(newContent)
  await expect(page.locator('.editor')).toHaveValue(newContent)
  await expect(page.locator('.entries > .file')).toHaveAttribute('data-content', newContent)
})

test('edit files', async ({ page }) => {
  await page.locator('.entries > .file').click()
  const oldContent = await page.locator('.entries > .file').getAttribute('data-content')
  await expect(page.locator('.editor')).toHaveValue(oldContent)
  const newContent = Math.random() + ''
  await page.locator('.editor').clear()
  await page.locator('.editor').focus()
  await page.keyboard.type(newContent)
  await expect(page.locator('.editor')).toHaveValue(newContent)
  await expect(page.locator('.entries > .file')).toHaveAttribute('data-content', newContent)

  await page.locator('.entries > .dir .file').click()
  await expect(page.locator('.editor')).not.toHaveValue(newContent)
  await page.locator('.entries > .file').click()
  await expect(page.locator('.editor')).toHaveValue(newContent)
})
