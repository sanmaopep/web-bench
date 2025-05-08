const { test, expect } = require('@playwright/test')
const { addProduct, getMockSKU } = require('@web-bench/shop-test-util')

const sku1 = getMockSKU()
const sku2 = getMockSKU()
const sku3 = getMockSKU()

test.beforeEach(async ({ page }) => {
  await page.goto('/products')
})

test('Product Not Found', async ({ page }) => {
  await page.goto(`/products/999999999999999999999999999999999999999999`)
  await expect(page.getByText('Product Not Found')).toBeVisible()
})

test('Product Product Detail Page Layout', async ({ request, page }) => {
  const { id } = await addProduct(request, sku1)

  await page.goto(`/products/${id}`)
  await expect(page.getByText('WebBench Shopping Mart')).toBeVisible()
  await expect(page.getByText('Copyright: Web Bench')).toBeVisible()
})

test('Check Product Detail Page', async ({ request, page }) => {
  const { id } = await addProduct(request, sku2)

  await page.goto(`/products/${id}`)
  await expect(page.locator(`.product-name:has-text('${sku2.name}')`)).toBeVisible()
  await expect(page.locator(`.product-description:has-text('${sku2.description}')`)).toBeVisible()
  await expect(page.locator(`.product-quantity:has-text('${sku2.quantity}')`)).toBeVisible()
  await expect(page.locator(`.product-price:has-text('${sku2.price}')`)).toBeVisible()
})

test('Check Click Card in Product List and jump to Product Detail Page', async ({
  request,
  page,
}) => {
  const { id } = await addProduct(request, sku3)

  await page.reload()
  await page.locator(`#product_card_${id}`).click()

  await expect(page).toHaveURL(`/products/${id}`)
  await expect(page.locator(`.product-description:has-text('${sku3.description}')`)).toBeVisible()
})
