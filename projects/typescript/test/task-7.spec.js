const { test, expect } = require('@playwright/test')
const { writeCaseContent, getCasePath, executeCaseFile, getErrors } = require('./utils')

test('check select setter string valid', async () => {
  const casePath = getCasePath('task-7', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { SelectSetter, ValueSetter, Setter } from '../../types/setter'

const select: SelectSetter = {
  type: "select",
  value: "value"
}

const setter: Setter = select

const value: ValueSetter<string> = {
  type: "select"
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check select setter number valid', async () => {
  const casePath = getCasePath('task-7', 'case-2')
  await writeCaseContent(
    casePath,
    `
import { SelectSetter, ValueSetter, Setter } from '../../types/setter'

const select: SelectSetter = {
  type: "select",
  value: 123
}

const setter: Setter = select

const value: ValueSetter<number> = {
  type: "select"
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check select setter boolean invalid', async () => {
  const casePath = getCasePath('task-7', 'case-3')
  await writeCaseContent(
    casePath,
    `
import { SelectSetter, ValueSetter, Setter } from '../../types/setter'

const select: SelectSetter = {
  type: "select",
  value: true
}

const setter: Setter = select

const value: ValueSetter<true> = {
  type: "select"
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})
