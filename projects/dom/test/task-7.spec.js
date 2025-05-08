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

test('common/menu.js', async ({ page }) => {
  await expect(isExisted('common/menu.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('show/hide file menu', async ({ page }) => {
  await expect(page.locator('.menu')).toBeHidden()

  await page.locator('.entries > .file').click({ button: 'right' })
  await expect(page.locator('.menu')).toBeVisible()

  await page.locator('.entries').click()
  await expect(page.locator('.menu')).toBeHidden()
})

test('menu item file/delete', async ({ page }) => {
  await page.locator('.entries > .file').click({ button: 'right' })
  await expect(page.locator('.menu .menu-item-delete')).toBeVisible()
  await page.locator('.menu .menu-item-delete').click()
  await expect(page.locator('.menu')).toBeHidden()

  await expect(page.locator('.entries > .file')).not.toBeAttached()
})

test('show/hide dir menu', async ({ page }) => {
  await expect(page.locator('.menu')).toBeHidden()

  await page.locator('.entries > .dir').click({ button: 'right' })
  await expect(page.locator('.menu')).toBeVisible()

  await page.locator('.entries').click()
  await expect(page.locator('.menu')).toBeHidden()
})

test('menu item dir/delete', async ({ page }) => {
  await page.locator('.entries > .dir').click({ button: 'right', position: { x: 0, y: 0 } })
  await expect(page.locator('.menu .menu-item-delete')).toBeVisible()
  await page.locator('.menu .menu-item-delete').click()
  await expect(page.locator('.menu')).toBeHidden()

  await expect(page.locator('.entries > .dir')).not.toBeAttached()
})

test('menu item dir/add file', async ({ page }) => {
  await page.locator('.entries > .dir').click({ button: 'right', position: { x: 0, y: 0 } })
  await expect(page.locator('.menu .menu-item-add-file')).toBeVisible()
  await page.locator('.menu .menu-item-add-file').click()
  await expect(page.locator('.menu')).toBeHidden()

  await expect(page.locator('.entries > .dir .file:nth-child(3)')).toBeVisible()
})

test('menu item dir/add dir', async ({ page }) => {
  await page.locator('.entries > .dir').click({ button: 'right', position: { x: 0, y: 0 } })
  await expect(page.locator('.menu .menu-item-add-dir')).toBeVisible()
  await page.locator('.menu .menu-item-add-dir').click()
  await expect(page.locator('.menu')).toBeHidden()

  await expect(page.locator('.entries > .dir .dir:nth-child(3)')).toBeVisible()
})
