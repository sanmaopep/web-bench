const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('.menu-item-insert-row-above cell-1-1', async ({ page }) => {
  const td = page.locator('.table tbody tr:nth-child(1) td:nth-child(3)')
  const menuitem = page.locator('.menu-item-insert-row-above')

  await expect(td).toBeVisible()
  await td.click({ button: 'right' })
  await expect(menuitem).toBeVisible()

  await expect(page.locator('.table tbody tr')).toHaveCount(2)
  await menuitem.click()
  await expect(page.locator('.table tbody tr')).toHaveCount(3)
})

test('.menu-item-insert-row-below last-child', async ({ page }) => {
  const td = page.locator('.table tbody tr:nth-child(2) td:nth-child(3)')
  const menuitem = page.locator('.menu-item-insert-row-below')

  await expect(td).toBeVisible()
  await td.click({ button: 'right' })
  await expect(menuitem).toBeVisible()

  await expect(page.locator('.table tbody tr')).toHaveCount(2)
  await menuitem.click()
  await expect(page.locator('.table tbody tr')).toHaveCount(3)
})

test('.menu-item-delete-row cell-1-1', async ({ page }) => {
  const td = page.locator('.table tbody tr:nth-child(2) td:nth-child(3)')
  const menuitem = page.locator('.menu-item-delete-row')

  await expect(td).toBeVisible()
  await td.click({ button: 'right' })
  await expect(menuitem).toBeVisible()

  await expect(page.locator('.table tbody tr')).toHaveCount(2)
  await menuitem.click()
  await expect(page.locator('.table tbody tr')).toHaveCount(1)
  await expect(td).toBeHidden()
})

test('.menu-item-delete-row last-child', async ({ page }) => {
  const td = page.locator('.table tbody tr:nth-child(1) td:nth-child(3)')
  const menuitem = page.locator('.menu-item-delete-row')

  await expect(td).toBeVisible()
  await td.click({ button: 'right' })
  await expect(menuitem).toBeVisible()

  await expect(page.locator('.table tbody tr')).toHaveCount(2)
  await menuitem.click()
  await expect(page.locator('.table tbody tr')).toHaveCount(1)
})
