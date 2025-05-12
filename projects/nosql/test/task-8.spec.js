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
const { isExisted } = require('@web-bench/test-util')
const path = require('path')

test.beforeEach(async ({ page }) => {
  await page.goto('/login')
})

test('Test actions/auth.ts created to manage auth ', async () => {
  expect(isExisted('actions/auth.ts', path.join(__dirname, '../src'))).toBeTruthy()
})

test('Login page layout', async ({ page }) => {
  // Check if all required elements are present
  await expect(page.locator('.username')).toBeVisible()
  await expect(page.locator('.password')).toBeVisible()
  await expect(page.locator('.login-btn')).toBeVisible()
})

test('Successful login redirects to home page', async ({ page }) => {
  // Fill in login credentials
  await page.locator('.username').fill('user')
  await page.locator('.password').fill('123456')

  // Click login button
  await page.locator('.login-btn').click()

  // Check redirect and welcome message
  await expect(page).toHaveURL('/')
  await expect(page.locator('h1:has-text("Hello user")').first()).toBeVisible()
})

test('Failed login shows error message', async ({ page }) => {
  // Fill in incorrect login credentials
  await page.locator('.username').fill('wronguser')
  await page.locator('.password').fill('wrongpassword')

  // Click login button
  await page.locator('.login-btn').click()

  // Check if error message is displayed
  await expect(page.getByText('Login Failed')).toBeVisible()

  // Verify we're still on the login page
  await expect(page).toHaveURL('/login')
})

test('Input fields functionality', async ({ page }) => {
  // Test username input
  await page.locator('.username').fill('user')
  await expect(page.locator('.username')).toHaveValue('user')

  // Test password input
  await page.locator('.password').fill('123456')
  await expect(page.locator('.password')).toHaveValue('123456')

  // Check if password field is of type password
  await expect(page.locator('.password')).toHaveAttribute('type', 'password')
})
