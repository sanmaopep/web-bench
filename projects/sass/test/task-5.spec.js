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

test('SurveyPreview files', async ({ page }) => {
  await expect(isExisted('common/SurveyPreview.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/SurveyPreview.scss', path.join(__dirname, '../src'))).toBeTruthy()
})

test('preview 0 question', async ({ page }) => {
  await page.goto('/preview.html')
  await expect(page.locator('fieldset.q')).toHaveCount(0)
})

test('preview questions', async ({ page, context }) => {
  await page.goto('/design.html')
  await page.locator('.add-question').click()
  await page.locator('.add-question').click()

  const previewPagePromise = context.waitForEvent('page')
  await page.locator('.preview').click()

  const previewPage = await previewPagePromise
  await expect(previewPage.locator('fieldset.q')).toHaveCount(2)
})

test('preview question, readonly title, no config', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-question').click()
  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await expect(previewPage.locator('.q-config')).toBeHidden()
  const title = previewPage.locator('.q-title')
  await expect(title).not.toHaveAttribute('contenteditable', 'true')
  await title.click({ force: true })
  await expect(title).not.toHaveAttribute('contenteditable', 'true')
})
