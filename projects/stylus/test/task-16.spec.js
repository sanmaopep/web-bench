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

test('open change required', async ({ page: designPage, context }) => {
  await designPage.locator('.add-open').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? `${+new Date()}`
  await expect(designPage.locator(`*[name="${name}"]:required`)).toHaveCount(0)

  await designPage.locator('.q-required').check()
  await expect(designPage.locator(`*[name="${name}"]:required`)).toHaveCount(1)
})

test('open change minLength', async ({ page: designPage, context }) => {
  await designPage.locator('.add-open').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? ``
  await expect(designPage.locator(`*[name="${name}"]`)).not.toHaveAttribute('minLength', '5')

  await designPage.locator('.q-minLength').fill('5')
  await designPage.locator('.q-minLength').blur()
  await expect(designPage.locator(`*[name="${name}"]`)).toHaveAttribute('minLength', '5')
})

test('open validate', async ({ page: designPage, context }) => {
  await designPage.locator('.add-open').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? ''
  await designPage.locator('.q-required').check()
  await designPage.locator('.q-minLength').fill('5')
  await designPage.locator('.q-minLength').blur()

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(searchParams.get(name)).toBe('12345')
  })
  await submit(previewPage)
  await expect(previewPage.locator(`*[name="${name}"]:invalid`)).toHaveCount(1)
  await previewPage.locator(`*[name="${name}"]`).fill('12345')
  await submit(previewPage)
})
