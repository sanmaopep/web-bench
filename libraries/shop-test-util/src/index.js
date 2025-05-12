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

const { expect } = require('@playwright/test')
const { getMockSKU } = require('./sku')

export const checkExists = (filePath) => {
  expect(isExisted(filePath, path.join(__dirname, '../../src'))).toBeTruthy()
}

export async function addProduct(request, data) {
  const insert = await request.post('/api/products', { data })
  return (await insert.json()).data
}

export async function pageLoginAdmin(page) {
  await page.goto('/login')

  await page.locator('.username').fill('admin')
  await page.locator('.password').fill('123456')
  await page.locator('.login-btn').click()

  await expect(page).toHaveURL('/')
}

export async function pageLoginUser(page) {
  await page.goto('/login')

  await page.locator('.username').fill('user')
  await page.locator('.password').fill('123456')
  await page.locator('.login-btn').click()

  await expect(page).toHaveURL('/')
}

export async function pageRegisterUser(page, username, referralCode) {
  await page.goto('/register')
  await page.locator('input.username').fill(username)
  await page.locator('input.password').fill('123456')
  await page.locator('input.confirm-password').fill('123456')
  if (referralCode) {
    await page.locator('.referral-code-input').fill(referralCode)
  }

  await page.locator('.register-button').click()

  await expect(page).toHaveURL('/')
}

export async function pageLoginNewUser(page, username) {
  await page.goto('/login')
  await page.locator('.username').fill(username)
  await page.locator('.password').fill('123456')
  await page.locator('.login-btn').click()

  await expect(page).toHaveURL('/')
}

export async function pageGetCurrentUserInfo(page) {
  const user_info = await page.request.get('/api/auth')
  const json = await user_info.json()
  expect(json).toBeDefined()
  return json
}

export async function logoutCurrentUser(page) {
  await page.hover('.header-username')
  await page.locator('.header-logout-btn').click()

  await expect(page.locator('.header-go-login')).toBeVisible()
}

export async function placeOrder(page) {
  // Open cart and place order
  await page.locator('.cart-button').click()
  await page.locator('.place-order-in-cart').click()

  // Verify redirect to order detail page
  await expect(page).toHaveURL(/\/order\/[^/]+/)

  const orderId = await page.url().split('/').pop()

  return orderId
}

export async function placeOrderAndPayForProduct(page, productId) {
  const { orderId } = await placeOrderForProduct(page, productId)
  await page.locator('.pay-my-order').click()
  await expect(page.locator('body')).toContainText('Finished')

  return { orderId }
}

export async function placeOrderForProduct(page, productId) {
  await page.goto(`/products/${productId}`)
  await page.locator('.add-to-cart-button').click()
  await page.waitForTimeout(1000)
  const orderId = await placeOrder(page)
  return { orderId }
}

export { getMockSKU }
