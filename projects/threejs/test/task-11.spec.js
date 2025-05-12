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

const { getSnakeHead } = require('../test-utils')

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})


/**
 * p - portal
 * h - snake head
 * b - snake body
 * c - candy
 * * - floor
 * 
 * | c * * * * * P |
 * | * * * * * * * |
 * | * * * * * * * |
 * | * * * h * * * |
 * | * * * b * * * |
 * | * * * b * * * |
 * | p * * b * * * |
 */
test('Check portal exist.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');


  const portal = (scene.children || []).find(child => {
    return child.name === 'portals';
  })

  expect(portal).toBeDefined();
  expect(portal.children.length).toBe(2);
})


test('Check portal position.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');


  const portal = (scene.children || []).find(child => {
    return child.name === 'portals';
  })

  const portalPositions = portal.children.map(child => child.position);

  const topRightExist = portalPositions.some(pos => {
    return pos.x === 3 && pos.z === -3;
  })
  const bottomLeftExist = portalPositions.some(pos => {
    return pos.x === -3 && pos.z === 3;
  })

  expect(topRightExist).toBe(true);
  expect(bottomLeftExist).toBe(true);
})

test('Check portal enable transport snake.', async ({ page }) => {
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowRight');
  }

  const snakeHead = await getSnakeHead(page);

  const { x, y, z } = snakeHead.position || {};

  expect(x).toBe(-3);
  expect(z).toBe(3);
})
