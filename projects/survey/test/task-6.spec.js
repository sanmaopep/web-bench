const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test('SingleSelectionQuestion file', async ({ page }) => {
  await expect(
    isExisted('common/SingleSelectionQuestion.js', path.join(__dirname, '../src'))
  ).toBeTruthy()
})

test('SingleSelectionQuestion design to preview', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-single').click()
  await expect(designPage.locator('.q')).toHaveCount(1)
  const title = (await designPage.locator('.q-title').textContent()) ?? `${+new Date()}`
  await expect(designPage.locator('.option-text')).toHaveCount(3)
  await expect(designPage.locator('input[type="radio"]')).toHaveCount(3)
  const options = [
    (await designPage.locator('.option-text').nth(0).textContent()) ?? '',
    (await designPage.locator('.option-text').nth(1).textContent()) ?? '',
    (await designPage.locator('.option-text').nth(2).textContent()) ?? '',
  ]

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await expect(previewPage.locator('.q')).toHaveCount(1)
  await expect(previewPage.locator('.q-title')).toHaveText(title)
  await expect(previewPage.locator('.option-text')).toHaveCount(3)
  await expect(previewPage.locator('.option-text').nth(0)).toHaveText(options[0])
  await expect(previewPage.locator('.option-text').nth(1)).toHaveText(options[1])
  await expect(previewPage.locator('.option-text').nth(2)).toHaveText(options[2])
})

test('SingleSelectionQuestion preview submit', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-single').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? `${+new Date()}`

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(searchParams.get(name)).toBe('2')
  })
  await previewPage.locator(`input[name="${name}"]`).nth(2).check()
  await submit(previewPage)
})

test('SingleSelectionQuestion edit design to preview', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-single').click()
  await expect(designPage.locator('.option-text')).toHaveCount(3)
  // remove option
  await designPage.locator('.option').nth(1).hover()
  await designPage.locator('.option').nth(1).locator('.remove-option').click()
  await expect(designPage.locator('.option-text')).toHaveCount(2)
  // add option
  await designPage.locator('.q .add-option').click()
  await expect(designPage.locator('.option-text')).toHaveCount(3)
  // edit option
  const option3 = designPage.locator('.option-text').nth(2)
  const optionText = `${+new Date()}`
  await option3.evaluate(
    (el, opts) => {
      // @ts-ignore
      el.click()
      el.innerHTML = opts.optionText
    },
    { optionText }
  )
  await expect(option3).toHaveText(optionText)

  const title = (await designPage.locator('.q-title').textContent()) ?? `${+new Date()}`
  const optionTexts = [
    (await designPage.locator('.option-text').nth(0).textContent()) ?? '',
    (await designPage.locator('.option-text').nth(1).textContent()) ?? '',
    (await designPage.locator('.option-text').nth(2).textContent()) ?? '',
  ]

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await expect(previewPage.locator('.q')).toHaveCount(1)
  await expect(previewPage.locator('.q-title')).toHaveText(title)
  await expect(previewPage.locator('.option-text')).toHaveCount(3)
  await expect(previewPage.locator('.option-text').nth(0)).toHaveText(optionTexts[0])
  await expect(previewPage.locator('.option-text').nth(1)).toHaveText(optionTexts[1])
  await expect(previewPage.locator('.option-text').nth(2)).toHaveText(optionTexts[2])
})
