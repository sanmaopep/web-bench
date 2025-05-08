const { test, expect } = require('@playwright/test')
const { checkExists } = require('./utils/helpers')

test('Check Api Route File Exists', () => {
  checkExists('app/api/usernames/route.ts')
})

test('Check get usernames', async ({ request }) => {
  const response = await request.get('/api/usernames')
  const data = (await response.json()) || []

  // Includes two initial usernames
  expect(data).toContain('admin')
  expect(data).toContain('user')
})
