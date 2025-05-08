const { test, expect } = require('@playwright/test')
const jose = require('jose')

const secret = new TextEncoder().encode('WEBBENCH-SECRET')

test('Login failed', async ({ request }) => {
  const login = await request.post('/api/auth', {
    data: { username: 'admin', password: 'wrong_password' },
  })

  expect(login.ok()).toBeFalsy()
  expect(login.status()).toBe(401)
})

test('Get User Info without password', async ({ request }) => {
  const login = await request.get('/api/auth')

  expect(login.ok()).toBeFalsy()
  expect(login.status()).toBe(401)
})

test('Login as admin', async ({ request }) => {
  const login = await request.post('/api/auth', {
    data: { username: 'admin', password: '123456' },
  })

  expect(login.ok()).toBeTruthy()

  const user_info = await request.get('/api/auth')
  const user_info_data = await user_info.json()

  const ADMIN_INFO = { username: 'admin', role: 'admin' }

  expect(user_info_data).toMatchObject(ADMIN_INFO)
  // should return coin number
  expect(user_info_data.coin).toBeDefined()

  const cookies = (await request.storageState()).cookies

  const token = cookies.find((_cookie) => _cookie.name === 'TOKEN').value

  expect(token).toBeDefined()

  // decrypt token by json web token
  const { payload } = await jose.jwtVerify(token, secret)

  expect(payload).toMatchObject(ADMIN_INFO)
  // no coin in JWT
  expect(payload.coin).toBeUndefined()
})

test('Login as user', async ({ request }) => {
  const login = await request.post('/api/auth', {
    data: { username: 'user', password: '123456' },
  })

  expect(login.ok()).toBeTruthy()

  const user_info = await request.get('/api/auth')
  const user_info_data = await user_info.json()

  const USER_INFO = { username: 'user', role: 'user' }

  expect(user_info_data).toMatchObject(USER_INFO)
  // should return coin number
  expect(user_info_data.coin).toBeDefined()

  const cookies = (await request.storageState()).cookies

  const token = cookies.find((_cookie) => _cookie.name === 'TOKEN').value

  expect(token).toBeDefined()

  // decrypt token using jose
  const { payload } = await jose.jwtVerify(token, secret)
  expect(payload).toMatchObject(USER_INFO)
  // no coin in JWT
  expect(payload.coin).toBeUndefined()
})

test('Should Validate Signature in TOKEN', async ({ page, context }) => {
  const MOCK_TOKEN =
    'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzM5OTU5NzE0fQ.fake_signature'

  await page.goto('/')

  context.addCookies([
    {
      name: 'TOKEN',
      value: MOCK_TOKEN,
      url: page.url(),
    },
  ])

  const login = await context.request.get('/api/auth')

  expect(login.ok()).toBeFalsy()
})
