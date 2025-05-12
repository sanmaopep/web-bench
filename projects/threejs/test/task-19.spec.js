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
const { getWindowMirror } = require('@web-bench/test-util');
const { getSnakeHead } = require('../test-utils');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})


test('Check snake color change!', async ({ page }) => {
  const previousColor = await page.evaluate(() => {
    const snake = scene.getObjectByName('snake');
    const snakeHead = snake.getObjectByName('snake_head');
    return snakeHead.material.color.toArray()
  });

  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowUp');
  }
  const { scene } = await getWindowMirror(page, 'scene');

  let colorArr = await page.evaluate(() => {
    const snake = scene.getObjectByName('snake');
    const color = snake.children.map(obj => obj.material.color.toArray());
    return color;
  });

  colorArr = colorArr.map(arr => {
    return arr.map(num => num.toFixed(5));
  })

  const isDifferent = colorArr.some(c => {
    return c.join('-') !== colorArr[0].join('-');
  })

  expect(isDifferent).toBe(false);

  expect(colorArr[0].join('-') === previousColor).toBe(false);
})
