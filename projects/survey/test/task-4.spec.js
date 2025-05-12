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

test.beforeEach(async ({ page }) => {
  await page.goto('/design.html')
})

test('design save 0 quesiton', async ({ page }) => {
  await page.locator('.save').click()
  const data = JSON.parse(await page.evaluate(() => localStorage.data))

  await expect(data.title).toBeDefined()
  await expect(Array.isArray(data.questions)).toBeTruthy()
  await expect(data.questions.length).toBe(0)
})

test('design save questions', async ({ page }) => {
  await page.locator('.add-question').click()
  await page.locator('.add-question').click()
  await page.locator('.save').click()
  const data = JSON.parse(await page.evaluate(() => localStorage.data))

  await expect(data.title).toBeDefined()
  await expect(data.questions.length).toBe(2)
  await expect(data.questions[0].title).toBeDefined()
  await expect(data.questions[0].name).toBeDefined()
})

test('design preview', async ({ page, context }) => {
  await page.locator('.add-question').click()
  const pagePromise = context.waitForEvent('page')
  await page.locator('.preview').click()
  const newPage = await pagePromise
  // console.log(newPage.url())
  await expect(newPage.url()).toContain('preview')
})
