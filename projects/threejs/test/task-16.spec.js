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

const THREE = require('three')

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})


test('Check this feature is initially disabled.', async ({ page }) => {
  const { camera } = await getWindowMirror(page, 'camera');

  expect(camera.position.x).toBe(0);
  expect(camera.position.y).toBe(15);
  expect(camera.position.z).toBe(15);
  expect(camera.rotation._x).toBeCloseTo(0 - Math.PI / 4);
  expect(camera.rotation._y).toBe(0);
  expect(camera.rotation._z).toBe(0);
})

test('Check camera rotation follow the snake head', async ({ page }) => {
  await page.keyboard.press('l');
  await page.keyboard.press('ArrowLeft');

  const getCameraDirection = async () => {
    return page.evaluate(() => {
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection).projectOnPlane(new THREE.Vector3(0, 1, 0));
      return cameraDirection;
    });
  };

  const cameraDirection = await getCameraDirection();
  expect(cameraDirection.x).toBeLessThan(0);
  expect(cameraDirection.y).toBe(0);
  expect(cameraDirection.z).toBe(0);
})

test('Check press "l" can enable & disable feature', async ({ page }) => {
  await page.keyboard.press('l');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('l');
  await page.keyboard.press('ArrowDown');

  const getCameraDirection = async () => {
    return page.evaluate(() => {
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection).projectOnPlane(new THREE.Vector3(0, 1, 0));
      return cameraDirection;
    });
  };

  const cameraDirection = await getCameraDirection();
  expect(cameraDirection.x).toBeLessThan(0);
  expect(cameraDirection.y).toBe(0);
  expect(cameraDirection.z).toBe(0);
})
