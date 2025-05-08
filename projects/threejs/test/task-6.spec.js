/**
 * 检测用户上下左右操作可用性
 */
const TABLE_SIZE = 8;
const { test, expect } = require('@playwright/test')
const { getWindowMirror, sleep } = require('@web-bench/test-util')
const { getSnakeHead } = require('../test-utils')

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

function createBorderDisabledMap() {
  const map = {};
  const size = TABLE_SIZE / 2 - 1;
  for (let x = -size; x <= size; x++) {
    for (let z = -size; z <= size; z++) {
      if (Math.abs(x) === size || Math.abs(z) === size)
        map[`${x}:${z}`] = true;
    }
  }
  return map;
}

function judgeCanMove(headPos, bodyPosList) {
  const disabledMap = {
    ...createBorderDisabledMap(), ...bodyPosList.reduce((pre, cur) => {
      return {
        ...pre,
        [`${cur[0]}:${cur[1]}`]: true
      }
    }, {})
  };

  const result = {
    n: !!disabledMap[`${headPos[0]}:${headPos[1] - 1}`], // 向北是否可以
    s: !!disabledMap[`${headPos[0]}:${headPos[1] + 1}`],
    w: !!disabledMap[`${headPos[0] - 1}:${headPos[1]}`],
    e: !!disabledMap[`${headPos[0] + 1}:${headPos[1]}`],
  }

  return result;
}

async function getCanMoveMap(page) {
  const { scene } = await getWindowMirror(page, 'scene');

  const snake = scene?.children?.find?.(c => c.name === 'snake');
  const snakeHead = snake.children?.find(child => {
    return child.name === 'snake_head';
  })
  const snakeBody = snake.children?.filter(child => {
    return child.name !== 'snake_head';
  })

  const bodyList = snakeBody.map(body => {
    return [body.position.x, body.position.z]
  })

  return {
    originPos: [snakeHead.position.x, snakeHead.position.z],
    enableMap: judgeCanMove([snakeHead.position.x, snakeHead.position.z], bodyList)
  }
}

test('Check snake move correct: ArrowLeft', async ({ page }) => {
  await page.keyboard.press('ArrowLeft');

  const { scene } = await getWindowMirror(page, 'scene');

  const snake = scene?.children?.find?.(c => c.name === 'snake');
  const snakeHead = snake.children?.find(child => {
    return child.name === 'snake_head';
  })

  const { x, y, z } = snakeHead.position || {};

  expect(x).toBe(-1);
  expect(z).toBe(0);
})
test('Check snake move correct: ArrowRight', async ({ page }) => {
  await page.keyboard.press('ArrowRight');

  const { scene } = await getWindowMirror(page, 'scene');

  const snake = scene?.children?.find?.(c => c.name === 'snake');
  const snakeHead = snake.children?.find(child => {
    return child.name === 'snake_head';
  })

  const { x, y, z } = snakeHead.position || {};

  expect(x).toBe(1);
  expect(z).toBe(0);
})
test('Check snake move correct: ArrowUp', async ({ page }) => {
  await page.keyboard.press('ArrowUp');

  const { scene } = await getWindowMirror(page, 'scene');

  const snake = scene?.children?.find?.(c => c.name === 'snake');
  const snakeHead = snake.children?.find(child => {
    return child.name === 'snake_head';
  })

  const { x, y, z } = snakeHead.position || {};

  expect(x).toBe(0);
  expect(z).toBe(-1);
})

// 这里会顺带检测碰撞体积
test('Check snake move correct: ArrowDown', async ({ page }) => {
  await page.keyboard.press('ArrowDown');
  const { scene } = await getWindowMirror(page, 'scene');

  const snake = scene?.children?.find?.(c => c.name === 'snake');
  const snakeHead = snake.children?.find(child => {
    return child.name === 'snake_head';
  })

  const { x, y, z } = snakeHead.position || {};

  expect(x).toBe(0);
  expect(x).toBe(0);
})
/**
 * 验证是否没有自动移动，大模型可能会有思维惯性，把自动移动逻辑给搬过来。
 */
test('Check no move auto', async ({ page }) => {
  async function getPosition() {
    const { scene } = await getWindowMirror(page, 'scene');
    const snake = scene?.children?.find?.(c => c.name === 'snake');
    const snakeHead = snake.children?.find(child => {
      return child.name === 'snake_head';
    })

    return snakeHead.position || {};
  }
  const initPosition = await getPosition();

  await sleep(1500);

  const nextPosition = await getPosition();

  expect(initPosition.x).toBe(nextPosition.x);
  expect(initPosition.z).toBe(nextPosition.z);
  expect(initPosition.y).toBe(nextPosition.y);
})

async function getRotation(page) {
  const snakeHead = await getSnakeHead(page);

  return {
    x: snakeHead.rotation._x,
    y: snakeHead.rotation._y,
    z: snakeHead.rotation._z,
  };
}

/**
 * 验证蛇头朝向
 * 这里不再验证是否一定可以向上走，因为初始化生成的是一个直线。 如果生成异常则必然报错
 */
test('Check snake head apex: ArrowUp', async ({ page }) => {
  await page.keyboard.press('ArrowUp');
  const nextRotation = await getRotation(page);

  expect(nextRotation.x.toFixed(5)).toBe((-Math.PI / 2).toFixed(5));
  expect(nextRotation.z).toBe(0);
})
test('Check snake head apex: ArrowLeft', async ({ page }) => {
  await page.keyboard.press('ArrowLeft');
  const nextRotation = await getRotation(page);

  expect(nextRotation.x).toBe(0);
  expect(nextRotation.z.toFixed(5)).toBe((Math.PI / 2).toFixed(5));
})
test('Check snake head apex: ArrowDown', async ({ page }) => {
  await page.keyboard.press('ArrowLeft');
  const nextRotation = await getRotation(page);

  expect(nextRotation.x).toBe(0);
  expect(nextRotation.z.toFixed(5)).toBe((Math.PI / 2).toFixed(5));
})

/**
 * 这里验证碰撞之后，角度不能转动
 */
test('Check snake head apex: ArrowDown error by self body', async ({ page }) => {
  const originRotation = await getRotation(page);

  await page.keyboard.press('ArrowDown');

  const nextRotation = await getRotation(page);

  expect(nextRotation.x.toFixed(5)).toBe(originRotation.x.toFixed(5));
  expect(nextRotation.y.toFixed(5)).toBe(originRotation.y.toFixed(5));
  expect(nextRotation.z.toFixed(5)).toBe(originRotation.z.toFixed(5));
})

/**
 * 这里验证其他键盘按键不会影响蛇的移动。 抽检 alt
 */
test('Check other keyboard has no response: Alt', async ({ page }) => {
  await page.keyboard.press('Alt');

  const { scene } = await getWindowMirror(page, 'scene');



  const snake = scene?.children?.find?.(c => c.name === 'snake');
  const snakeHead = snake.children?.find(child => {
    return child.name === 'snake_head';
  })

  const { x, y, z } = snakeHead.position || {};

  expect(x).toBe(0);
  expect(x).toBe(0);
})
/**
 * 抽检 Enter
 */
test('Check other keyboard has no response: Enter', async ({ page }) => {
  await page.keyboard.press('Enter');

  const { scene } = await getWindowMirror(page, 'scene');

  const snake = scene?.children?.find?.(c => c.name === 'snake');
  const snakeHead = snake.children?.find(child => {
    return child.name === 'snake_head';
  })

  const { x, y, z } = snakeHead.position || {};

  expect(x).toBe(0);
  expect(z).toBe(0);
})
