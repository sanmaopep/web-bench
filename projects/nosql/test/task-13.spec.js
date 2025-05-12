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
const {
  pageLoginAdmin,
  addProduct,
  pageLoginUser,
  getMockSKU,
} = require('@web-bench/shop-test-util')

const sku1 = getMockSKU()

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Admin Portal visibility', async ({ page }) => {
  await expect(page.locator('.home-go-product-portal-link')).not.toBeVisible()
  await expect(page.locator('.home-go-user-portal-link')).not.toBeVisible()

  await pageLoginAdmin(page)

  await expect(page.locator('.home-go-product-portal-link')).toBeVisible()
  await expect(page.locator('.home-go-user-portal-link')).toBeVisible()
})

test('Product Portal navigation', async ({ page }) => {
  await pageLoginAdmin(page)

  await page.locator('.home-go-product-portal-link').click()
  await expect(page).toHaveURL('/admin/products')
})

test('Admin Portal navigation', async ({ page }) => {
  await pageLoginAdmin(page)

  await page.locator('.home-go-user-portal-link').click()
  await expect(page).toHaveURL('/admin/users')
})

test('Admin Portal for product information display', async ({ page }) => {
  const { id } = await addProduct(page.request, sku1)
  await pageLoginAdmin(page)
  await page.goto('/admin/products')

  // Check if product information is displayed
  const productRow = page.locator('#admin_product_' + id)
  await expect(productRow).toBeVisible()
  await expect(productRow).toContainText(sku1.name)
  await expect(productRow).toContainText(sku1.description)
  await expect(productRow).toContainText(String(sku1.price))
  await expect(productRow).toContainText(String(sku1.quantity))
})

test('Admin Portal for user information display', async ({ page }) => {
  await pageLoginAdmin(page)
  await page.goto('/admin/users')

  // Check if user information is displayed
  const adminRow = page.locator('#admin_user_admin')
  await expect(adminRow).toBeVisible()
  await expect(adminRow).toContainText('admin')

  const userRow = page.locator('#admin_user_user')
  await expect(userRow).toBeVisible()
  await expect(userRow).toContainText('user')
})

test('Admin Portal redirect to login if no privilege', async ({ page }) => {
  await pageLoginUser(page)

  await page.goto('/admin/products')
  await expect(page).toHaveURL('/login')

  await page.goto('/admin/users')
  await expect(page).toHaveURL('/login')
})

test('Not Found page in admin portal should redirect back to /login', async ({ page }) => {
  await pageLoginUser(page)

  await page.goto('/admin/nnnxxxfdfffdfsfsdf')
  await expect(page).toHaveURL('/login')
})

test('Show Not Found for admin', async ({ page }) => {
  await pageLoginAdmin(page)

  await page.goto('/admin/nnnxxxfdfffdfsfsdf')
  await expect(
    page.getByText('Oops! Looks like you have wandered off the beaten path.')
  ).toBeVisible()
})
