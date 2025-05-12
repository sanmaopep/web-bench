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

test('LikertQuestion file', async ({ page }) => {
  await expect(isExisted('common/LikertQuestion.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('LikertQuestion design to preview', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-likert').click()
  await expect(designPage.locator('.q')).toHaveCount(1)
  const title = (await designPage.locator('.q-title').textContent()) ?? `${+new Date()}`
  await expect(designPage.locator('.statement-text')).toHaveCount(3)
  await expect(designPage.locator('.option-text')).toHaveCount(5)
  await expect(designPage.locator('input[type="radio"]')).toHaveCount(15)
  const statements = [
    (await designPage.locator('.statement-text').nth(0).textContent()) ?? '',
    (await designPage.locator('.statement-text').nth(1).textContent()) ?? '',
    (await designPage.locator('.statement-text').nth(2).textContent()) ?? '',
  ]
  const options = [
    (await designPage.locator('.option-text').nth(0).textContent()) ?? '',
    (await designPage.locator('.option-text').nth(1).textContent()) ?? '',
    (await designPage.locator('.option-text').nth(2).textContent()) ?? '',
    (await designPage.locator('.option-text').nth(3).textContent()) ?? '',
    (await designPage.locator('.option-text').nth(4).textContent()) ?? '',
  ]

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await expect(previewPage.locator('.q')).toHaveCount(1)
  await expect(previewPage.locator('.q-title')).toHaveText(title)
  await expect(previewPage.locator('.statement-text')).toHaveCount(3)
  await expect(previewPage.locator('.statement-text').nth(0)).toHaveText(statements[0])
  await expect(previewPage.locator('.statement-text').nth(1)).toHaveText(statements[1])
  await expect(previewPage.locator('.statement-text').nth(2)).toHaveText(statements[2])
  await expect(previewPage.locator('.option-text')).toHaveCount(5)
  await expect(previewPage.locator('.option-text').nth(0)).toHaveText(options[0])
  await expect(previewPage.locator('.option-text').nth(1)).toHaveText(options[1])
  await expect(previewPage.locator('.option-text').nth(2)).toHaveText(options[2])
  await expect(previewPage.locator('.option-text').nth(3)).toHaveText(options[3])
  await expect(previewPage.locator('.option-text').nth(4)).toHaveText(options[4])
})

test('LikertQuestion preview submit', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-likert').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? `${+new Date()}`

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(searchParams.get(`${name}_0`)).toEqual('0')
    await expect(searchParams.get(`${name}_1`)).toEqual('1')
    await expect(searchParams.get(`${name}_2`)).toEqual('2')
  })
  await previewPage.locator(`input[name="${name}_0"]`).nth(0).check()
  await previewPage.locator(`input[name="${name}_1"]`).nth(1).check()
  await previewPage.locator(`input[name="${name}_2"]`).nth(2).check()
  await submit(previewPage)
})
