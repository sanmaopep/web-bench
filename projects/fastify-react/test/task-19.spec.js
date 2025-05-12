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
  addProduct,
  pageRegisterUser,
  placeOrderAndPayForProduct,
  placeOrderForProduct,
  getMockSKU,
} = require('@web-bench/shop-test-util')

const sku1 = getMockSKU({ name: 'Electric Kettle', price: 39.99, quantity: 40 })
const sku2 = getMockSKU({ name: 'Hello SKU', price: 49.99, quantity: 15 })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('Product Comment Layout Tests', () => {
  test.describe.configure({ mode: 'serial' })
  let productId = ''
  let orderId = ''
  let page

  test.beforeAll(async ({ request, browser }) => {
    productId = (await addProduct(request, sku1)).id
    // All Tests share one Page with same cookie
    page = await browser.newPage()
  })

  test('1. Comment Form Should Not Be Visible Before Purchase', async () => {
    await pageRegisterUser(page, 'user_task_19_0')
    await page.goto(`/products/${productId}`)

    await expect(page.locator('.comment-form')).not.toBeVisible()
    await expect(page.locator('.rate-input')).not.toBeVisible()
    await expect(page.locator('.rate-1-star')).not.toBeVisible()
    await expect(page.locator('.rate-2-star')).not.toBeVisible()
    await expect(page.locator('.rate-3-star')).not.toBeVisible()
    await expect(page.locator('.rate-4-star')).not.toBeVisible()
    await expect(page.locator('.rate-5-star')).not.toBeVisible()
    await expect(page.locator('.comment-textarea')).not.toBeVisible()
    await expect(page.locator('.comment-submit-button')).not.toBeVisible()
  })

  test('2. Comment Form Should Not Be Visible After Order But Before Payment', async () => {
    const orderResult = await placeOrderForProduct(page, productId)
    orderId = orderResult.orderId

    await page.goto(`/products/${productId}`)
    await expect(page.locator('.comment-form')).not.toBeVisible()
    await expect(page.locator('.rate-input')).not.toBeVisible()
    await expect(page.locator('.comment-textarea')).not.toBeVisible()
    await expect(page.locator('.comment-submit-button')).not.toBeVisible()
  })

  test('3. Comment Form Should Be Visible After Payment', async () => {
    await page.goto(`/order/${orderId}`)
    await page.locator('.pay-my-order').click()
    await expect(page.locator('body')).toContainText('Finished')

    await page.goto(`/products/${productId}`)
    await expect(page.locator('.comment-form')).toBeVisible()
    const rateInput = page.locator('.rate-input')
    await expect(rateInput).toBeVisible()
    await expect(rateInput.locator('.rate-1-star')).toBeVisible()
    await expect(rateInput.locator('.rate-2-star')).toBeVisible()
    await expect(rateInput.locator('.rate-3-star')).toBeVisible()
    await expect(rateInput.locator('.rate-4-star')).toBeVisible()
    await expect(rateInput.locator('.rate-5-star')).toBeVisible()
    await expect(page.locator('.comment-textarea')).toBeVisible()
    await expect(page.locator('.comment-submit-button')).toBeVisible()
  })

  test('4. Submit Comment And Verify', async () => {
    await page.locator('.rate-5-star').click()
    await page.locator('.comment-textarea').fill('Splendid!')
    await page.locator('.comment-submit-button').click()

    const commentItem = page.locator('.comment-item').first()
    await expect(commentItem).toBeVisible()
    await expect(commentItem.locator('.comment-username')).toContainText('user_task_19_0')
    await expect(commentItem.locator('.comment-rating')).toContainText('5')
    await expect(commentItem.locator('.comment-text')).toContainText('Splendid!')
  })

  test('5. Comment Form Should Not Be Visible After Commenting', async () => {
    await expect(page.locator('.comment-form')).not.toBeVisible()
    await expect(page.locator('.rate-input')).not.toBeVisible()
    await expect(page.locator('.comment-textarea')).not.toBeVisible()
    await expect(page.locator('.comment-submit-button')).not.toBeVisible()
  })
})

test.describe('Check Two Users Comment', async () => {
  test.describe.configure({ mode: 'serial' })

  let productId = ''

  test.beforeAll(async ({ request }) => {
    productId = (await addProduct(request, sku2)).id
  })

  test('1. One User Comment Product', async ({ page }) => {
    // Buy Product and Comment
    await pageRegisterUser(page, 'user_task_19_1')
    await placeOrderAndPayForProduct(page, productId)
    await page.goto(`/products/${productId}`)
    await page.locator('.rate-4-star').click()
    await page.locator('.comment-textarea').fill('This is a good product')
    await page.locator('.comment-submit-button').click()

    // Show Comment Item Visible
    const commentItem = page.locator('.comment-item').first()
    await expect(commentItem).toBeVisible()
    await expect(commentItem.locator('.comment-username')).toContainText('user_task_19_1')
    await expect(commentItem.locator('.comment-rating')).toContainText('4')
    await expect(commentItem.locator('.comment-text')).toContainText('This is a good product')

    // Average Rating
    await expect(page.locator('.product-average-rating')).toContainText('4')
  })

  test('2. Another User Comment Product', async ({ page }) => {
    // Another user can buy and comment
    await pageRegisterUser(page, 'user_task_19_2')
    await placeOrderAndPayForProduct(page, productId)
    await page.goto(`/products/${productId}`)
    await page.locator('.rate-1-star').click()
    await page.locator('.comment-textarea').fill('This is a bad product')
    await page.locator('.comment-submit-button').click()
    // Have 2 Comment Item
    await expect(page.locator('.comment-item')).toHaveCount(2)
    // Average Rating
    await expect(page.locator('.product-average-rating')).toContainText('2.5')
  })
})
