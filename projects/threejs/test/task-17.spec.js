const { test, expect } = require('@playwright/test')
const { getWindowMirror } = require('@web-bench/test-util')
const { checkIsInLine } = require('../test-utils')

const THREE = require('three')

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})


test('Check dead-end & reset.', async ({ page }) => {
  async function press(key, count = 1) {
    for (let i = 0; i < count; i++) {
      await page.keyboard.press(key);
    }
  }
  await press('ArrowLeft', 3);
  await press('ArrowUp', 3);
  await press('ArrowRight', 5);
  await press('ArrowDown', 2);
  await press('ArrowLeft', 2);
  await press('ArrowUp');

  await press('ArrowRight');

  const { scene } = await getWindowMirror(page, 'scene');

  const candy = (scene.children || []).find(child => {
    return child.name === 'candy';
  })
  const snake = (scene.children || []).find(child => {
    return child.name === 'snake';
  })
  const snakeHead = snake.children?.find(child => {
    return child.name === 'snake_head';
  })
  const snakeBody = snake.children?.filter(child => {
    return child.name !== 'snake_head';
  })


  const bodyList = snakeBody.map(body => {
    return [body.position.x, body.position.z]
  })

  const isLine = checkIsInLine([snakeHead.position.x, snakeHead.position.z], bodyList.reduce((pre, cur) => {
    return {
      ...pre,
      [`${cur[0]}:${cur[1]}`]: true
    }
  }, {}));



  expect(candy.position.x).toBe(-3);
  expect(candy.position.z).toBe(-3);

  expect(snakeBody.length).toBe(3);
  const isExistBottomBody = bodyList.some(([x, z]) => {
    return x === 0 && z === 3;
  })
  expect(isExistBottomBody).toBe(true);

  expect(snakeHead.rotation._x).toBeCloseTo(-Math.PI / 2);
  expect(snakeHead.rotation._z).toBe(0);

  expect(isLine).toBe(true);
})
