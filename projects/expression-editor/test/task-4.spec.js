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

test.beforeEach(async ({ page }) => {
  await page.goto(`/index.html`)
})

test('Uppercase in toolbar', async ({ page }) => {
  const editor = page.locator('#editor')
  
  await editor.pressSequentially('foo', { delay: 10 })

  expect(await page.getByText('foo', { exact: true }).count()).toBeGreaterThanOrEqual(1)

  await page.keyboard.press('Shift+ArrowLeft+ArrowLeft+ArrowLeft')

  await page.getByText('Uppercase').click()

  await expect(page.getByText('foo', { exact: true })).not.toBeVisible()
  expect(await page.getByText('FOO', { exact: true }).count()).toBeGreaterThanOrEqual(1)
})