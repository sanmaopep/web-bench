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

const THREE = require('three')

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})


test('Check camera rotate by left mouse drag. Up', async ({ page }) => {
  const { camera: originCamera } = await getWindowMirror(page, 'camera');
  const originRotation = originCamera.rotation;
  await page.mouse.move(0, 0);
  await page.mouse.down({
    button: 'left'
  });
  await page.mouse.move(0, 100);
  await page.mouse.up();

  const { camera } = await getWindowMirror(page, 'camera');

  expect(camera.position.x).toBe(0);
  expect(camera.position.y).toBe(15);
  expect(camera.position.z).toBe(15);

  // 这说明视角是跟着鼠标走的
  expect(originRotation._x).toBeLessThan(camera.rotation._x);
  expect(Math.abs(camera.rotation._y)).toBe(0);
  expect(Math.abs(camera.rotation._z)).toBe(0);
})

test('Check camera rotate by left mouse drag. Right', async ({ page }) => {
  await page.mouse.move(100, 0);
  await page.mouse.down({
    button: 'left'
  });
  await page.mouse.move(0, 0);
  await page.mouse.up();

  const { camera } = await getWindowMirror(page, 'camera');

  expect(camera.position.x).toBe(0);
  expect(camera.position.y).toBe(15);
  expect(camera.position.z).toBe(15);

  expect(camera.rotation._y).toBeLessThan(0);
  expect(camera.rotation._z <= 0).toBe(true);
})

test('Check camera horizontal movement by right mouse drag. to Forward', async ({ page }) => {
  const { camera: originCamera } = await getWindowMirror(page, 'camera');
  const originRotation = originCamera.rotation;

  await page.mouse.move(0, 0);
  await page.mouse.down({
    button: 'right'
  });
  await page.mouse.move(0, 100);
  await page.mouse.up();

  const { camera } = await getWindowMirror(page, 'camera');

  expect(camera.rotation._x).toBe(originRotation._x);
  expect(camera.rotation._y).toBe(originRotation._y);
  expect(camera.rotation._z).toBe(originRotation._z);

  expect(camera.position.x).toBe(0);
  expect(camera.position.y).toBe(15);
  expect(camera.position.z).toBeLessThan(15);
})

test('Check camera horizontal movement by right mouse drag. to Right', async ({ page }) => {
  const { camera: originCamera } = await getWindowMirror(page, 'camera');
  const originRotation = originCamera.rotation;

  await page.mouse.move(0, 0);
  await page.mouse.down({
    button: 'right'
  });
  await page.mouse.move(100, 0);
  await page.mouse.up();

  const { camera } = await getWindowMirror(page, 'camera');

  expect(camera.rotation._x).toBe(originRotation._x);
  expect(camera.rotation._y).toBe(originRotation._y);
  expect(camera.rotation._z).toBe(originRotation._z);

  expect(camera.position.x).toBeLessThan(0);
  expect(camera.position.y).toBe(15);
  expect(camera.position.z).toBe(15);
})

test('Check camera scale by scroll wheel.', async ({ page }) => {
  const { camera: originCamera } = await getWindowMirror(page, 'camera');
  const originVector3 = new THREE.Vector3(originCamera.position.x, originCamera.position.y, originCamera.position.z).normalize();

  await page.mouse.move(0, 0);
  await page.mouse.wheel(0, 100);
  const { camera } = await getWindowMirror(page, 'camera');
  const newVector3 = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z).normalize();

  expect(newVector3.x).toBeCloseTo(originVector3.x);
  expect(newVector3.y).toBeCloseTo(originVector3.y);
  expect(newVector3.z).toBeCloseTo(originVector3.z);
})

/**
 * camera origin position is fixed: 0, 15, 15.
 * After camera rotated to other angle, the direction of camera horizontal movement need to based on the new rotation angle.
 */
test('After camera rotated, check camera horizontal movement correct.', async ({ page }) => {
  const originPosition = new THREE.Vector3(0, 15, 15);
  const cameraOriginPositionVector = new THREE.Vector3(0, 15, 15);
  await page.mouse.move(0, 0);
  await page.mouse.down({
    button: 'left'
  });
  await page.mouse.move(300, 0);
  await page.mouse.up();

  const { camera: rotatedCamera } = await getWindowMirror(page, 'camera');

  const cameraRotationVector = new THREE.Vector3(rotatedCamera.rotation._x, rotatedCamera.rotation._y, rotatedCamera.rotation._z);

  await page.mouse.move(0, 0);
  await page.mouse.down({
    button: 'right'
  });
  await page.mouse.move(0, 100);
  await page.mouse.up();

  const { camera } = await getWindowMirror(page, 'camera');
  const newPosition = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);

  const movementVector3 = new THREE.Vector3().copy(newPosition).add(cameraOriginPositionVector.negate());

  const angle = movementVector3.angleTo(cameraRotationVector);

  expect(Math.abs(angle)).toBeCloseTo(Math.PI / 2);
  expect(originPosition.equals(newPosition)).toBe(false);
})
