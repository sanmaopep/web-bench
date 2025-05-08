const { test, expect } = require('@playwright/test')
const { getWindowMirror, sleep } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test('Check candy animation.', async ({ page }) => {
  async function getCandyYPosition() {
    const { scene } = await getWindowMirror(page, 'scene');


    const candy = (scene.children || []).find(child => {
      return child.name === 'candy';
    })
    return candy.position.y;
  }

  const yArr = []
  for (let i = 0; i < 5; i++) {
    if (i !== 0) {
      await sleep(500);
    }
    const y = await getCandyYPosition();
    yArr.push(y);
  }

  const maxY = Math.max(...yArr);
  const minY = Math.min(...yArr);

  const isDifference = yArr.reduce((pre, cur, index, arr) => {
    if (!pre) {
      return false
    }
    if (index > 0) {
      if (arr[index - 1] === cur) {
        return false;
      }
    }
    return true;
  }, true);

  expect(isDifference).toBe(true);

  expect(minY).toBeGreaterThanOrEqual(0.5);
  expect(maxY).toBeLessThanOrEqual(1.5);
})
