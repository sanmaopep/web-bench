const { test, expect } = require('@playwright/test')
const { getMockSKU } = require('@web-bench/shop-test-util')

const sku = getMockSKU()

test.describe('Insert Products And Get Products', () => {
  test.describe.configure({ mode: 'serial' })

  test('Insert Products', async ({ request }) => {
    const insert = await request.post('/api/products', { data: sku })
    expect(insert.ok()).toBe(true)
  })

  test('Get Products', async ({ request }) => {
    const response = await request.get('/api/products')
    expect(response.ok()).toBe(true)
    const data = await response.json()
    expect(!!(data.products || []).find((_product) => _product.name === sku.name)).toBeTruthy()
  })
})
