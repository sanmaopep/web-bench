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
  logoutCurrentUser,
  placeOrderAndPayForProduct,
  getMockSKU,
} = require('@web-bench/shop-test-util')

const sku1 = getMockSKU({
  price: 199.99,
  quantity: 25,
})

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Display Referral Code in Profile', async ({ page }) => {
  await pageLoginUser(page)

  await page.goto('/profile/user')
  await expect(page.locator('.referral-code')).toBeVisible()

  // Referral Rule
  await expect(
    page.getByText(
      'When a new user registers through your referral code, you will earn $888, and an additional $1888 when they pay for their first order.'
    )
  ).toBeVisible()
})

test('Display Referral Code Input in Register Page', async ({ page }) => {
  await page.goto('/register')
  await expect(page.locator('.referral-code-input')).toBeVisible()
})

test.describe('Test Register And Pay With Invitation Code', () => {
  test.describe.configure({ mode: 'serial' })

  let productId = ''
  let referralCode = ''

  test.beforeAll(async ({ request }) => {
    productId = (await addProduct(request, sku1)).id
  })

  test('1. User A Register And Get Referral Code', async ({ page }) => {
    // Get Referral Code From UserA
    await pageRegisterUser(page, 'user_task_20_A')
    await page.goto('/profile/user_task_20_A')
    referralCode = await page.locator('.referral-code').innerText()
  })

  test('2. Bonus Referral When new Register with Invitation Code', async ({ page }) => {
    // Register UserB with Referral Code
    await pageRegisterUser(page, 'user_task_20_B', referralCode)

    // When User B Register, User A will get $888
    await pageLoginNewUser(page, 'user_task_20_A')
    await page.goto('/profile/user_task_20_A')
    await expect(page.locator('.profile-coin')).toContainText(String(1000 + 888))
  })

  test('3. Bonus Referral When new Register Pay for a Product', async ({ page }) => {
    // Switch To User B
    await pageLoginNewUser(page, 'user_task_20_B')

    // When User B Paid a new Product, User A will get $1888
    await placeOrderAndPayForProduct(page, productId)
    await logoutCurrentUser(page)
    await pageLoginNewUser(page, 'user_task_20_A')
    await page.goto('/profile/user_task_20_A')
    await expect(page.locator('.profile-coin')).toContainText(String(1000 + 888 + 1888))

    // Switch To User B
    await pageLoginNewUser(page, 'user_task_20_B')
  })

  test('4. User B Place second Order, User A will not get more bonus', async ({ page }) => {
    // Switch To User B
    await pageLoginNewUser(page, 'user_task_20_B')

    // User B Place second Order, User A will not get more bonus
    await placeOrderAndPayForProduct(page, productId)
    await logoutCurrentUser(page)
    await pageLoginNewUser(page, 'user_task_20_A')
    await page.goto('/profile/user_task_20_A')
    await expect(page.locator('.profile-coin')).toContainText(String(1000 + 888 + 1888))
  })
})
