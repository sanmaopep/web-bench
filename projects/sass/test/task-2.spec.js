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
const fs = require('fs')

test('common/config.scss', async ({ page }) => {
  const src = process.env['EVAL_PROJECT_ROOT'] || path.join(__dirname, '../src')
  const configPath = path.join(src, 'common/config.scss')
  await expect(fs.existsSync(configPath)).toBeTruthy()
  const configScss = fs.readFileSync(configPath).toString()
  await expect(configScss.includes('$color')).toBeTruthy()
  await expect(configScss.includes('{')).toBeTruthy()
})

test('edit question title', async ({ page }) => {
  await page.goto('/design.html')
  await expect(page.locator('.add-question')).toBeVisible()
  await page.locator('.add-question').click()
  const title = page.locator('.q-title')
  await title.click()
  await expect(title).toHaveAttribute('contenteditable', 'true')
  const text = `${new Date().getTime()}`
  await title.fill(text)
  await expect(title).toHaveText(text)
})

test('question config', async ({ page }) => {
  await page.goto('/design.html')
  await expect(page.locator('.q-config')).toBeHidden()
  await page.locator('.add-question').click()
  await expect(page.locator('.q-config')).toBeVisible()
})

test('remove question', async ({ page }) => {
  await page.goto('/design.html')
  await page.locator('.add-question').click()
  await expect(page.locator('.q')).toHaveCount(1)
  await page.locator('.q-remove').click()
  await expect(page.locator('.q')).toHaveCount(0)
})
