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

import { test, expect } from '@playwright/test'
import { isExisted, getViewport } from '@web-bench/test-util'
import path from 'path'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('files', async ({ page }) => {
  const __dirname = import.meta.dirname
  await expect(isExisted('index.html', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('index.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('index.scss', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('assets/data.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('assets/res.svg', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/config.scss', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/Chart.scss', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/Chart.js', path.join(__dirname, '../src'))).toBeTruthy()
  await expect(isExisted('common/LineChart.js', path.join(__dirname, '../src'))).toBeTruthy()
})

test('body', async ({ page }) => {
  await expect(page.locator('body')).toBeAttached()
})

test('root', async ({ page }) => {
  await expect(page.locator('.root')).toBeAttached()
})

// test('viewport', async ({ page }) => {
//   const viewport = await getViewport(page)
//   // await expect(viewport).toEqual({ width: 1280, height: 1280 })
//   await expect(viewport.width).toEqual(viewport.height)
// })
