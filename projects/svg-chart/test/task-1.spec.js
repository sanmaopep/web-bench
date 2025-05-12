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

import { test, expect } from '@playwright/test'
import { isExisted, getViewport } from '@web-bench/test-util'
import { configs, data } from './util/util'

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('configs', async ({ page }) => {
  await expect(configs).toBeDefined()
  await expect(Object.keys(configs).length).toBeGreaterThan(1)
  await expect(Object.values(configs).filter((c) => c.type === 'line').length).toBeGreaterThan(1)
})

test('data', async ({ page }) => {
  await expect(data).toBeDefined()
  const len = 5
  await expect(data.labels.length).toBe(len)
  await expect(data.datasets.length).toBe(3)
  await expect(data.datasets[0].label).toBeDefined()
  await expect(data.datasets[0].data.length).toBe(len)
})
