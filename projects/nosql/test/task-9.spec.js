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
const { pageGetCurrentUserInfo } = require('@web-bench/shop-test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/register')
})

test('Register form layout', async ({ page }) => {
  await expect(page.locator('.register-form')).toBeVisible()
  await expect(page.locator('input.username')).toBeVisible()
  await expect(page.locator('input.password')).toBeVisible()
  await expect(page.locator('input.confirm-password')).toBeVisible()
  await expect(page.locator('.register-button')).toBeVisible()
  await expect(page.locator('.login-link')).toBeVisible()
})

test('Password mismatch validation', async ({ page }) => {
  await page.locator('input.username').fill('testuser')
  await page.locator('input.password').fill('password123')
  await page.locator('input.confirm-password').fill('password456')
  await page.locator('.register-button').click()
  await expect(page.locator('.error-message')).toContainText('Passwords must match')
})

test('Username already exists', async ({ page }) => {
  await page.locator('input.username').fill('admin')
  await page.locator('input.password').fill('password123')
  await page.locator('input.confirm-password').fill('password123')
  await page.locator('.register-button').click()
  await expect(page.locator('.error-message')).toContainText('Username already exists')
})

test('Successful registration', async ({ page }) => {
  await page.locator('input.username').fill('testuser')
  await page.locator('input.password').fill('password123')
  await page.locator('input.confirm-password').fill('password123')
  await page.locator('.register-button').click()

  // Should redirect to home page
  await expect(page).toHaveURL('/')
  await expect(page.locator('h1:has-text("Hello testuser")')).toBeVisible()

  // new user should have 1000 coins
  const { coin } = await pageGetCurrentUserInfo(page)
  expect(coin).toBe(1000)
})

test('Login link navigation', async ({ page }) => {
  await page.locator('.login-link').click()
  await expect(page).toHaveURL('/login')
})

test('Go to register page from login', async ({ page }) => {
  await page.goto('/login')
  await page.locator('.register-link').click()
  await expect(page).toHaveURL('/register')
})
