/**
 * 目标： 确定
 */

const { test, expect } = require('@playwright/test')
const { getWindowMirror } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test('Check Camera position correct.', async ({ page }) => {
  const { camera } = await getWindowMirror(page, 'camera');

  expect(camera.position.x).toBe(0);
  expect(camera.position.y).toBe(15);
  expect(camera.position.z).toBe(15);
})

test('Check Camera angle correct.', async ({ page }) => {
  const { camera } = await getWindowMirror(page, 'camera');

  expect(camera.rotation._x.toFixed(5)).toBe((0 - Math.PI / 4).toFixed(5));
  expect(camera.rotation._y).toBe(0);
  expect(camera.rotation._z).toBe(0);
})

test('Check light exist.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');


  const light = (scene.children || []).find(child => {
    return child.type === "PointLight";
  })
  expect(light).toBeDefined();
})

test('Check light position.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');


  const light = (scene.children || []).find(child => {
    return child.type === "PointLight";
  })

  expect(light.position.x).toBe(-10);
  expect(light.position.y).toBe(15);
  expect(light.position.z).toBe(-10);
})