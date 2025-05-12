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
const { addProduct, getMockSKU } = require('@web-bench/shop-test-util')

const sku1 = getMockSKU()
const sku2 = getMockSKU()
const sku3 = getMockSKU()

test.beforeEach(async ({ page }) => {
  await page.goto('/products')
})

test('Product Not Found', async ({ page }) => {
  // MongoDB Object Id is 24 character hex
  await page.goto(`/products/999999999999999999999999`)
  await expect(page.getByText('Product Not Found')).toBeVisible()
})

test('Product Product Detail Page Layout', async ({ request, page }) => {
  const { id } = await addProduct(request, sku1)

  await page.goto(`/products/${id}`)
  await expect(page.getByText('WebBench Shopping Mart')).toBeVisible()
  await expect(page.getByText('Copyright: Web Bench')).toBeVisible()
})

test('Check Product Detail Page', async ({ request, page }) => {
  const { id } = await addProduct(request, sku2)

  await page.goto(`/products/${id}`)
  await expect(page.locator(`.product-name:has-text('${sku2.name}')`)).toBeVisible()
  await expect(page.locator(`.product-description:has-text('${sku2.description}')`)).toBeVisible()
  await expect(page.locator(`.product-quantity:has-text('${sku2.quantity}')`)).toBeVisible()
  await expect(page.locator(`.product-price:has-text('${sku2.price}')`)).toBeVisible()
})

test('Check Click Card in Product List and jump to Product Detail Page', async ({
  request,
  page,
}) => {
  const { id } = await addProduct(request, sku3)

  await page.reload()
  await page.locator(`#product_card_${id}`).click()

  await expect(page).toHaveURL(`/products/${id}`)
  await expect(page.locator(`.product-description:has-text('${sku3.description}')`)).toBeVisible()
})
