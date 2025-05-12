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
const { loginUser, logoutUser, performUndo } = require('./utils/helpers')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('User can add a comment when logged in', async ({ page }) => {
  // Login first
  await loginUser(page)

  // Add a comment
  await page.locator('.comment-input').fill('This is a test comment')
  await page.locator('.comment-submit-btn').click()

  // Verify comment was added with correct author
  await expect(page.locator('.comment-author')).toBeVisible()
  await expect(page.locator('.comment-author')).toHaveText('user1')
  await expect(page.locator('.comment-text')).toHaveText('This is a test comment')
})

test('Multiple users can add comments to the same blog', async ({ page }) => {
  // Login as user1
  await loginUser(page, 'user1')

  // Add comment as user1
  await page.locator('.comment-input').fill('Comment by user1')
  await page.locator('.comment-submit-btn').click()

  // Logout
  await logoutUser(page)

  // Login as user2
  await loginUser(page, 'user2')

  // Add comment as user2
  await page.locator('.comment-input').fill('Comment by user2')
  await page.locator('.comment-submit-btn').click()

  // Verify both comments exist with correct authors
  await expect(page.locator('.comment-author').nth(0)).toHaveText('user1')
  await expect(page.locator('.comment-text').nth(0)).toHaveText('Comment by user1')
  await expect(page.locator('.comment-author').nth(1)).toHaveText('user2')
  await expect(page.locator('.comment-text').nth(1)).toHaveText('Comment by user2')
})

test('User can undo their last comment with keyboard shortcut', async ({ page, browserName }) => {
  // Login
  await loginUser(page)

  // Add a comment
  await page.locator('.comment-input').fill('Comment to be undone')
  await page.locator('.comment-submit-btn').click()

  // Verify comment was added
  await expect(page.locator('.comment-text')).toHaveText('Comment to be undone')

  // Use the undo helper function
  await performUndo(page, browserName)

  // Verify comment was removed and notification appears
  await expect(page.locator('.comment-text:has-text("Comment to be undone")')).not.toBeVisible()
})

test('Comments persist across blog navigation', async ({ page }) => {
  // Login
  await loginUser(page)

  // Select first blog and add comment
  const firstBlogItem = page.locator('.list-item').first()
  await firstBlogItem.click()
  await page.locator('.comment-input').fill('Comment on first blog')
  await page.locator('.comment-submit-btn').click()

  // Select second blog and add different comment
  const secondBlogItem = page.locator('.list-item').nth(1)
  await secondBlogItem.click()
  await page.locator('.comment-input').fill('Comment on second blog')
  await page.locator('.comment-submit-btn').click()

  // Return to first blog and verify its comment is still there
  await firstBlogItem.click()
  await expect(page.locator('.comment-text')).toHaveText('Comment on first blog')

  // Return to second blog and verify its comment is still there
  await secondBlogItem.click()
  await expect(page.locator('.comment-text')).toHaveText('Comment on second blog')
})

test('User can only undo their own comments', async ({ page, browserName }) => {
  // Login as user1
  await loginUser(page, 'user1')

  // Add comment as user1
  await page.locator('.comment-input').fill('Comment by user1')
  await page.locator('.comment-submit-btn').click()

  // Logout
  await logoutUser(page)

  // Login as user2
  await loginUser(page, 'user2')

  // Add comment as user2
  await page.locator('.comment-input').fill('Comment by user2')
  await page.locator('.comment-submit-btn').click()

  // Try to undo (should only remove user2's comment)
  await performUndo(page, browserName)

  // Verify user2's comment is removed but user1's remains
  await expect(page.locator('.comment-text:has-text("Comment by user2")')).not.toBeVisible()
  await expect(page.locator('.comment-text:has-text("Comment by user1")')).toBeVisible()
})

test.describe('Undo functionality boundary cases', async () => {
  test.describe.configure({ mode: 'serial' })

  let page
  let browserName

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await page.goto('/')
  })

  test("Attempt to undo another user's comment", async ({ browserName }) => {
    // User1 creates a comment
    await loginUser(page, 'user1')
    const targetBlog = page.locator('.list-item').first()
    await targetBlog.click()
    await page.locator('.comment-input').fill('user1 comment')
    await page.locator('.comment-submit-btn').click()
    await logoutUser(page)

    // User2 attempts to undo
    await loginUser(page, 'user2')
    await targetBlog.click()
    await performUndo(page, browserName)

    // Verify that User1's comment still exists
    await expect(page.locator('.comment-text:has-text("user1 comment")')).toBeVisible()
  })

  test('Attempt to undo on the wrong blog', async () => {
    // User2 creates a comment on Blog A
    const blogA = page.locator('.list-item').first()
    await blogA.click()
    await page.locator('.comment-input').fill('comment on blogA')
    await page.locator('.comment-submit-btn').click()

    // Switch to Blog B and attempt to undo
    const blogB = page.locator('.list-item').nth(1)
    await blogB.click()
    await performUndo(page, browserName)

    await blogA.click()
    // Verify that the comment on Blog A still exists
    await expect(page.locator('.comment-text:has-text("comment on blogA")')).toBeVisible()
  })
})
