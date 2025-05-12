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

test('common/Question.js', async ({ page }) => {
  await expect(isExisted('common/Question.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/Question.styl', path.join(__dirname, '../src'))).toBeTruthy()
})

test('add question', async ({ page }) => {
  await expect(page.locator('.add-question')).toBeVisible()
  await page.locator('.add-question').click()
  await expect(page.locator('fieldset.q')).toHaveCount(1)
  await expect(page.locator('fieldset.q legend.q-title')).toBeVisible()
  await expect(page.locator('fieldset.q legend.q-title + .q-body')).toBeAttached()
})

test('add questions', async ({ page }) => {
  await expect(page.locator('.add-question')).toBeVisible()
  await page.locator('.add-question').click()
  await page.locator('.add-question').click()
  await expect(page.locator('.q')).toHaveCount(2)
})
