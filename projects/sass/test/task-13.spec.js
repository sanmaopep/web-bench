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

test('LikertQuestion edit statements, design to preview', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-likert').click()
  await expect(designPage.locator('.statement-text')).toHaveCount(3)
  // remove statement
  await designPage.locator('.statement').nth(1).hover()
  await designPage.locator('.statement').nth(1).locator('.remove-statement').click()
  await expect(designPage.locator('.statement-text')).toHaveCount(2)
  // add statement
  await designPage.locator('.add-statement').click()
  await expect(designPage.locator('.statement-text')).toHaveCount(3)
  // edit statement
  const statement3 = designPage.locator('.statement-text').nth(2)
  const statementText = `${+new Date()}`
  await statement3.click()
  await statement3.fill(statementText)
  await expect(statement3).toHaveText(statementText)
  const statementTexts = [
    (await designPage.locator('.statement-text').nth(0).textContent()) ?? '',
    (await designPage.locator('.statement-text').nth(1).textContent()) ?? '',
    (await designPage.locator('.statement-text').nth(2).textContent()) ?? '',
  ]

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await expect(previewPage.locator('.statement-text')).toHaveCount(3)
  await expect(previewPage.locator('.statement-text').nth(0)).toHaveText(statementTexts[0])
  await expect(previewPage.locator('.statement-text').nth(1)).toHaveText(statementTexts[1])
  await expect(previewPage.locator('.statement-text').nth(2)).toHaveText(statementTexts[2])
})

test('LikertQuestion edit options, design to preview', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-likert').click()
  await expect(designPage.locator('.option-text')).toHaveCount(5)
  // remove option
  await designPage.locator('.option').nth(1).hover()
  await designPage.locator('.option').nth(1).locator('.remove-option').click()
  await expect(designPage.locator('.option-text')).toHaveCount(4)
  // add option
  await designPage.locator('.option').nth(1).hover()
  await designPage.locator('.option').nth(1).locator('.add-option').click()
  await expect(designPage.locator('.option-text')).toHaveCount(5)
  // edit option
  const option3 = designPage.locator('.option-text').nth(2)
  const optionText = `${+new Date()}`
  await option3.click()
  await option3.fill(optionText)
  await expect(option3).toHaveText(optionText)
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

  await expect(previewPage.locator('.option-text')).toHaveCount(5)
  await expect(previewPage.locator('.option-text').nth(0)).toHaveText(options[0])
  await expect(previewPage.locator('.option-text').nth(1)).toHaveText(options[1])
  await expect(previewPage.locator('.option-text').nth(2)).toHaveText(options[2])
  await expect(previewPage.locator('.option-text').nth(3)).toHaveText(options[3])
  await expect(previewPage.locator('.option-text').nth(4)).toHaveText(options[4])
})
