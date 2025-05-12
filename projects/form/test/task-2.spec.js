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

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('common/SingleSelectionQuestion.js', async ({ page }) => {
  await expect(
    isExisted('common/SingleSelectionQuestion.js', path.join(__dirname, '../src'))
  ).toBeTruthy()
})

test('single1 controls', async ({ page }) => {
  await expect(page.locator('input[type="radio"][name="single1"]')).toHaveCount(3)
  await expect(page.locator('input[type="radio"][name="single1"]').nth(2)).toBeVisible()
})

test('single1 submit', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('single1')).toBe('2')
  })

  await page.locator('input[name="single1"]').nth(2).check()
  await submit(page)
})

test('single1 submit 2', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('single1')).toBe('0')
  })

  await page.locator('input[name="single1"]').nth(2).check()
  await page.locator('input[name="single1"]').nth(1).check()
  await page.locator('input[name="single1"]').nth(0).check()
  await submit(page)
})
