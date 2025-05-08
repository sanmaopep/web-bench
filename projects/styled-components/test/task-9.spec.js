const { test, expect } = require('@playwright/test')
const { getComputedStyleByLocator, sleep } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')

  // goto Read Blogs Page
  const header = page.locator('.site-header')
  const button = header.locator(`button:has-text("Read Blogs")`)
  await button.click()
})

const initialBlogs = [
  { title: 'Morning', content: 'Morning My Friends' },
  { title: 'Travel', content: 'I love traveling!' },
]

test.describe('Check Blog Content Animation', () => {
  for (const blog of initialBlogs) {
    test(`Check ${blog.title} Clicked`, async ({ page }) => {
      const blogContent = page.locator('.blog-content')

      // Check is Current BlogContent
      if (await blogContent.isVisible()) {
        const currentTextContent = await blogContent.textContent()
        if (currentTextContent.includes(blog.content)) {
          return
        }
      }

      await page.locator(`.list-item:has-text("${blog.title}")`).click()

      // Start From Opacity 0
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
