const { test, expect } = require('@playwright/test')
const {
  pageRegisterUser,
  placeOrder,
  addProduct,
  getMockSKU,
} = require('@web-bench/shop-test-util')

const sku1 = getMockSKU({ price: 499, quantity: 50 })
const sku2 = getMockSKU({ price: 699, quantity: 45 })
const sku3 = getMockSKU({ price: 49.99, quantity: 2 })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Test Pay Order', async ({ page, request }) => {
  const { id: productId } = await addProduct(request, sku1)

  await pageRegisterUser(page, 'user_task_17_0')

  await page.goto(`/products/${productId}`)
  await page.locator('.add-to-cart-button').click()
  await page.locator('.add-to-cart-button').click()

  await expect(page.locator('.cart-button')).toContainText('2')

  const orderId = await placeOrder(page)
  await page.locator('.pay-my-order').click()

  await expect(page.locator('body')).toContainText('Finished')

  // The Coin Of User becomes 2
  await page.goto('/profile/user_task_17_0')
  await expect(page.locator('.profile-coin')).toContainText(String(1000 - sku1.price * 2))

  // The quantity of product decreased
  await page.goto(`/products/${productId}`)
  await expect(page.locator('.product-quantity')).toContainText(String(sku1.quantity - 2))

  // pay button disappeared
  await page.goto(`/order/${orderId}`)
  await expect(page.locator('.pay-my-order')).not.toBeVisible()
})

test('The Coin of current user is not enough', async ({ page, request }) => {
  const { id: productId } = await addProduct(request, sku2)

  await pageRegisterUser(page, 'user_task_17_1')

  await page.goto(`/products/${productId}`)
  await page.locator('.add-to-cart-button').click()
  await page.locator('.add-to-cart-button').click()

  await expect(page.locator('.cart-button')).toContainText('2')

  await placeOrder(page)
  await page.locator('.pay-my-order').click()

  await expect(page.locator('body')).toContainText('Failed')

  // money is still 1000
  await page.goto('/profile/user_task_17_1')
  await expect(page.locator('.profile-coin')).toContainText('1000')
})

test('The Rest Quantity of Product is not enough', async ({ page, request }) => {
  const { id: productId } = await addProduct(request, sku3)

  await pageRegisterUser(page, 'user_task_17_2')

  await page.goto(`/products/${productId}`)
  // sku3.quantity = 2
  await page.locator('.add-to-cart-button').click()
  await page.locator('.add-to-cart-button').click()
  await page.locator('.add-to-cart-button').click()
  await page.locator('.add-to-cart-button').click()

  await placeOrder(page)
  await page.locator('.pay-my-order').click()

  await expect(page.locator('body')).toContainText('Failed')

  // money is still 1000
  await page.goto('/profile/user_task_17_2')
  await expect(page.locator('.profile-coin')).toContainText('1000')
})
