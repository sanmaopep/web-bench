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

test('RatingQuestion file', async ({ page }) => {
  await expect(isExisted('common/RatingQuestion.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('RatingQuestion design to preview', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-rating').click()
  await expect(designPage.locator('.q')).toHaveCount(1)
  const title = (await designPage.locator('.q-title').textContent()) ?? `${+new Date()}`
  await expect(designPage.locator('.option')).toHaveCount(5)

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await expect(previewPage.locator('.q-title')).toHaveText(title)
  await expect(designPage.locator('.option')).toHaveCount(5)
})

test('RatingQuestion preview submit', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-rating').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? `${+new Date()}`

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(parseFloat(searchParams.get(name) ?? '0')).toBeCloseTo(0.6)
  })
  await previewPage.locator(`.option`).nth(4).click()
  await previewPage.locator(`.option`).nth(2).click()
  await submit(previewPage)
})

test('RatingQuestion edit design to preview', async ({ page: designPage, context }) => {
  await designPage.goto('/design.html')
  await designPage.locator('.add-rating').click()
  const name = (await designPage.locator('.q').getAttribute('id')) ?? `${+new Date()}`
  // edit option
  await expect(designPage.locator('.option')).toHaveCount(5)
  await expect(designPage.locator('.q-starCount')).toHaveValue('5')
  await designPage.locator('.q-starCount').fill('10')
  await designPage.locator('.q-starCount').blur()
  await expect(designPage.locator('.option')).toHaveCount(10)

  const previewPagePromise = context.waitForEvent('page')
  await designPage.locator('.preview').click()
  const previewPage = await previewPagePromise

  await expect(designPage.locator('.option')).toHaveCount(10)
  await interceptNetworkAndAbort(previewPage, async (searchParams) => {
    await expect(parseFloat(searchParams.get(name) ?? '0')).toBeCloseTo(1)
  })
  await previewPage.locator(`.option`).nth(2).click()
  await previewPage.locator(`.option`).nth(9).click()
  await submit(previewPage)
})
