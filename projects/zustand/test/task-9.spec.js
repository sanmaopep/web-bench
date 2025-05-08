const { test, expect } = require('@playwright/test')
const { getOffset } = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Search Input is on the top of List', async ({ page }) => {
  const c1 = await getOffset(page, 'input[placeholder="Search Blogs"]')
  const c2 = await getOffset(page, '.list-item')
  expect(c1.centerY).toBeLessThan(c2.centerY)
})

test('Search Blogs', async ({ page }) => {
  const title = 'HappyHappyHappyHappy'

  await page.getByPlaceholder('Search Blogs').fill(title)

  const happy = page.locator(`.list-item:has-text("Mock_${title}")`)
  await expect(happy).toBeVisible()
  await expect(page.getByText('Morning')).toBeHidden()

  await happy.click()
  await expect(page.getByText(`Mock Search ${title} Detail`)).toBeVisible()
})

test('Fast Typing Keyword of Search Blogs, make sure the result is latest Search', async ({
  page,
}) => {
  let sumKeywords = ''
  const title = 'HappyHappyHappyHappy'

  for (const letter of title) {
    sumKeywords += letter
    await page.getByPlaceholder('Search Blogs').fill(sumKeywords)
  }

  const happy = page.locator(`.list-item:has-text("Mock_${title}")`)
  await expect(happy).toBeVisible()
  await happy.click()
  await expect(page.getByText(`Mock Search ${title} Detail`)).toBeVisible()
})

test('Search Input width should be less than the size of component: 200px', async ({ page }) => {
  const c1 = await getOffset(page, 'input[placeholder="Search Blogs"]')

  expect(c1.width).toBeLessThanOrEqual(200)
})
