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
