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

const { test, expect } = require('@playwright/test')
const { getMockSKU } = require('@web-bench/shop-test-util')
const { checkExists } = require('./utils/helpers')

const sku = getMockSKU()

test('Check Product Model Exists', () => {
  checkExists('model/product.ts')
})

test.describe('Insert Products And Get Products', () => {
  test.describe.configure({ mode: 'serial' })

  test('Insert Products', async ({ request }) => {
    const insert = await request.post('/api/products', { data: sku })
    expect(insert.ok()).toBe(true)
  })

  test('Get Products', async ({ request }) => {
    const response = await request.get('/api/products')
    expect(response.ok()).toBe(true)
    const data = await response.json()
    expect(!!(data.products || []).find((_product) => _product.name === sku.name)).toBeTruthy()
  })
})
