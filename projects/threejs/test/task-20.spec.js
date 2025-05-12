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
const { getWindowMirror } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})


test('Check game success!', async ({ page }) => {
  async function press(key, count = 1) {
    for (let i = 0; i < count; i++) {
      await page.keyboard.press(key);
    }
  }
  async function singleAllMap() {
    await press('ArrowRight', 6);
    for (let i = 0; i < 3; i++) {
      await press('ArrowUp');
      await press('ArrowLeft', 6);
      await press('ArrowUp');
      await press('ArrowRight', 6);
    }
  }
  await press('ArrowLeft', 3);
  await press('ArrowUp', 3);
  await press('ArrowRight', 6);

  await singleAllMap();
  await singleAllMap();

  const { scene } = await getWindowMirror(page, 'scene');

  expect(scene.children.length).toBe(0)
})
