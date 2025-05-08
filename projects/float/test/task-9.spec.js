const { test, expect } = require('@playwright/test')
const {
  getComputedStyle,
  getOffset,
  getBox,
  getMarginBox,
  expectTolerance,
} = require('@web-bench/test-util')

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
})

test('leftbar 2 columns', async ({ page }) => {
  const c1 = await getOffset(page, '.leftbar > *:nth-child(1)')
  const c2 = await getOffset(page, '.leftbar > *:nth-child(2)')
  expect(c1.centerY).toBe(c2.centerY)
})

test('leftbar 20 * 2 cells', async ({ page }) => {
  const count = await page.locator('.leftbar > *').count()
  expect(count).toBe(40)
})

test('leftbar height', async ({ page }) => {
  const body = await getOffset(page, 'body')
  const header = await getOffset(page, '.header')
  const footer = await getOffset(page, '.footer')
  const leftbar = await getOffset(page, '.leftbar')
  expect(header.height + leftbar.height + footer.height).toBe(body.height)
})

test('leftbar items width', async ({ page }) => {
  const leftbar = await getOffset(page, '.leftbar')
  const c1 = getMarginBox(await getComputedStyle(page, '.leftbar > *:nth-child(1)'))
  const c2 = getMarginBox(await getComputedStyle(page, '.leftbar > *:nth-child(2)'))
  expectTolerance(c1.width + c2.width, leftbar.width, 5)
})

test('leftbar items height', async ({ page }) => {
  const leftbar = await getOffset(page, '.leftbar')
  const itemStyle = await getComputedStyle(page, '.leftbar > *')
  const itemSpaceHeight = getMarginBox(itemStyle).height
  expectTolerance(itemSpaceHeight * 20, leftbar.height, 5)
})

test('leftbar no flex & grid', async ({ page }) => {
  await expect(page.locator('.leftbar')).not.toHaveCSS('display', /grid|flex/i)
  await expect(page.locator('.leftbar')).toHaveCSS('position', /static/i)
})

test.describe('page height 360px', () => {
  test.use({ viewport: { width: 1280, height: 360 } })

  test('leftbar items height', async ({ page }) => {
    const leftbar = await getOffset(page, '.leftbar')
    const itemStyle = await getComputedStyle(page, '.leftbar > *')
    const itemSpaceHeight = getMarginBox(itemStyle).height
    expectTolerance(itemSpaceHeight * 20, leftbar.height, 5)
  })
})

// test.describe('page height 200px', () => {
//   test.use({ viewport: { width: 1280, height: 200 } })

//   test('leftbar items height', async ({ page }) => {
//     const leftbar = await getOffset(page, '.leftbar')
//     const itemStyle = await getComputedStyle(page, '.leftbar > *')
//     const itemSpaceHeight = getMarginBox(itemStyle).height
//     expectTolerance(itemSpaceHeight * 20, leftbar.height, 5)
//   })
// })

// test('leftbar item align-self', async ({ page }) => {
//   const style = await getComputedStyle(page, '.leftbar > *')
// })
