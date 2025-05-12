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
import fs from 'fs'

const srcPath = path.join(import.meta.dirname, '../src')
const root = process.env['EVAL_PROJECT_ROOT'] || srcPath

test.beforeEach(async ({ page }) => {
})

test('nodejs/index.js', async ({ page }) => {
  await expect(isExisted('nodejs/index.js', srcPath)).toBeTruthy()
})

test('nodejs/test-config.js', async ({ page }) => {
  await import(path.join(root, 'nodejs/index.js'))
  await expect(isExisted('nodejs/test-config.js', srcPath)).toBeTruthy()
  const mod = await import(path.join(root, 'nodejs/test-config.js'))
  await expect(mod.config).toEqual({ lang: 'en' })
})
