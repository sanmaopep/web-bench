const { test, expect } = require('@playwright/test')
const { addProduct, getMockSKU } = require('@web-bench/shop-test-util')

const sku = getMockSKU()

test.describe('Update Products And Delete Products', () => {
  test.describe.configure({ mode: 'serial' })

  let productId = ''

  test.beforeAll(async ({ request }) => {
    productId = (await addProduct(request, sku)).id
  })

  test('Get Single Product', async ({ request }) => {
    const res = await request.get(`/api/products/${productId}`)

    expect(res.ok()).toBe(true)
    const data = await res.json()

    expect(data.success).toBe(true)
    expect(data.data.name).toBe(sku.name)
    expect(data.data.price).toBe(sku.price)
    expect(data.data.image).toBe(sku.image)
    expect(data.data.description).toBe(sku.description)
  })

  test('Update Product', async ({ request }) => {
    const res1 = await request.put(`/api/products/${productId}`, {
      data: {
        ...sku,
        name: 'Test SKU Pro',
      },
    })
    expect(res1.ok()).toBe(true)

    const res2 = await request.get(`/api/products/${productId}`)
    expect(res2.ok()).toBe(true)
    const data = await res2.json()
    expect(data.data.name).toBe('Test SKU Pro')
  })

  test('Delete Product', async ({ request }) => {
    const res = await request.delete(`/api/products/${productId}`)
    expect(res.ok()).toBe(true)
  })

  test('Get Product not found', async ({ request }) => {
    const res = await request.get(`/api/products/${productId}`)

    expect(res.ok()).toBe(true)
    const data = await res.json()

    expect(data.success).toBe(true)
    expect(data.data).toBeNull()
  })
})
