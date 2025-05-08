const { test, expect } = require('@playwright/test')
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')
const { isDeepStrictEqual } = require('util')

test.beforeEach(async ({ page }) => {
  await page.goto('/design.html')
})

test('question .add button', async ({ page }) => {
  await page.locator('.add-question').click()
  await page.locator('.add-single').click()

  await expect(page.locator('.q .add').nth(0)).toBeVisible()
  await expect(page.locator('.q .add').nth(1)).toBeVisible()
})

test('popup', async ({ page }) => {
  await page.locator('.add-question').click()
  await page.locator('.add').click()
  await expect(page.locator('.popup')).toBeVisible()
  await page.locator('body').click()
  await expect(page.locator('.popup')).toBeHidden()
})

test('popup add question', async ({ page }) => {
  await page.locator('.add-question').click()
  await page.locator('.add').click()
  await expect(page.locator('.popup')).toBeVisible()
  await expect(page.locator('.q')).toHaveCount(1)
  await page.locator('.popup .add-question').click()
  await expect(page.locator('.q')).toHaveCount(2)
})

test('popup insert after question', async ({ page }) => {
  await page.locator('.add-question').click()
  await page.locator('.add-question').click()
  await expect(page.locator('.q')).toHaveCount(2)
  
  await page.locator('.add').nth(0).click()
  await page.locator('.popup .add-single').click()
  await expect(page.locator('.q')).toHaveCount(3)
  await expect(page.locator('.q').nth(1).locator('.option')).toHaveCount(3)
  await expect(page.locator('.contents-item')).toHaveCount(3)
})
