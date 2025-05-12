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
const { getOffset } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check HomePage Layout', async ({ page }) => {
  await expect(page.getByText('WebBench Shopping Mart')).toBeVisible()
  await expect(page.getByText('Copyright: Web Bench')).toBeVisible()
})

test('Check LoginPage Layout', async ({ page }) => {
  await page.goto('/login')

  await expect(page.getByText('WebBench Shopping Mart')).toBeVisible()
  await expect(page.getByText('Copyright: Web Bench')).toBeVisible()
})

test('header fixed top', async ({ page }) => {
  const o1 = await getOffset(page, 'header')
  const o2 = await getOffset(page, ':has-text("Welcome to Shopping Mart")')

  expect(o1.top).toBeLessThanOrEqual(o2.top)
})

test('footer fixed bottom', async ({ page }) => {
  const o1 = await getOffset(page, 'footer')
  const o2 = await getOffset(page, ':has-text("Welcome to Shopping Mart")')

  expect(o1.top).toBeGreaterThanOrEqual(o2.top)
})
