const { test, expect } = require('@playwright/test')
const { getWindowMirror, sleep } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

/**
 * p - portal
 * h - snake head
 * b - snake body
 * c - candy
 * * - floor
 *     -3-2-1 0 1 2 3
 * 
 * -3 | b b b b b h p |
 * -2 | b c * * * * * |
 * -1 | b * * * * * * |
 *  0 | b b * * * * * |
 *  1 | * * * * * * * |
 *  2 | * * * * * * * |
 *  3 | p * * * * * * |
 */
test('Check candy generate can not over the portal.', async ({ page }) => {
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');

  const { scene } = await getWindowMirror(page, 'scene');

  const candy = scene.children.find(c => c.name === 'candy');

  expect(candy.position.x).toBe(-2);
  expect(candy.position.z).toBe(-2);
})
