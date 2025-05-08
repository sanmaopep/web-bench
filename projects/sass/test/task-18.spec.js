const { test, expect } = require('@playwright/test')
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test.beforeEach(async ({ page }) => {
  await page.goto('/design.html')
})

test('common/DataQuestion.js', async ({ page }) => {
  await expect(isExisted('common/DataQuestion.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/DataQuestion.scss', path.join(__dirname, '../src'))).toBeTruthy()
})

test('data-url change required', async ({ page: designPage }) => {
  const type = 'url'
  await designPage.locator('.add-data').click()
  await designPage.locator('.q-type').selectOption({ value: type })
  await expect(designPage.locator(`input[type="${type}"]:required`)).toHaveCount(0)
  await designPage.locator('.q-required').check()
  await expect(designPage.locator(`input[type="${type}"]:required`)).toHaveCount(1)
})

test('data-url validate', async ({ page: designPage, context }) => {
  const type = 'url'
  const validContent = 'http://test.com'
  const invalidContent = 'test.com'
  await designPage.locator('.add-data').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? `${+new Date()}`
  await designPage.locator('.q-type').selectOption({ value: type })
  await designPage.locator('.q-required').check()

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(searchParams.get(name)).toEqual(validContent)
  })

  // empty
  await submit(previewPage)
  await expect(previewPage.locator(`input[type="${type}"]:invalid`)).toHaveCount(1)

  await previewPage.locator(`input[type="${type}"]`).fill(invalidContent)
  await submit(previewPage)
  await expect(previewPage.locator(`input[type="${type}"]:invalid`)).toHaveCount(1)

  await previewPage.locator(`input[type="${type}"]`).fill(validContent)
  await submit(previewPage)
  await expect(previewPage.locator(`input[type="${type}"]:invalid`)).toHaveCount(0)
})

test('data-tel change required', async ({ page: designPage }) => {
  const type = 'tel'
  await designPage.locator('.add-data').click()
  await designPage.locator('.q-type').selectOption({ value: type })
  await expect(designPage.locator(`input[type="${type}"]:required`)).toHaveCount(0)
  await designPage.locator('.q-required').check()
  await expect(designPage.locator(`input[type="${type}"]:required`)).toHaveCount(1)
})

test('data-tel validate', async ({ page: designPage, context }) => {
  const type = 'tel'
  const validContent = '12345678901'
  const invalidContent = 'abc'
  await designPage.locator('.add-data').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? `${+new Date()}`
  await designPage.locator('.q-type').selectOption({ value: type })
  await designPage.locator('.q-required').check()

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(searchParams.get(name)).toEqual(validContent)
  })

  // empty
  await submit(previewPage)
  await expect(previewPage.locator(`input[type="${type}"]:invalid`)).toHaveCount(1)

  // await previewPage.locator(`input[type="${type}"]`).fill(invalidContent)
  // await submit(previewPage)
  // await expect(previewPage.locator(`input[type="${type}"]:invalid`)).toHaveCount(1)

  await previewPage.locator(`input[type="${type}"]`).fill(validContent)
  await submit(previewPage)
  await expect(previewPage.locator(`input[type="${type}"]:invalid`)).toHaveCount(0)
})

test('data-email change required', async ({ page: designPage }) => {
  const type = 'email'
  await designPage.locator('.add-data').click()
  await designPage.locator('.q-type').selectOption({ value: type })
  await expect(designPage.locator(`input[type="${type}"]:required`)).toHaveCount(0)
  await designPage.locator('.q-required').check()
  await expect(designPage.locator(`input[type="${type}"]:required`)).toHaveCount(1)
})

test('data-email validate', async ({ page: designPage, context }) => {
  const type = 'email'
  const validContent = 'abc@test.com'
  const invalidContent = 'test.com'
  await designPage.locator('.add-data').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? `${+new Date()}`
  await designPage.locator('.q-type').selectOption({ value: type })
  await designPage.locator('.q-required').check()

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(searchParams.get(name)).toEqual(validContent)
  })

  // empty
  await submit(previewPage)
  await expect(previewPage.locator(`input[type="${type}"]:invalid`)).toHaveCount(1)

  await previewPage.locator(`input[type="${type}"]`).fill(invalidContent)
  await submit(previewPage)
  await expect(previewPage.locator(`input[type="${type}"]:invalid`)).toHaveCount(1)

  await previewPage.locator(`input[type="${type}"]`).fill(validContent)
  await submit(previewPage)
  await expect(previewPage.locator(`input[type="${type}"]:invalid`)).toHaveCount(0)
})

test('data-date change required', async ({ page: designPage }) => {
  const type = 'date'
  await designPage.locator('.add-data').click()
  await designPage.locator('.q-type').selectOption({ value: type })
  await expect(designPage.locator(`input[type="${type}"]:required`)).toHaveCount(0)
  await designPage.locator('.q-required').check()
  await expect(designPage.locator(`input[type="${type}"]:required`)).toHaveCount(1)
})

test('data-date validate', async ({ page: designPage, context }) => {
  const type = 'date'
  const validContent = '2025-01-01'
  const invalidContent = 'abc'
  await designPage.locator('.add-data').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? `${+new Date()}`
  await designPage.locator('.q-type').selectOption({ value: type })
  await designPage.locator('.q-required').check()

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(searchParams.get(name)).toEqual(validContent)
  })

  // empty
  await submit(previewPage)
  await expect(previewPage.locator(`input[type="${type}"]:invalid`)).toHaveCount(1)

  await expect(previewPage.locator(`input[type="${type}"]`).fill(invalidContent)).rejects.toThrow(
    /malformed/i
  )
  await submit(previewPage)
  await expect(previewPage.locator(`input[type="${type}"]:invalid`)).toHaveCount(1)

  await previewPage.locator(`input[type="${type}"]`).fill(validContent)
  await submit(previewPage)
  await expect(previewPage.locator(`input[type="${type}"]:invalid`)).toHaveCount(0)
})

test('data-number change required', async ({ page: designPage }) => {
  const type = 'number'
  await designPage.locator('.add-data').click()
  await designPage.locator('.q-type').selectOption({ value: type })
  await expect(designPage.locator(`input[type="${type}"]:required`)).toHaveCount(0)
  await designPage.locator('.q-required').check()
  await expect(designPage.locator(`input[type="${type}"]:required`)).toHaveCount(1)
})

test('data-number validate', async ({ page: designPage, context }) => {
  const type = 'number'
  const validContent = '123'
  const invalidContent = 'abc'
  await designPage.locator('.add-data').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? `${+new Date()}`
  await designPage.locator('.q-type').selectOption({ value: type })
  await designPage.locator('.q-required').check()

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(searchParams.get(name)).toEqual(validContent)
  })

  // empty
  await submit(previewPage)
  await expect(previewPage.locator(`input[type="${type}"]:invalid`)).toHaveCount(1)

  await expect(previewPage.locator(`input[type="${type}"]`).fill(invalidContent)).rejects.toThrow()
  await submit(previewPage)
  await expect(previewPage.locator(`input[type="${type}"]:invalid`)).toHaveCount(1)

  await previewPage.locator(`input[type="${type}"]`).fill(validContent)
  await submit(previewPage)
  await expect(previewPage.locator(`input[type="${type}"]:invalid`)).toHaveCount(0)
})
