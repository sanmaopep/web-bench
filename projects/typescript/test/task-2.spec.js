const { test, expect } = require('@playwright/test')
const { writeCaseContent, getCasePath, executeCaseFile, getErrors } = require('./utils')

test('check isInputSetter valid', async () => {
  const casePath = getCasePath('task-2', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { Setter } from '../../types/setter'
import { isInputSetter } from '../../types/setter-check'


const value: Setter = { type: 'input', value: 'str' }
if (isInputSetter(value)) {
  const newVal: typeof value = { type: 'input', value: 'str' }
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check isInputSetter invalid', async () => {
  const casePath = getCasePath('task-2', 'case-2')
  await writeCaseContent(
    casePath,
    `
import { Setter } from '../../types/setter'
import { isInputSetter } from '../../types/setter-check'


const value: Setter = { type: 'input', value: 'str' }
if (isInputSetter(value)) {
  const newVal: typeof value = { type: 'number', value: 123 }
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})
