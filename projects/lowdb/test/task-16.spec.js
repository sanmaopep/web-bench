const { test, expect } = require('@playwright/test')
const {
  addProduct,
  pageRegisterUser,
  placeOrder,
  getMockSKU,
} = require('@web-bench/shop-test-util')

const sku1 = getMockSKU({ price: 699, quantity: 15 })
const sku2 = getMockSKU({ price: 299, quantity: 20 })
const sku3 = getMockSKU({ price: 149, quantity: 25 })
const sku4 = getMockSKU({ price: 1099, quantity: 30 })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Place order from cart and redirect to order detail', async ({ page, request }) => {
  const { id: productId1 } = await addProduct(request, sku1)
  const { id: productId2 } = await addProduct(request, sku2)

  await pageRegisterUser(page, 'user_task_16_0')

  // Add product to cart
  await page.goto(`/products/${productId1}`)
  await page.locator('.add-to-cart-button').click()
  await page.locator('.add-to-cart-button').click()

  await page.goto(`/products/${productId2}`)
  await page.locator('.add-to-cart-button').click()
  await expect(page.locator('.cart-button')).toContainText('3')

  await placeOrder(page)

  // Check if cart is cleared
  await expect(page.locator('.cart-button')).toContainText('0')

  // Check order details
  await expect(page.locator(`#product_in_order_${productId1}`)).toBeVisible()
  await expect(page.locator(`#product_in_order_${productId2}`)).toBeVisible()

  // Contain Total Price
  await expect(page.locator('body')).toContainText(String(sku1.price * 2 + sku2.price))
  await expect(page.locator('body')).toContainText('Pending payment')
})

test('Navigate to My Orders page and verify orders list', async ({ page, request }) => {
  const { id: productId1 } = await addProduct(request, sku3)
  const { id: productId2 } = await addProduct(request, sku4)
  await pageRegisterUser(page, 'user_task_16_1')

  // Create first order
  await page.goto(`/products/${productId1}`)
  await page.locator('.add-to-cart-button').click()
  const orderId1 = await placeOrder(page)

  // Create second order
  await page.goto(`/products/${productId2}`)
  await page.locator('.add-to-cart-button').click()
  const orderId2 = await placeOrder(page)

  // Go to My Orders page
  await page.locator('.header-username').hover()
  await page.locator('.header-go-to-my-orders').click()

  // Verify orders are listed
  const order1Item = page.locator(`#my_order_${orderId1}`)
  const order2Item = page.locator(`#my_order_${orderId2}`)
  await expect(order1Item).toBeVisible()
  await expect(order2Item).toBeVisible()

  await order2Item.click()
  await expect(page).toHaveURL(`/order/${orderId2}`)
})

// Place Order hidden when no item in cart
test('Place Order hidden when no item in cart', async ({ page }) => {
  await pageRegisterUser(page, 'user_task_16_4')
  // Go to cart
  await page.locator('.cart-button').click()
  // Verify place order button is hidden
  await expect(page.locator('.place-order-in-cart')).not.toBeVisible()
})
