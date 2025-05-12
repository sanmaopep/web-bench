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

test('common/OpenQuestion.js', async ({ page }) => {
  await expect(isExisted('common/OpenQuestion.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('single line controls', async ({ page }) => {
  await expect(page.locator('*[name="open1"]')).toHaveCount(1)
})

test('multi lines controls', async ({ page }) => {
  await expect(page.locator('textarea[name="open2"]')).toHaveCount(1)
})

test('submit empty content', async ({ page }) => {
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('open1')).toBe('')
    await expect(searchParams.get('open2')).toBe('')
  })

  await submit(page)
})

test('single line submit', async ({ page }) => {
  const line = new Date().getTime() + ''
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('open1')).toBe(line)
  })

  // input or textarea are ok
  await page.locator('*[name="open1"]').clear()
  await page.locator('*[name="open1"]').fill(line)
  await submit(page)
})

test('multi lines submit', async ({ page }) => {
  const lines = new Date().getTime() + '\n' + new Date().getTime()
  await interceptNetworkAndAbort(page, async (searchParams) => {
    await expect(searchParams.get('open2')?.replaceAll('\r\n', '\n')).toBe(lines)
  })

  await page.locator('textarea[name="open2"]').clear()
  await page.locator('textarea[name="open2"]').fill(lines)
  await submit(page)
})
