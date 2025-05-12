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

import { expect, test } from '@playwright/test'
import { isExisted } from '@web-bench/test-util'
import path from 'path'

const srcPath = path.join(import.meta.dirname, '../src')
const root = process.env['EVAL_PROJECT_ROOT'] || srcPath
let nodejs

test.beforeEach(async ({ page }) => {
  nodejs = await import(path.join(root, 'nodejs/index.js'))
  await expect(nodejs).toBeDefined()
})

test('nodejs/cjs.cjs', async ({ page }) => {
  await expect(isExisted('nodejs/cjs.cjs', srcPath)).toBeTruthy()
  const mod = await import(path.join(root, 'nodejs/cjs.cjs'))
  await expect(mod.default).toEqual({ cjs: true })
  await expect(mod.cjs).toEqual(true)
})

test('nodejs.cjs', async ({ page }) => {
  await expect(nodejs.cjs).toBe(true)
})
