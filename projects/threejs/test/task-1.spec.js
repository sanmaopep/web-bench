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

/**
 * Goal: Create an empty scene
 */

const { test, expect } = require('@playwright/test')
const { getWindowMirror, getDomParams } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check scene exist.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene')
  expect(scene).toBeDefined()
  expect(scene.type).toBe('Scene')
})

test('Check PerspectiveCamera exist.', async ({ page }) => {
  const { camera } = await getWindowMirror(page, 'camera')
  expect(camera).toBeDefined()
  expect(camera.type).toBe('PerspectiveCamera')
})

test('Check dom exist and size.', async ({ page }) => {
  const { innerWidth, innerHeight } = await getWindowMirror(page, [
    'benchPipline',
    'innerWidth',
    'innerHeight',
  ])
  const canvas = page.locator('#root > canvas')
  const { width, height } = await getDomParams(canvas, ['width', 'height'])

  await expect(canvas).toBeVisible()
  expect(width).toBe(innerWidth)
  expect(height).toBe(innerHeight)
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
  await page.evaluate(cb)

  const { animationFrame: startAnimationFrame } = await getWindowMirror(page, ['animationFrame'])

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(null)
    }, 500)
  })

  const { animationFrame: endAnimationFrame } = await getWindowMirror(page, ['animationFrame'])

  expect(endAnimationFrame - startAnimationFrame).toBeGreaterThan(0)
})
