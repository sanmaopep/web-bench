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
  pageLoginUser,
  addProduct,
  pageRegisterUser,
  pageLoginNewUser,
  getMockSKU,
} = require('@web-bench/shop-test-util')

const sku1 = getMockSKU()
const sku2 = getMockSKU()

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Wishlist navigation from home page', async ({ page }) => {
  await pageLoginUser(page)
  await expect(page.locator('.home-go-wish-list')).toBeVisible()
  await page.locator('.home-go-wish-list').click()
  await expect(page).toHaveURL('/wishlist')
})

test('Wishlist requires authentication', async ({ page }) => {
  // Try accessing wishlist without login
  await page.goto('/wishlist')
  await expect(page).toHaveURL('/login')
})

test.describe('Wishlist add and remove', () => {
  test.describe.configure({ mode: 'serial' })

  let productId

  test.beforeAll(async ({ request }) => {
    productId = (await addProduct(request, sku1)).id
  })

  test('Add product to wishlist', async ({ page }) => {
    await pageRegisterUser(page, 'user_task_14_1')

    // Go to product listing and add to wishlist
    await page.goto(`/products/${productId}`)
    await page.locator(`.add-to-wishlist`).click()

    // Wait Wish list added
    await page.waitForTimeout(1000)

    // Navigate to wishlist page and verify product
    await page.goto('/wishlist')
    const wishlistItem = page.locator(`#wishlist_item_${productId}`)
    await expect(wishlistItem).toBeVisible()
    await expect(wishlistItem.locator('.wishlist-name')).toContainText(sku1.name)
    await expect(wishlistItem.locator('.wishlist-price')).toContainText(String(sku1.price))
    await expect(wishlistItem.locator('.wishlist-image')).toHaveAttribute('src', sku1.image)
  })

  test('Wishlist persistence after logout and login', async ({ page }) => {
    // New Test will auto logout
    await pageLoginNewUser(page, 'user_task_14_1')

    // Check if product still exists in wishlist
    await page.goto('/wishlist')
    await expect(page.locator(`#wishlist_item_${productId}`)).toBeVisible()
  })

  test('Remove product from wishlist', async ({ page }) => {
    await pageLoginNewUser(page, 'user_task_14_1')

    // Go to wishlist and remove product
    await page.goto('/wishlist')
    await page.locator(`#wishlist_item_${productId} .remove-from-wishlist`).click()
    await expect(page.locator(`#wishlist_item_${productId}`)).not.toBeVisible()
  })
})

test('Add same product to wishlist multiple times', async ({ page }) => {
  const { id } = await addProduct(page.request, sku2)
  await pageRegisterUser(page, 'user_task_14_2')

  // Try adding same product multiple times
  await page.goto(`/products/${id}`)
  await page.locator(`.add-to-wishlist`).click()

  for (let i = 0; i < 4; i++) {
    await page.waitForTimeout(1000)
    const visible = await page.locator('.add-to-wishlist').isVisible({ timeout: 100 })
    if (!visible) {
      // Skip test if button is disappeared
      return
    }
    const disabled = await page.locator('.add-to-wishlist').isDisabled({ timeout: 100 })
    if (disabled) {
      // Skip test if button is disabled
      break
    }
    await page.locator(`.add-to-wishlist`).click({ force: true })
  }

  // Check wishlist has only one instance
  await page.goto('/wishlist')
  await expect(page.locator('.wishlist-item')).toHaveCount(1)
})
