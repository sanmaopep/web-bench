const { test, expect } = require('@playwright/test')
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test('NpsQuestion file', async ({ page }) => {
  await expect(isExisted('common/NpsQuestion.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/NpsQuestion.scss', path.join(__dirname, '../src'))).toBeTruthy()
})

test('NpsQuestion design to preview', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-nps').click()
  await expect(designPage.locator('.q')).toHaveCount(1)
  const title = (await designPage.locator('.q-title').textContent()) ?? `${+new Date()}`
  await expect(designPage.locator('.option')).toHaveCount(11)

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await expect(previewPage.locator('.q-title')).toHaveText(title)
  await expect(previewPage.locator('.option')).toHaveCount(11)
})

test('NpsQuestion preview submit', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-nps').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? `${+new Date()}`

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(searchParams.get(name)).toBe('10')
  })
  await previewPage.locator('.option').nth(0).click()
  await previewPage.locator('.option').nth(10).click()
  await submit(previewPage)
})
