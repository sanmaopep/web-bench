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

test.beforeEach(async ({ page }) => {
  await page.goto('/design.html')
})

test('multi change required', async ({ page: designPage }) => {
  await designPage.locator('.add-multi').click()
  await expect(designPage.locator('input[type="checkbox"]:required')).toHaveCount(0)

  await designPage.locator('.q-required').check()
  await expect(designPage.locator('input[type="checkbox"]:required')).toHaveCount(0)
})

test('multi validate', async ({ page: designPage, context }) => {
  await designPage.locator('.add-multi').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? `${+new Date()}`
  await designPage.locator('.q-required').check()

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(searchParams.getAll(name)).toEqual(['0', '2'])
  })
  previewPage.on('dialog', async (dialog) => {
    if (dialog.type() === 'alert') {
      await dialog.accept()
    }
  })
  await submit(previewPage)
  await expect(previewPage.locator('input[type="checkbox"]:invalid')).toHaveCount(0)
  await previewPage.locator('input[type="checkbox"]').nth(0).check()
  await previewPage.locator('input[type="checkbox"]').nth(2).check()
  await submit(previewPage)
})
