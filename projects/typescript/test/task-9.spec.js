const { test, expect } = require('@playwright/test')
const { writeCaseContent, getCasePath, executeCaseFile, getErrors } = require('./utils')

test('check tuple type support', async () => {
  const casePath = getCasePath('task-9', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { TupleSetter, Setter } from '../../types/setter'

const input: TupleSetter<[string, number, boolean]> = {
  type: 'tuple',
  items: [
    {
      type: 'input',
    },
    {
      type: 'number',
    },
    {
      type: 'checkbox',
    },
  ],
  value: ['string', 1, true],
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check tuple items type error', async () => {
  const casePath = getCasePath('task-9', 'case-2')
  await writeCaseContent(
    casePath,
    `
import { TupleSetter, Setter } from '../../types/setter'

const input: TupleSetter<[string, number, boolean]> = {
  type: 'tuple',
  items: [
    {
      type: 'input',
    },
    {
      type: 'input',
    },
    {
      type: 'checkbox',
    },
  ],
  value: ['string', 1, true],
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})
