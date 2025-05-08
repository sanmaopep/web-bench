const { test, expect } = require('@playwright/test')
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util');
const { isDeepStrictEqual } = require('util');

test.beforeEach(async ({ page }) => {
  await page.goto('/design.html')
})

test('question config shuffle', async ({ page }) => {
  await page.locator('.add-multi').click()
  await page.locator('.add-single').click()
  await page.locator('.add-ranking').click()

  await expect(page.locator('.q .q-shuffle').nth(0)).toBeVisible()
  await expect(page.locator('.q .q-shuffle').nth(1)).toBeVisible()
  await expect(page.locator('.q .q-shuffle').nth(2)).toBeVisible()
})

test('multi shuffle', async ({ page: designPage, context }) => {
  await designPage.locator('.add-multi').click()
  await designPage.locator('.q-shuffle').check()

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  async function checkShuffle(page) {
    for (let i = 0; i < 20; i++) {
      await previewPage.reload()
      const values = [
        await previewPage.locator('input[type="checkbox"]').nth(0).inputValue(),
        await previewPage.locator('input[type="checkbox"]').nth(1).inputValue(),
        await previewPage.locator('input[type="checkbox"]').nth(2).inputValue(),
      ]
      // console.log(values)
      if (!isDeepStrictEqual(values, ['0', '1', '2'])) {
        return true
      }
    }
  }

  expect(await checkShuffle(designPage)).toBeTruthy()
})

test('ranking shuffle', async ({ page: designPage, context }) => {
  await designPage.locator('.add-ranking').click()
  await designPage.locator('.q-shuffle').check()

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  async function checkShuffle(page) {
    for (let i = 0; i < 20; i++) {
      await previewPage.reload()
      const values = [
        await previewPage.locator('.option').nth(0).getAttribute('data-index'),
        await previewPage.locator('.option').nth(1).getAttribute('data-index'),
        await previewPage.locator('.option').nth(2).getAttribute('data-index'),
      ]
      // console.log(values)
      if (!isDeepStrictEqual(values, ['0', '1', '2'])) {
        return true
      }
    }
  }

  expect(await checkShuffle(designPage)).toBeTruthy()
})

test('single shuffle - select', async ({ page:designPage, context }) => {
  await designPage.locator('.add-single').click()
  await designPage.locator('.q-shuffle').check()

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  async function checkShuffle(page) {
    for (let i = 0; i < 20; i++) {
      await previewPage.reload()
      const values = [
        await previewPage.locator('input[type="radio"]').nth(0).inputValue(),
        await previewPage.locator('input[type="radio"]').nth(1).inputValue(),
        await previewPage.locator('input[type="radio"]').nth(2).inputValue(),
      ]
      // console.log(values)
      if (!isDeepStrictEqual(values, ['0', '1', '2'])) {
        return true
      }
    }
  }

  expect(await checkShuffle(designPage)).toBeTruthy()
})
