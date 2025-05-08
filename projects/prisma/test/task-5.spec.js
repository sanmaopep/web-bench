const { test, expect } = require('@playwright/test')
const { getMockSKU, addProduct } = require('@web-bench/shop-test-util')

const sku = getMockSKU()

test.beforeEach(async ({ page }) => {
  await page.goto('/products')
})

test('Product Page Layout', async ({ page }) => {
  await expect(page.getByText('WebBench Shopping Mart')).toBeVisible()
  await expect(page.getByText('Copyright: Web Bench')).toBeVisible()
})

test('Check Product List', async ({ request, page }) => {
  await addProduct(request, sku)

  await page.reload()

  await expect(page.locator(`.product-name:has-text('${sku.name}')`).first()).toBeVisible()
})

test('Navigate to product List from Home Page', async ({ request, page }) => {
  await page.goto('/')
  await expect(page).not.toHaveURL('/products')

  await page.locator('.home-go-products-link').click()

  await expect(page).toHaveURL('/products')
  await expect(page.locator(`.product-list`)).toBeVisible()
})
