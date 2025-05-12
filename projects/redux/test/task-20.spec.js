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
  await loginUser(page, 'user1')
  await page.getByText('🚪').click()
})

test('Create and join chat room', async ({ page, context }) => {
  // Create chat room
  await page.locator('.create-room-btn').click()
  await page.getByLabel('Room Name').fill('Chat Room Test')
  await page.getByRole('button', { name: /^Create$/ }).click()

  // Click on the chat room card to enter
  await page.locator('.room-card:has-text("Chat Room Test")').click()

  // Should navigate to chat room page
  expect(page.url()).toContain('/chat/')

  // Should display creator's username
  await expect(page.locator('.participant-list')).toContainText('user1')

  // Create second user
  const secondPage = await context.newPage()
  await loginUser(secondPage, 'user2')
  await secondPage.getByText('🚪').click()

  // Second user joins the chat room
  await secondPage.locator('.room-card:has-text("Chat Room Test")').click()

  // Both users' usernames should be visible
  await expect(page.locator('.participant-list')).toContainText('user1')
  await expect(page.locator('.participant-list')).toContainText('user2')
  await expect(secondPage.locator('.participant-list')).toContainText('user1')
  await expect(secondPage.locator('.participant-list')).toContainText('user2')
})

test('Chat room message sending and receiving', async ({ page, context }) => {
  // Create and join chat room
  await page.locator('.create-room-btn').click()
  await page.getByLabel('Room Name').fill('Message Test Chat Room')
  await page.getByRole('button', { name: /^Create$/ }).click()
  await page.locator('.room-card:has-text("Message Test Chat Room")').click()

  // Create second user and join the chat room
  const secondPage = await context.newPage()
  await loginUser(secondPage, 'user2')
  await secondPage.getByText('🚪').click()
  await secondPage.locator('.room-card:has-text("Message Test Chat Room")').click()

  // First user sends a message
  await page.locator('.message-input').fill('Hello, user2!')
  await page.locator('.send-button').click()

  // Both users should see the message
  await expect(page.locator('.message-list')).toContainText('Hello, user2!')
  await expect(page.locator('.message-sender:has-text("user1")')).toBeVisible()
  await expect(secondPage.locator('.message-list')).toContainText('Hello, user2!')
  await expect(secondPage.locator('.message-sender:has-text("user1")')).toBeVisible()

  // Second user replies
  await secondPage.locator('.message-input').fill('Hello, user1!')
  await secondPage.locator('.send-button').click()

  // Both users should see the reply
  await expect(page.locator('.message-list')).toContainText('Hello, user1!')
  await expect(secondPage.locator('.message-list')).toContainText('Hello, user1!')
})

test('User disconnection', async ({ page, context }) => {
  // Create and join chat room
  await page.locator('.create-room-btn').click()
  await page.getByLabel('Room Name').fill('Disconnection Test Chat Room')
  await page.getByRole('button', { name: /^Create$/ }).click()
  await page.locator('.room-card:has-text("Disconnection Test Chat Room")').click()

  // Create second user and join the chat room
  const secondPage = await context.newPage()
  await loginUser(secondPage, 'user2')
  await secondPage.getByText('🚪').click()
  await secondPage.locator('.room-card:has-text("Disconnection Test Chat Room")').click()

  // The User will be kept in the participant list if secondPage is not closed
  await expect(page.locator('.participant-list')).toContainText('user1')
  await expect(page.locator('.participant-list')).toContainText('user2')
  await page.waitForTimeout(2500)
  await expect(page.locator('.participant-list')).toContainText('user1')
  await expect(page.locator('.participant-list')).toContainText('user2')

  // Close the second user's page to simulate disconnection
  await secondPage.close()
  await page.waitForTimeout(2500)

  // Participant list should update
  await expect(page.locator('.participant-list')).toContainText('user1')
  await expect(page.locator('.participant-list')).not.toContainText('user2')
})

test('Chat history persists across page refreshes', async ({ page, context }) => {
  // Create and join chat room
  await page.locator('.create-room-btn').click()
  await page.getByLabel('Room Name').fill('Persistence Test Chat Room')
  await page.getByRole('button', { name: /^Create$/ }).click()
  await page.locator('.room-card:has-text("Persistence Test Chat Room")').click()

  // Create second user and join the chat room
  const secondPage = await context.newPage()
  await loginUser(secondPage, 'user2')
  await secondPage.getByText('🚪').click()
  await secondPage.locator('.room-card:has-text("Persistence Test Chat Room")').click()

  // Send some messages
  await page.locator('.message-input').fill('Message 1')
  await page.locator('.send-button').click()
  await secondPage.locator('.message-input').fill('Message 2')
  await secondPage.locator('.send-button').click()
  await page.locator('.message-input').fill('Message 3')
  await page.locator('.send-button').click()

  // Chat History exists before reload
  await expect(page.locator('.message-list')).toContainText('Message 1')
  await expect(page.locator('.message-list')).toContainText('Message 2')
  await expect(page.locator('.message-list')).toContainText('Message 3')

  await page.reload({
    waitUntil: 'domcontentloaded',
  })
  await loginUser(page, 'user1')
  await page.getByText('🚪').click()
  await page.locator('.room-card:has-text("Persistence Test Chat Room")').click()

  // Chat history should be preserved
  await expect(page.locator('.message-list')).toContainText('Message 1')
  await expect(page.locator('.message-list')).toContainText('Message 2')
  await expect(page.locator('.message-list')).toContainText('Message 3')
})
