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
const {
  expectTolerance,
  getOffsetByLocator,
  getComputedStyleByLocator,
} = require('@web-bench/test-util')
const { starData, density } = require('./util/util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('speed number input', async ({ page }) => {
  await expect(page.locator('#speed')).toBeVisible()
  const speed = parseFloat((await page.locator('#speed').inputValue()) ?? '0')
  await expect(speed).toBeCloseTo(1)
})

test('change speed', async ({ page }) => {
  const dur0 = await page.locator('animateMotion').nth(0).getAttribute('dur')
  await page.locator('#speed').fill('2')
  await page.locator('#speed').blur() // trigger change event
  const speed = parseFloat((await page.locator('#speed').inputValue()) ?? '0')
  await expect(speed).toBeCloseTo(2)
  const dur1 = await page.locator('animateMotion').nth(0).getAttribute('dur')
  // console.log({ dur0, dur1, speed })
  await expect(parseFloat(dur0 ?? '0') / 2).toBeCloseTo(parseFloat(dur1 ?? '0'))
})

test('change speed | planet-satellites', async ({ page }) => {
  await page.locator('#speed').fill('2')
  await page.locator('#speed').blur() // trigger change event

  const offset = await getOffsetByLocator(page.locator('.jupiter'))
  await page.mouse.move(offset.centerX, offset.centerY)
  await page.locator('.jupiter').click()

  const speed = parseFloat((await page.locator('#speed').inputValue()) ?? '0')
  await expect(speed).toBeCloseTo(2)
  await expect(page.locator('animateMotion').nth(0)).toHaveAttribute('dur', '1s')

  await page.locator('#speed').fill('1')
  await page.locator('#speed').blur() // trigger change event
  await expect(page.locator('animateMotion').nth(0)).toHaveAttribute('dur', '2s')
})
