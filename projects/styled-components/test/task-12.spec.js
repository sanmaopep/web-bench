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
