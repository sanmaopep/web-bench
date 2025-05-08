const { test, expect } = require('@playwright/test')
const { writeCaseContent, getCasePath, executeCaseFile, getErrors } = require('./utils')

test('check password  valid', async () => {
  const casePath = getCasePath('task-6', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { PasswordSetter, ValueSetter, Setter } from '../../types/setter'

const password: PasswordSetter = {
  type: "password",
  value: "value"
}

const setter: Setter = password

const value: ValueSetter<string> = {
  type: "password"
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})
test('check password type invalid', async () => {
  const casePath = getCasePath('task-6', 'case-2')
  await writeCaseContent(
    casePath,
    `
import { PasswordSetter } from '../../types/setter'

const invalid: PasswordSetter = {
  type: "input",
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check password value invalid', async () => {
  const casePath = getCasePath('task-6', 'case-3')
  await writeCaseContent(
    casePath,
    `
import { PasswordSetter } from '../../types/setter'

const invalid: PasswordSetter = {
  type: "password",
  value: 1,
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})
