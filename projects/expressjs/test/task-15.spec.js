const { test, expect } = require('@playwright/test')
const {
  pageLoginUser,
  addProduct,
  pageRegisterUser,
  pageLoginNewUser,
  getMockSKU,
} = require('@web-bench/shop-test-util')

const sku1 = getMockSKU({
  price: 180,
  quantity: 35,
})

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Cart button visibility and counter', async ({ page }) => {
  await pageLoginUser(page)
  await expect(page.locator('.cart-button')).toBeVisible()
  await expect(page.locator('.cart-button')).toContainText('0')
})

test('Cart button position and styling', async ({ page }) => {
  await pageLoginUser(page)
  const cartButton = page.locator('.cart-button')
  // Check if cart button is positioned in right-bottom
  const box = await cartButton.boundingBox()
  const viewport = page.viewportSize()
  expect(box.x).toBeGreaterThan(viewport.width / 2) // Right side
  expect(box.y).toBeGreaterThan(viewport.height / 2) // Bottom half
})

test.describe('Cart Add, Remove, Persistence', () => {
  test.describe.configure({ mode: 'serial' })

  let productId = ''
  test.beforeAll(async ({ request }) => {
    productId = (await addProduct(request, sku1)).id
  })

  test('Add product to cart', async ({ page, request }) => {
    await pageRegisterUser(page, 'user_task_15_1')

    // Go to product detail and add to cart
    await page.goto(`/products/${productId}`)
    await page.locator('.add-to-cart-button').click()

    // Verify cart counter updated
    await expect(page.locator('.cart-button')).toContainText('1')

    // Check cart popover content
    await page.locator('.cart-button').click()
    const cartItem = page.locator(`#cart_item_${productId}`)
    await expect(cartItem).toBeVisible()
    await expect(cartItem).toContainText(sku1.name)
  })

  test('Cart persistence after logout and login', async ({ page }) => {
    // New Test will auto logout
    await pageLoginNewUser(page, 'user_task_15_1')

    // Verify cart items persisted
    await expect(page.locator('.cart-button')).toContainText('1')
    await page.locator('.cart-button').click()
    await expect(page.locator(`#cart_item_${productId}`)).toBeVisible()
  })

  test('Delete Cart Item', async ({ page }) => {
    await pageLoginNewUser(page, 'user_task_15_1')

    await page.locator('.cart-button').click()
    const cartItem = page.locator(`#cart_item_${productId}`)

    await cartItem.locator('.cart-item-remove').click()
    await expect(page.locator('.cart-button')).toContainText('0')
  })

  test('Add multiple quantities of same product', async ({ page }) => {
    await pageLoginNewUser(page, 'user_task_15_1')

    // Add same product multiple times
    await page.goto(`/products/${productId}`)
    await page.locator('.add-to-cart-button').click()
    await page.locator('.add-to-cart-button').click()
    await page.locator('.add-to-cart-button').click()

    // Verify quantity in cart
    await expect(page.locator('.cart-button')).toContainText('3')
    await page.locator('.cart-button').click()
    await expect(page.locator('.cart-item-quantity')).toContainText('3')
  })
})
