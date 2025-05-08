const { test, expect } = require('@playwright/test')
const { submitBlog, getTextHexColor } = require('./utils/helpers')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  const header = page.locator('.site-header')
  const button = header.locator('button:has-text("Theme")')
  await button.click()
})

const testCases = [
  {
    title: 'Simple Theme',
    h1: '#ff0000',
    h2: '#00ff00',
    h3: '#0000ff',
    h4: '#ffff00',
  },
  {
    title: 'Green Theme',
    h1: '#00ff00',
    h2: '#00dd00',
    h3: '#00aa00',
    h4: '#009900',
  },
]

for (const testCase of testCases) {
  test(`Check Markdown Theme Changed: ${testCase.title}`, async ({ page }) => {
    await page.locator('input.markdown-h1').fill(testCase.h1)
    await page.locator('input.markdown-h2').fill(testCase.h2)
    await page.locator('input.markdown-h3').fill(testCase.h3)
    await page.locator('input.markdown-h4').fill(testCase.h4)

    await submitBlog(page, {
      title: 'Hello',
      content: `
# hello1
## hello2
### hello3
#### hello4
    `,
    })

    expect(await getTextHexColor(page.locator('h1:has-text("hello1")'))).toBe(testCase.h1)
    expect(await getTextHexColor(page.locator('h2:has-text("hello2")'))).toBe(testCase.h2)
    expect(await getTextHexColor(page.locator('h3:has-text("hello3")'))).toBe(testCase.h3)
    expect(await getTextHexColor(page.locator('h4:has-text("hello4")'))).toBe(testCase.h4)
  })
}
