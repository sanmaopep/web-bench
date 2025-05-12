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

// test.beforeEach(async ({ page }) => {
// await page.goto('/index.html')
// })

test('initial files', async ({ page }) => {
  await expect(isExisted('design.html', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('design.css', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('design.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('preview.html', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('preview.css', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('preview.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('design page', async ({ page }) => {
  await page.goto('/design.html')
  await expect(page.locator('body')).toBeAttached()
  await expect(page.locator('form')).toBeAttached()
})

test('preview page', async ({ page }) => {
  await page.goto('/preview.html')
  await expect(page.locator('body')).toBeAttached()
  await expect(page.locator('form')).toBeAttached()
  await expect(page.locator('form')).toHaveAttribute('action', 'submit')
  await expect(page.locator('form button[type="submit"]')).toBeVisible()
})
