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
const { getComputedStyleByLocator, parseColorToHex } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

const testCases = [
  {
    content: '# hello world',
    tag: 'h1',
    color: '#000000',
  },
  {
    content: '## hello world',
    tag: 'h2',
    color: '#333333',
  },
  {
    content: '### hello world',
    tag: 'h3',
    color: '#666666',
  },
  {
    content: '#### hello world',
    tag: 'h4',
    color: '#999999',
  },
]

test.describe('Test Markdown', () => {
  for (const testCase of testCases) {
    test(`Test Markdown ${testCase.content}`, async ({ page }) => {
      await submitBlog(page, {
        title: 'Test',
        content: testCase.content,
      })

      const blogContent = page.locator('.blog-content')

      const helloWorld = blogContent.locator(`${testCase.tag}:has-text("hello world")`)

      await expect(helloWorld).toBeVisible()

      const style = await getComputedStyleByLocator(helloWorld)

      expect(parseColorToHex(style.color)).toBe(testCase.color)
    })
  }
})
