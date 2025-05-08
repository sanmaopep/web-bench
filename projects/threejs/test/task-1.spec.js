/**
 * 目标： 创建一个空场景
 */

const { test, expect } = require('@playwright/test')
const { getWindowMirror, getDomParams } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test('Check scene exist.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene');
  expect(scene).toBeDefined();
  expect(scene.type).toBe('Scene');
})

test('Check PerspectiveCamera exist.', async ({ page }) => {
  const { camera } = await getWindowMirror(page, 'camera');
  expect(camera).toBeDefined();
  expect(camera.type).toBe('PerspectiveCamera');
})

test('Check dom exist and size.', async ({ page }) => {
  const { innerWidth, innerHeight } = await getWindowMirror(page, ['benchPipline', 'innerWidth', 'innerHeight']);
  const canvas = page.locator('#root > canvas')
  const { width, height } = await getDomParams(canvas, ['width', 'height'])

  await expect(canvas).toBeVisible();
  expect(width).toBe(innerWidth);
  expect(height).toBe(innerHeight);
})


test('Check requestAnimationFrame active.', async ({ page }) => {
  const cb = new Function(`
    window.animationFrame = 0;
    const originRequestAnimationFrame = window.requestAnimationFrame;
    window.requestAnimationFrame = (cb) => {
      window.animationFrame += 1;
      originRequestAnimationFrame(cb);
    }
  `)
  await page.evaluate(cb);

  const { animationFrame: startAnimationFrame } = await getWindowMirror(page, ['animationFrame']);

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(null)
    }, 500);
  })

  const { animationFrame: endAnimationFrame } = await getWindowMirror(page, ['animationFrame']);

  expect(endAnimationFrame - startAnimationFrame).toBeGreaterThan(0);
})
