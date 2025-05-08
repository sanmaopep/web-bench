const { test, expect } = require('@playwright/test')
import {
  addProduct,
  pageRegisterUser,
  pageLoginAdmin,
  placeOrderAndPayForProduct,
  placeOrderForProduct,
  getMockSKU,
} from '@web-bench/shop-test-util'

const sku1 = getMockSKU({ name: 'Coffee Machine', price: 1299, quantity: 20 })
const sku2 = getMockSKU({ name: 'Rice Cooker', price: 149, quantity: 30 })
const sku3 = getMockSKU({ name: 'Microwave Oven', price: 199, quantity: 25 })
const sku4 = getMockSKU({ name: 'Air Fryer', price: 129, quantity: 35 })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('Order Portal navigation', async ({ page }) => {
  await pageLoginAdmin(page)

  await page.locator('.home-go-order-portal-link').click()
  await expect(page).toHaveURL('/admin/orders')
})

test('Show all orders in Admin Portal', async ({ page, request }) => {
  const { id: productId1 } = await addProduct(request, sku3)
  const { id: productId2 } = await addProduct(request, sku4)

  await pageRegisterUser(page, 'user_task_18_0')

  const { orderId: orderId1 } = await placeOrderForProduct(page, productId1)
  const { orderId: orderId2 } = await placeOrderAndPayForProduct(page, productId2)

  await pageLoginAdmin(page)

  await page.goto('/admin/orders')

  const order1 = page.locator(`#admin_order_${orderId1}`)
  const order2 = page.locator(`#admin_order_${orderId2}`)

  await expect(order1).toBeVisible()
  await expect(order1).toBeVisible()

  // No Refund pass for this two orders
  await expect(order1.locator('.pass-refund-review-button')).not.toBeVisible()
  await expect(order2.locator('.pass-refund-review-button')).not.toBeVisible()
})

test('Test Refund Order', async ({ page, request }) => {
  const { id: productId } = await addProduct(request, sku2)

  await pageRegisterUser(page, 'user_task_18_1')

  const { orderId } = await placeOrderAndPayForProduct(page, productId)

  // The Coin Of User is decrease
  await page.goto('/profile/user_task_18_1')
  const beforeRefundsMoney = String(1000 - sku2.price)
  await expect(page.locator('.profile-coin')).toContainText(beforeRefundsMoney)

  // Refund
  await page.goto(`/order/${orderId}`)
  await page.locator('.refund-button').click()
  await expect(page.locator('.refund-button')).not.toBeVisible()
  await expect(page.getByText('Refund Reviewing').first()).toBeVisible()

  await page.goto('/profile/user_task_18_1')
  await expect(page.locator('.profile-coin')).toContainText(beforeRefundsMoney)

  // Pass Refund Review
  await pageLoginAdmin(page)
  await page.goto('/admin/orders')
  const orderItem = page.locator(`#admin_order_${orderId}`)
  await orderItem.locator('.pass-refund-review-button').click()

  // Pass Refund Disappeared after refund passed
  await expect(orderItem.locator('.pass-refund-review-button')).not.toBeVisible()

  await page.goto('/profile/user_task_18_1')
  await expect(page.locator('.profile-coin')).toContainText(String(1000))
})

test('Refund hidden when order Failed', async ({ page, request }) => {
  // Coffee machine is not enough to pay
  const { id: productId } = await addProduct(request, sku1)

  await pageRegisterUser(page, 'user_task_18_2')

  await placeOrderForProduct(page, productId)
  await page.locator('.pay-my-order').click()

  await expect(page.locator('body')).toContainText('Failed')
  await expect(page.locator('.refund-button')).not.toBeVisible()
})
