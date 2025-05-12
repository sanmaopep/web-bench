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
const { getComputedStyleByLocator } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('default bg', async ({ page }) => {
  const style = await getComputedStyleByLocator(page.locator('.color.lch'))
  await expect(style.backgroundColor).toBe('lch(0 0 0)')
})

test('change props to show result', async ({ page }) => {
  for (let i = 0; i < 3; i++) {
    await page.locator('.lch .prop').nth(0).fill('90')
    await expect(page.locator('.lch .result').nth(0)).toContainText('90')
  }

  await page.locator('.lch .prop').nth(3).fill('0.5')
  await expect(page.locator('.lch .result').nth(3)).toContainText('0.5')
})

test('change props to change bg | component range', async ({ page }) => {
  const ranges = await page.locator('.lch input[type="range"]').all()
  await expect(ranges[0]).toHaveAttribute('min', '0')
  await expect(ranges[0]).toHaveAttribute('max', '100')
  await expect(ranges[1]).toHaveAttribute('min', '0')
  await expect(ranges[1]).toHaveAttribute('max', '230')
  await expect(ranges[2]).toHaveAttribute('min', '0')
  await expect(ranges[2]).toHaveAttribute('max', '360')
})

test('change props to change bg', async ({ page }) => {
  await page.locator('.lch .prop').nth(0).fill('90')
  await expect(page.locator('.lch .result').nth(0)).toContainText('90')
  let style = await getComputedStyleByLocator(page.locator('.lch'))
  await expect(style.backgroundColor).toBe('lch(90 0 0)')

  await page.locator('.lch .prop').nth(1).fill('90')
  await expect(page.locator('.lch .result').nth(1)).toContainText('90')
  style = await getComputedStyleByLocator(page.locator('.lch'))
  await expect(style.backgroundColor).toBe('lch(90 90 0)')

  await page.locator('.lch .prop').nth(2).fill('90')
  await expect(page.locator('.lch .result').nth(2)).toContainText('90')
  style = await getComputedStyleByLocator(page.locator('.lch'))
  await expect(style.backgroundColor).toBe('lch(90 90 90)')
})

test('change props to change bg | alpha', async ({ page }) => {
  await page.locator('.lch .prop').nth(3).fill('0.5')
  await expect(page.locator('.lch .result').nth(3)).toContainText('0.5')
  let style = await getComputedStyleByLocator(page.locator('.lch'))
  await expect(style.backgroundColor).toBe('lch(0 0 0 / 0.5)')
})
