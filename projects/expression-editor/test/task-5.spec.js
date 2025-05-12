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
const { setTimeout } = require('timers/promises')

test.beforeEach(async ({ page }) => {
  await page.goto(`/index.html`)
})

test('Insert Snippet in toolbar', async ({ page }) => {
  await page.locator('#editor').click()
  await page.getByText("Insert Snippet").click()
  expect(await page.locator('#editor').textContent()).toMatch(/true\s+OR\s+false/)
  await page.locator('#editor').press('ArrowRight')
  await page.locator('#editor').press('Shift' + '+ArrowLeft'.repeat(5))
  await page.getByText('Insert Snippet').click()
  expect(await page.locator('#editor').textContent()).toMatch(/true\s+OR\s+true\s+OR\s+false/)
})