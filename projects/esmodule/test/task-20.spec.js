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

import { expect, test } from '@playwright/test'
import { isExisted } from '@web-bench/test-util'
import path from 'path'

const srcPath = path.join(import.meta.dirname, '../src')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('data/*.json', async ({ page }) => {
  await expect(isExisted('modules/data/zh.json', srcPath)).toBeTruthy()
  await expect(isExisted('modules/data/fr.json', srcPath)).toBeTruthy()
  await expect(isExisted('modules/data/en.json', srcPath)).toBeTruthy()
})

test('import all data', async ({ page }) => {
  const data = JSON.parse((await page.locator('#data').textContent()) ?? '{}')
  await expect(data).toEqual({ en: 1, fr: 1, zh: 1 })
})
