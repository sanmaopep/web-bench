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

test('Check press "h" to reset camera angle and position.', async ({ page }) => {
  await page.mouse.move(0, 0);
  await page.mouse.down({
    button: 'left'
  });
  await page.mouse.move(300, 0);
  await page.mouse.up();


  await page.mouse.move(0, 0);
  await page.mouse.down({
    button: 'right'
  });
  await page.mouse.move(0, 100);
  await page.mouse.up();

  await page.keyboard.press('h');

  const { camera } = await getWindowMirror(page, 'camera');

  expect(camera.position.x).toBe(0);
  expect(camera.position.y).toBe(15);
  expect(camera.position.z).toBe(15);

  expect(camera.rotation._x).toBeCloseTo(0 - Math.PI / 4);
  expect(camera.rotation._y).toBe(0);
  expect(camera.rotation._z).toBe(0);
})
