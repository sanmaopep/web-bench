/**
 * 目标： 生成一个地板，并定制一些属性
 */

const { test, expect } = require('@playwright/test')
const { getWindowMirror } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test('Check floor exist.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');
  const floor = (scene.children || []).find(child => {
    return child.name === 'floor'
  })
  expect(floor).toBeDefined();
})

test('Check floor size correct.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');
  const floor = (scene.children || []).find(child => {
    return child.name === 'floor'
  })

  expect(floor.geometry.parameters.width).toBe(8);
  expect(floor.geometry.parameters.height).toBe(8);
})

test('Check floor angle correct.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');
  const floor = (scene.children || []).find(child => {
    return child.name === 'floor'
  })

  expect(Math.abs(floor.rotation._x.toFixed(5))).toBe(Math.abs((0 - Math.PI / 2).toFixed(5)));
  expect(floor.rotation._y).toBe(0);
  expect(floor.rotation._z).toBe(0);
})

test('Check floor position correct.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');

  const floor = (scene.children || []).find(child => {
    return child.name === 'floor'
  })

  expect(floor.position.x).toBe(0);
  expect(floor.position.y).toBe(0);
  expect(floor.position.z).toBe(0);
})

test('Check floor color correct.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');

  const floor = (scene.children || []).find(child => {
    return child.name === 'floor'
  })

  expect(floor.position.x).toBe(0);
  expect(floor.position.y).toBe(0);
  expect(floor.position.z).toBe(0);
})
