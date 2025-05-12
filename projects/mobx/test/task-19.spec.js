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
const { loginUser } = require('./utils/helpers')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test(' rooms page displays correctly with create room button', async ({ page }) => {
  // Login first
  await loginUser(page)

  // Navigate to  rooms page
  await page.getByText('🚪').click()

  // Create room button should be visible
  await expect(page.locator('.create-room-btn')).toBeVisible()
})

test('Create new room', async ({ page }) => {
  // Login first
  await loginUser(page)

  // Navigate to rooms page
  await page.getByText('🚪').click()

  // Count initial number of rooms
  const initialRoomCount = await page.locator('.room-card').count()

  // Create a new room
  await page.locator('.create-room-btn').click()

  // Should prompt for room name
  await page.getByLabel('Room Name').fill('Test Room 123')
  await page.getByRole('button', { name: /^Create$/ }).click()

  // Should now have one more room
  await expect(page.locator('.room-card')).toHaveCount(initialRoomCount + 1)

  // The new room should be visible with the given name
  const roomCard = page.locator('.room-card:has-text("Test Room 123")')
  await expect(roomCard).toBeVisible()

  // Room should show creator's username
  await expect(roomCard.getByText('user1')).toBeVisible()
})

test('Rooms sync across browser tabs', async ({ page, context }) => {
  // Login as first user
  await loginUser(page)
  await page.getByText('🚪').click()

  // Open a new tab
  const secondPage = await context.newPage()
  await secondPage.goto('/')
  await loginUser(secondPage, 'user2')
  await secondPage.getByText('🚪').click()

  // Create a room
  await page.locator('.create-room-btn').click()
  await page.getByLabel('Room Name').fill('Sync Test Room')
  await page.getByRole('button', { name: /^Create$/ }).click()

  // Verify room is visible in second tab
  await expect(secondPage.locator('.room-card:has-text("Sync Test Room")')).toBeVisible()

  // If second page reloaded, sync room still exists
  await secondPage.reload()
  await expect(secondPage.locator('.room-card:has-text("Sync Test Room")')).toBeVisible()
})

test('Rooms persist in localStorage across page refreshes', async ({ page }) => {
  // Login
  await loginUser(page)

  // Create a room
  await page.getByText('🚪').click()
  await page.locator('.create-room-btn').click()
  await page.getByLabel('Room Name').fill('Persistent Room')
  await page.getByRole('button', { name: /^Create$/ }).click()

  // Reload the page
  await page.reload()

  // The room should still be visible
  await expect(page.locator('.room-card:has-text("Persistent Room")')).toBeVisible()
})
