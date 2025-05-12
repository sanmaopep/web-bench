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
  await page.goto('/index.html')
})

test('body', async ({ page }) => {
  await expect(page.locator('body')).toBeAttached()
})

test('.root', async ({ page }) => {
  await expect(page.locator('.root')).toBeAttached()
})

test('.color.rgb', async ({ page }) => {
  await expect(page.locator('.color.rgb')).toBeAttached()
  await expect(page.locator('.color.rgb .prop')).toHaveCount(4)
})

test('change props to change bg | component range', async ({ page }) => {
  const ranges = await page.locator('.rgb input[type="range"]').all()
  await expect(ranges[0]).toHaveAttribute('min', '0')
  await expect(ranges[0]).toHaveAttribute('max', '255')
  await expect(ranges[1]).toHaveAttribute('min', '0')
  await expect(ranges[1]).toHaveAttribute('max', '255')
  await expect(ranges[2]).toHaveAttribute('min', '0')
  await expect(ranges[2]).toHaveAttribute('max', '255')
})