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
const { getComputedStyleByLocator, sleep } = require('@web-bench/test-util')

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

test.describe('Test Add New Blog', () => {
  for (const blog of mockAddBlogs) {
    test(`Add Blog ${blog.title}`, async ({ page }) => {
      await submitBlog(page, blog)

      // Start From Opacity 0
      const blogContent = page.locator('.blog-content')
      const style1 = await getComputedStyleByLocator(blogContent)
      expect(Number(style1.opacity)).toBeCloseTo(0, 0.3)

      await sleep(1000)

      // End With Opacity 1
      const style2 = await getComputedStyleByLocator(blogContent)
      expect(Number(style2.opacity)).toBeCloseTo(1, 0.3)
      await expect(blogContent).toContainText(blog.content)
    })
  }
})
