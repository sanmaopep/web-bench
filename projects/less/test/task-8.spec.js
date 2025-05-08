const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test('OpenQuestion file', async ({ page }) => {
  await expect(isExisted('common/OpenQuestion.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/OpenQuestion.less', path.join(__dirname, '../src'))).toBeTruthy()
})

test('OpenQuestion design to preview', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-open').click()
  await expect(designPage.locator('.q')).toHaveCount(1)
  const name = (await designPage.locator('.q').getAttribute('id')) ?? `${+new Date()}`
  const title = (await designPage.locator('.q-title').textContent()) ?? `${+new Date()}`
  await expect(designPage.locator(`.q *[name="${name}"]`)).toBeVisible()

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await expect(previewPage.locator('.q')).toHaveCount(1)
  await expect(previewPage.locator('.q-title')).toHaveText(title)
  await expect(previewPage.locator(`*[name="${name}"]`)).toBeVisible()
})

test('OpenQuestion preview submit', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-open').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? `${+new Date()}`

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  const text = `${+new Date()}`
  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(searchParams.get(name)).toBe(text)
  })
  await previewPage.locator(`*[name="${name}"]`).fill(text)
  await submit(previewPage)
})

test('OpenQuestion singleline design to preview', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-open').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? `${+new Date()}`

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  const text = `${+new Date()}`
  const inputControl = previewPage.locator(`*[name="${name}"]`)
  await inputControl.fill(text)
  await inputControl.focus()
  await previewPage.keyboard.type('\n')
  await previewPage.keyboard.type(text)
  await expect(inputControl).toHaveValue(`${text}${text}`) // NO '\n'

  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    // NO '\n'
    await expect(searchParams.get(name)?.replaceAll('\r\n', '\n')).toBe(`${text}${text}`)
  })
  await submit(previewPage)
})

test('OpenQuestion multilines design to preview', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-open').click()
  await designPage.locator('.q-multilines').check()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? `${+new Date()}`

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  const text = `${+new Date()}`
  const inputControl = previewPage.locator(`*[name="${name}"]`)
  await inputControl.fill(text)
  await inputControl.focus()
  await previewPage.keyboard.type('\n')
  await previewPage.keyboard.type(text)
  await expect(inputControl).toHaveValue(`${text}\n${text}`)

  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(searchParams.get(name)?.replaceAll('\r\n', '\n')).toBe(`${text}\n${text}`)
  })
  await submit(previewPage)
})
