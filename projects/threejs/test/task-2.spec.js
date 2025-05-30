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
 * Goal: Generate a floor and customize some properties
 */

const { test, expect } = require('@playwright/test')
const { getWindowMirror } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Check floor exist.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene')
  const floor = (scene.children || []).find((child) => {
    return child.name === 'floor'
  })
  expect(floor).toBeDefined()
})

test('Check floor size correct.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene')
  const floor = (scene.children || []).find((child) => {
    return child.name === 'floor'
  })

  expect(floor.geometry.parameters.width).toBe(8)
  expect(floor.geometry.parameters.height).toBe(8)
})

test('Check floor angle correct.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene')
  const floor = (scene.children || []).find((child) => {
    return child.name === 'floor'
  })

  expect(Math.abs(floor.rotation._x.toFixed(5))).toBe(Math.abs((0 - Math.PI / 2).toFixed(5)))
  expect(floor.rotation._y).toBe(0)
  expect(floor.rotation._z).toBe(0)
})

test('Check floor position correct.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene')

  const floor = (scene.children || []).find((child) => {
    return child.name === 'floor'
  })

  expect(floor.position.x).toBe(0)
  expect(floor.position.y).toBe(0)
  expect(floor.position.z).toBe(0)
})

test('Check floor color correct.', async ({ page }) => {
  const { scene } = await getWindowMirror(page, 'scene')

  const floor = (scene.children || []).find((child) => {
    return child.name === 'floor'
  })

  expect(floor.position.x).toBe(0)
  expect(floor.position.y).toBe(0)
  expect(floor.position.z).toBe(0)
})
