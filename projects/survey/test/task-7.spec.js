// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const { test, expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test('MultiSelectionQuestion file', async ({ page }) => {
  await expect(
    isExisted('common/MultiSelectionQuestion.js', path.join(__dirname, '../src'))
  ).toBeTruthy()
})

test('MultiSelectionQuestion design to preview', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-multi').click()
  await expect(designPage.locator('.q')).toHaveCount(1)
  const title = (await designPage.locator('.q-title').textContent()) ?? `${+new Date()}`
  await expect(designPage.locator('.option-text')).toHaveCount(3)
  await expect(designPage.locator('.q-body input[type="checkbox"]')).toHaveCount(3)
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

test('MultiSelectionQuestion preview submit', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-multi').click()
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

test('MultiSelectionQuestion edit design to preview', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-multi').click()
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
