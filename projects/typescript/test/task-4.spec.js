const { test, expect } = require('@playwright/test')
const { writeCaseContent, getCasePath, executeCaseFile, getErrors } = require('./utils')

test('check SetterValueType and BaseSetter valid', async () => {
  const casePath = getCasePath('task-4', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { SetterValueType, BaseSetter } from '../../types/setter'

const valid: SetterValueType  = 'str'
const validSetter: BaseSetter<typeof valid>  = {
  value: 'str',
  onChange: (val: string) => val
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check SetterValueType type invalid', async () => {
  const casePath = getCasePath('task-4', 'case-2')
  await writeCaseContent(
    casePath,
    `
import { SetterValueType, BaseSetter } from '../../types/setter'

const fn = () => 'test fn'
const valid: SetterValueType<typeof fn>  = fn
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check BaseSetter type invalid', async () => {
  const casePath = getCasePath('task-4', 'case-3')
  await writeCaseContent(
    casePath,
    `
import { BaseSetter } from '../../types/setter'

const fn = () => 'test fn'
const valid: BaseSetter<typeof fn> = {
  value:  fn,
  onChange: (val: typeof fn) => val
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})
