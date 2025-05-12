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
  await page.goto('/index.html')
})

test('common/LikertQuestion.js', async ({ page }) => {
  await expect(isExisted('common/LikertQuestion.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('likert1', async ({ page }) => {
  await expect(page.locator('#likert1 *[name="likert1_0"]')).toHaveCount(5)
  await expect(page.locator('#likert1 *[name="likert1_1"]')).toHaveCount(5)
  await expect(page.locator('#likert1 *[name="likert1_2"]')).toHaveCount(5)
})

test('likert1 submit all', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('likert1_0')).toBe('0')
    await expect(searchParams.get('likert1_1')).toBe('2')
    await expect(searchParams.get('likert1_2')).toBe('4')
  })

  await page.locator('#likert1 *[name="likert1_0"]').nth(0).check()
  await page.locator('#likert1 *[name="likert1_1"]').nth(2).check()
  await page.locator('#likert1 *[name="likert1_2"]').nth(4).check()

  await submit(page)
})

test('likert1 submit all 2', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('likert1_0')).toBe('3')
    await expect(searchParams.get('likert1_1')).toBe('1')
    await expect(searchParams.get('likert1_2')).toBe('1')
  })

  await page.locator('#likert1 *[name="likert1_0"]').nth(0).check()
  await page.locator('#likert1 *[name="likert1_0"]').nth(3).check()
  await page.locator('#likert1 *[name="likert1_1"]').nth(2).check()
  await page.locator('#likert1 *[name="likert1_1"]').nth(1).check()
  await page.locator('#likert1 *[name="likert1_2"]').nth(4).check()
  await page.locator('#likert1 *[name="likert1_2"]').nth(1).check()

  await submit(page)
})
