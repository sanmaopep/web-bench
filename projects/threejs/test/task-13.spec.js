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
const { getWindowMirror, sleep } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

/**
 * p - portal
 * h - snake head
 * b - snake body
 * c - candy
 * * - floor
 *     -3-2-1 0 1 2 3
 * 
 * -3 | b b b b b h p |
 * -2 | b c * * * * * |
 * -1 | b * * * * * * |
 *  0 | b b * * * * * |
 *  1 | * * * * * * * |
 *  2 | * * * * * * * |
 *  3 | p * * * * * * |
 */
test('Check candy generate can not over the portal.', async ({ page }) => {
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');

  const { scene } = await getWindowMirror(page, 'scene');

  const candy = scene.children.find(c => c.name === 'candy');

  expect(candy.position.x).toBe(-2);
  expect(candy.position.z).toBe(-2);
})
