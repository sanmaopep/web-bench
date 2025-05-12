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
const { submitBlog } = require('./utils/helpers')
const { sleep, getOffsetByLocator } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

const mockAddBlogs = [
  {
    title: 'TestBlog',
    content: 'TestContent',
  },
  {
    title: 'HelloWorld',
    content: 'HelloWorldContent',
  },
]

const getOffsetDeltaInSecond = async (locator) => {
  const offset1 = await getOffsetByLocator(locator)
  await sleep(1000)
  const offset2 = await getOffsetByLocator(locator)

  return offset2.top - offset1.top
}

test.describe('Test Add New Blog Animation: Move From Left to Right', () => {
  for (const blog of mockAddBlogs) {
    test(`Add Blog ${blog.title}`, async ({ page }) => {
      await submitBlog(page, blog)

      const blogContent = page.locator('.blog-content')

      // Blog is moved from bottom to top
      const delta1 = await getOffsetDeltaInSecond(blogContent)
      expect(delta1).toBeLessThan(0)

      // When Switched to Another Blog, no Movement Animation
      await page.locator(`.list-item:has-text("Morning")`).click()
      const delta2 = await getOffsetDeltaInSecond(blogContent)
      expect(delta2).toEqual(0)
    })
  }
})
