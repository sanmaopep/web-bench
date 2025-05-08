const { test, expect } = require('@playwright/test')
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test.beforeEach(async ({ page }) => {
  await page.goto('/design.html')
})

test('single change required', async ({ page: designPage, context }) => {
  await designPage.locator('.add-single').click()
  await expect(designPage.locator('input[type="radio"]:required')).toHaveCount(0)

  await designPage.locator('.q-required').check()
  await expect(designPage.locator('input[type="radio"]:required')).toHaveCount(3)
})

test('single validate', async ({ page: designPage, context }) => {
  await designPage.locator('.add-single').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? ''
  await designPage.locator('.q-required').check()

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(searchParams.get(name)).toBe('2')
  })
  await submit(previewPage)
  await expect(previewPage.locator('input[type="radio"]:invalid')).toHaveCount(3)
  await previewPage.locator('input[type="radio"]').nth(0).check()
  await previewPage.locator('input[type="radio"]').nth(2).check()
  await submit(previewPage)
})

test('likert change required', async ({ page: designPage }) => {
  await designPage.locator('.add-likert').click()
  await expect(designPage.locator('input[type="radio"]:required')).toHaveCount(0)
  await designPage.locator('.q-required').check()
  await expect(designPage.locator('input[type="radio"]:required')).toHaveCount(15)
})

test('likert1 validate', async ({ page: designPage, context }) => {
  await designPage.locator('.add-likert').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? ''
  await designPage.locator('.q-required').check()

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(searchParams.get(`${name}_0`)).toBe('0')
    await expect(searchParams.get(`${name}_1`)).toBe('2')
    await expect(searchParams.get(`${name}_2`)).toBe('4')
  })

  await submit(previewPage)
  await expect(previewPage.locator('input[type="radio"]:invalid')).toHaveCount(15)

  await previewPage.locator(`*[name="${name}_0"]`).nth(0).check()
  await previewPage.locator(`*[name="${name}_1"]`).nth(2).check()
  await previewPage.locator(`*[name="${name}_2"]`).nth(4).check()
  await submit(previewPage)
  await expect(previewPage.locator('input[type="radio"]:invalid')).toHaveCount(0)
})

test('nps change required', async ({ page:designPage }) => {
  await designPage.locator('.add-nps').click()
  await expect(designPage.locator('input[type="radio"]:required')).toHaveCount(0)

  await designPage.locator('.q-required').check()
  await expect(designPage.locator('input[type="radio"]:required')).toHaveCount(11)
})

test('nps validate', async ({ page: designPage, context }) => {
  await designPage.locator('.add-nps').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? ''
  await designPage.locator('.q-required').check()

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(searchParams.get(name)).toBe('10')
  })
  await submit(previewPage)
  await expect(previewPage.locator('input[type="radio"]:invalid')).toHaveCount(11)

  await previewPage.locator('.option').first().check()
  await previewPage.locator('.option').last().check()
  await submit(previewPage)
  await expect(previewPage.locator('input[type="radio"]:invalid')).toHaveCount(0)
})

test('rating change required', async ({ page: designPage }) => {
  await designPage.locator('.add-rating').click()
  await expect(designPage.locator('input[type="radio"]:required')).toHaveCount(0)

  await designPage.locator('.q-required').check()
  await expect(designPage.locator('input[type="radio"]:required')).toHaveCount(5)
})

test('rating validate', async ({ page: designPage, context }) => {
  await designPage.locator('.add-rating').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? ''
  await designPage.locator('.q-required').check()

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(searchParams.get(name)).toBe('1')
  })
  await submit(previewPage)
  await expect(previewPage.locator('input[type="radio"]:invalid')).toHaveCount(5)

  await previewPage.locator('.option').first().click()
  await previewPage.locator('.option').last().click()
  await submit(previewPage)
  await expect(previewPage.locator('input[type="radio"]:invalid')).toHaveCount(0)
})
