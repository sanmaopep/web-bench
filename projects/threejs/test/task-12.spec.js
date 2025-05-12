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

test('Check portal size.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');


  const portalGroup = (scene.children || []).find(child => {
    return child.name === 'portals';
  })

  const portals = portalGroup.children;

  const shape = portals.map(portal => portal.geometry.type);
  const parameters = portals.map(portal => portal.geometry.parameters);

  // check two portal is same;
  expect(shape[0]).toBe(shape[1]);
  expect(parameters[0].outerRadius).toBe(parameters[1].outerRadius);
  expect(parameters[0].innerRadius).toBe(parameters[1].innerRadius);

  expect(shape[0]).toBe('RingGeometry');
  expect(parameters[0].outerRadius).toBeLessThanOrEqual(0.5);
  expect(parameters[0].innerRadius).toBeGreaterThanOrEqual(0);
})

test('Check portal animation.', async ({ page }) => {
  async function getPortals() {
    const { scene } = await getWindowMirror(page, 'scene');


    const portalGroup = (scene.children || []).find(child => {
      return child.name === 'portals';
    })
    return portalGroup.children;
  }

  const colorRArr = [];
  const colorGArr = [];
  const colorBArr = [];
  const rotationXArr = [];
  const rotationYArr = [];
  const rotationZArr = [];
  for (let i = 0; i < 5; i++) {
    if (i !== 0) {
      await sleep(500);
    }
    const portals = await getPortals();
    colorRArr.push(portals[0].material.color.r);
    colorGArr.push(portals[0].material.color.g);
    colorBArr.push(portals[0].material.color.b);
    rotationXArr.push(portals[0].rotation._x);
    rotationYArr.push(portals[0].rotation._y);
    rotationZArr.push(portals[0].rotation._z);
  }

  function isDifference(arr) {
    return arr.reduce((pre, cur, index, arr) => {
      if (!pre) {
        return false
      }
      if (index > 0) {
        if (arr[index - 1] === cur) {
          return false;
        }
      }
      return true;
    }, true)
  }

  function isAllSame(arr) {
    return arr.reduce((pre, cur, index, arr) => {
      if (!pre) {
        return false
      }
      if (index > 0) {
        if (arr[index - 1] !== cur) {
          return false;
        }
      }
      return true;
    }, true)
  }

  expect(isAllSame(colorRArr)).toBe(false);
  expect(isAllSame(colorGArr)).toBe(false);
  expect(isAllSame(colorBArr)).toBe(false);
  expect(isDifference(rotationXArr)).toBe(false);
  expect(isDifference(rotationYArr)).toBe(true);
  expect(isDifference(rotationZArr)).toBe(false);
})
