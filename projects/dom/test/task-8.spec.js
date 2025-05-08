const { test, expect } = require('@playwright/test')
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

test('menu item entries/add file', async ({ page }) => {
  await page.locator('.entries').click({ button: 'right' })
  await expect(page.locator('.menu .menu-item-add-file')).toBeVisible()
  await page.locator('.menu .menu-item-add-file').click()
  await expect(page.locator('.menu')).toBeHidden()

  await expect(page.locator('.entries > .file:nth-child(3)')).toBeVisible()
})

test('menu item entries/add dir', async ({ page }) => {
  await page.locator('.entries').click({ button: 'right' })
  await expect(page.locator('.menu .menu-item-add-dir')).toBeVisible()
  await page.locator('.menu .menu-item-add-dir').click()
  await expect(page.locator('.menu')).toBeHidden()

  await expect(page.locator('.entries > .dir:nth-child(3)')).toBeVisible()
})

test('menu item no entries/delete', async ({ page }) => {
  await page.locator('.entries').click({ button: 'right' })
  await expect(page.locator('.menu .menu-item-delete')).toBeHidden()
})