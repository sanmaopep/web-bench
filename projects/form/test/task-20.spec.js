const { test, expect } = require('@playwright/test')
const { isExisted, getOffsetByLocator } = require('@web-bench/test-util')
const path = require('path')
const { interceptNetworkAndAbort, submit } = require('./util')

let data
test.beforeEach(async ({ page }) => {
  await page.goto('/index.html')
  await page.locator('.export').click()
  data = JSON.parse(await page.evaluate(() => localStorage.data))
})

test('survey export button', async ({ page }) => {
  await expect(page.locator('.export')).toBeVisible()
})

test('survey export data format', async ({ page }) => {
  await expect(data.title).toBeDefined()
  await expect(Array.isArray(data.questions)).toBeTruthy()
})

// {title: 'Data Question url', name: 'data-url', required: false, isShuffleMode: false, type: 'url'}
// {title: 'Data Question tel', name: 'data-tel', required: false, isShuffleMode: false, type: 'tel'}
// {title: 'Data Question email', name: 'data-email', required: false, isShuffleMode: false, type: 'email'}
// {title: 'Data Question date', name: 'data-date', required: false, isShuffleMode: false, type: 'date'}
// {title: 'Data Question number', name: 'data-number', required: false, isShuffleMode: false, type: 'number'}
test('survey export DataQuestion', async ({ page }) => {
  ;['url', 'tel', 'email', 'date', 'number'].map(async (type) => {
    const question = data.questions.find((q) => q.name === `data-${type}`)
    await expect(question).toBeDefined()
    await expect(question.type).toBe(type)
  })
})

// {title: 'How are you satisfied with our service?', name: 'likert1', required: false, isShuffleMode: false, options: Array(5), …}
test('survey export likert1', async ({ page }) => {
  const question = data.questions.find((q) => q.name === 'likert1')
  await expect(question).toBeDefined()
  await expect(question.options.length).toBe(5)
  await expect(question.statements.length).toBe(3)
})

// {title: 'How are you satisfied with our product?', name: 'nps1', required: false, isShuffleMode: false}
test('survey export nps1', async ({ page }) => {
  const question = data.questions.find((q) => q.name === 'nps1')
  await expect(question).toBeDefined()
})

// {title: 'Ranking your favs', name: 'ranking1', required: false, isShuffleMode: false, options: Array(3)}
test('survey export ranking1', async ({ page }) => {
  const question = data.questions.find((q) => q.name === 'ranking1')
  await expect(question).toBeDefined()
  await expect(question.options.length).toBe(3)
})

// {title: 'Rate your experience', name: 'rating1', required: false, isShuffleMode: false, starCount: 5}
// {title: 'Rate your satisfaction', name: 'rating2', required: false, isShuffleMode: false, starCount: 10}
test('survey export rating', async ({ page }) => {
  const question1 = data.questions.find((q) => q.name === 'rating1')
  await expect(question1).toBeDefined()
  await expect(question1.starCount).toBe(5)

  const question2 = data.questions.find((q) => q.name === 'rating2')
  await expect(question2).toBeDefined()
  await expect(question2.starCount).toBe(10)
})

// {title: 'Open Question 1', name: 'open1', required: false, isShuffleMode: false, isMultilines: false, …}
// {title: 'Open Question 2', name: 'open2', required: false, isShuffleMode: false, isMultilines: true, …}
test('survey export open', async ({ page }) => {
  const question1 = data.questions.find((q) => q.name === 'open1')
  await expect(question1).toBeDefined()
  await expect(question1.isMultilines).toBeFalsy()

  const question2 = data.questions.find((q) => q.name === 'open2')
  await expect(question2).toBeDefined()
  await expect(question2.isMultilines).toBeTruthy()
})

// {title: 'Multi Selection Question 1', name: 'multi1', required: false, isShuffleMode: false, options: Array(3)}
test('survey export multi1', async ({ page }) => {
  await page.locator('#multi1 .q-required').check()
  await page.locator('#multi1 .q-shuffle').check()

  await page.locator('.export').click()
  data = JSON.parse(await page.evaluate(() => localStorage.data))
  const question = data.questions.find((q) => q.name === 'multi1')
  await expect(question).toBeDefined()
  await expect(question.options.length).toBe(3)
  await expect(question.required).toBeTruthy()
  await expect(question.isShuffleMode).toBeTruthy()
})

// {title: 'Single Selection Question 1', name: 'single1', required: false, isShuffleMode: false, options: Array(3), …}
test('survey export single1', async ({ page }) => {
  await page.locator('#single1 .q-required').check()
  await page.locator('#single1 .q-select').check()
  await page.locator('#single1 .q-shuffle').check()

  await page.locator('.export').click()
  data = JSON.parse(await page.evaluate(() => localStorage.data))
  const question = data.questions.find((q) => q.name === 'single1')
  await expect(question).toBeDefined()
  await expect(question.options.length).toBe(3)
  await expect(question.required).toBeTruthy()
  await expect(question.isShuffleMode).toBeTruthy()
  await expect(question.isSelectMode).toBeTruthy()
})
