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
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

test('RankingQuestion file', async ({ page }) => {
  const src = path.join(__dirname, '../src')
  await expect(isExisted('common/RankingQuestion.js', src)).toBeTruthy()
  await expect(isExisted('common/RankingQuestion.less', src)).toBeTruthy()
})

test('RankingQuestion design to preview', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-ranking').click()
  await expect(designPage.locator('.q')).toHaveCount(1)
  const title = (await designPage.locator('.q-title').textContent()) ?? `${+new Date()}`
  await expect(designPage.locator('.option')).toHaveCount(3)

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await expect(previewPage.locator('.q-title')).toHaveText(title)
  await expect(designPage.locator('.option')).toHaveCount(3)
})

test('RankingQuestion preview submit', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-ranking').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? `${+new Date()}`

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(searchParams.get(name)).toBe('1,0,2')
  })
  
  const item1 = previewPage.locator('.option').nth(0)
  const item2 = previewPage.locator('.option').nth(1)
  await item2.hover() // scroll to it
  await item1.hover()
  await previewPage.mouse.down()
  await item2.hover()
  await previewPage.mouse.up()
  await submit(previewPage)
})

test('RankingQuestion edit design to preview', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-ranking').click()
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
  await option3.click()
  await option3.fill(optionText)
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
