const { test, expect } = require('@playwright/test')
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test.beforeEach(async ({ page }) => {
  await page.goto('/design.html')
  await page.locator('.add-likert').click()
  await page.locator('.add-likert').click()
})

test('common/Contents.js', async ({ page }) => {
  await expect(isExisted('common/Contents.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/Contents.scss', path.join(__dirname, '../src'))).toBeTruthy()
})

test('.contents add question', async ({ page }) => {
  await expect(page.locator('.contents')).toBeVisible()
  await expect(page.locator('.contents-item')).toHaveCount(2)
  await page.locator('.add-question').click()
  await expect(page.locator('.contents-item')).toHaveCount(3)
})

test('.contents change question title', async ({ page }) => {
  await expect(page.locator('.contents')).toBeVisible()
  await expect(page.locator('.contents-item')).toHaveCount(2)
  const text = `${+new Date()}`
  const title = page.locator('.q-title').nth(1)
  await title.click()
  await title.clear()
  await title.focus()
  await page.keyboard.type(text)
  await title.blur()
  await expect(page.locator('.contents-item').nth(1)).toHaveText(text)
})

test('click .contents-item', async ({ page }) => {
  await page.locator('.add-likert').click()
  await page.locator('.add-likert').click()
  await page.locator('.add-likert').click()
  await page.locator('.add-likert').click()

  await page.locator('.contents-item').nth(0).click()
  await expect(page.locator('.q').nth(0)).toBeInViewport({timeout: 2_000})

  await page.locator('.contents-item').nth(5).click()
  await expect(page.locator('.q').nth(5)).toBeInViewport({timeout: 2_000})
})

test('drag and check .contents-item 1 & 2', async ({ page }) => {
  const item0 = page.locator('.contents-item').nth(0)
  const item1 = page.locator('.contents-item').nth(1)
  const text0 = (await item0.textContent())?.replace(/^\d+\./, '') ?? `${+new Date()}`
  const text1 = (await item1.textContent())?.replace(/^\d+\./, '') ?? `${+new Date()}`

  await item0.hover() // scroll to it
  await page.mouse.down()
  await item1.hover()
  await page.mouse.up()

  await expect(item0).toContainText(text1)
  await expect(item1).toContainText(text0)
})

test('drag .contents-item 1 & 2, and check .q', async ({ page }) => {
  const item0 = page.locator('.contents-item').nth(0)
  const item1 = page.locator('.contents-item').nth(1)
  const q0 = page.locator('.q-title').nth(0)
  const q1 = page.locator('.q-title').nth(1)
  const text0 = (await q0.textContent())?.replace(/^\d+\./, '') ?? `${+new Date()}`
  const text1 = (await q1.textContent())?.replace(/^\d+\./, '') ?? `${+new Date()}`

  await item0.hover() // scroll to it
  await page.mouse.down()
  await item1.hover()
  await page.mouse.up()

  await expect(q1).toContainText(text0)
  await expect(q0).toContainText(text1)
})

test('drag .contents-item 1 & 2, design to preview', async ({ page: designPage, context }) => {
  const item0 = designPage.locator('.contents-item').nth(0)
  const item1 = designPage.locator('.contents-item').nth(1)
  const q0 = designPage.locator('.q-title').nth(0)
  const q1 = designPage.locator('.q-title').nth(1)
  const text0 = (await q0.textContent())?.replace(/^\d+\./, '') ?? `${+new Date()}`
  const text1 = (await q1.textContent())?.replace(/^\d+\./, '') ?? `${+new Date()}`

  await item0.hover() // scroll to it
  await designPage.mouse.down()
  await item1.hover()
  await designPage.mouse.up()

  await expect(q1).toContainText(text0)
  await expect(q0).toContainText(text1)

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise
  await expect(previewPage.locator('.q-title').nth(0)).toContainText(text1)
  await expect(previewPage.locator('.q-title').nth(1)).toContainText(text0)
  await expect(previewPage.locator('.contents-item').nth(0)).toContainText(text1)
  await expect(previewPage.locator('.contents-item').nth(1)).toContainText(text0)
})

test('drag .contents-item 1 & 6, and check .q', async ({ page }) => {
  await page.locator('.add-likert').click()
  await page.locator('.add-likert').click()
  await page.locator('.add-likert').click()
  await page.locator('.add-likert').click()

  const item0 = page.locator('.contents-item').nth(0)
  const item1 = page.locator('.contents-item').nth(1)
  const item5 = page.locator('.contents-item').nth(5)
  const text0 = (await item0.textContent())?.replace(/^\d+\./, '') ?? `${+new Date()}`
  const text5 = (await item5.textContent())?.replace(/^\d+\./, '') ?? `${+new Date()}`
  const q0 = page.locator('.q-title').nth(0)
  const q1 = page.locator('.q-title').nth(1)
  const q5 = page.locator('.q-title').nth(5)
  const qtext0 = (await q0.textContent())?.replace(/^\d+\./, '') ?? `${+new Date()}`
  const qtext5 = (await q5.textContent())?.replace(/^\d+\./, '') ?? `${+new Date()}`

  await item5.hover() // scroll to it
  await page.mouse.down()
  await item0.hover()
  await page.mouse.up()

  await expect(item0).toContainText(text0)
  await expect(item1).toContainText(text5)
  await expect(q0).toContainText(qtext0)
  await expect(q1).toContainText(qtext5)
})
