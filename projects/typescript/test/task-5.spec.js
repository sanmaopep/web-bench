const { test, expect } = require('@playwright/test')
const { writeCaseContent, getCasePath, executeCaseFile, getErrors } = require('./utils')

test('check all type value valid', async () => {
  const casePath = getCasePath('task-5', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { ValueSetter } from '../../types/setter'

const input: ValueSetter<string> = {
  type: "input"
}

const number: ValueSetter<number> = {
  type: "number"
}

const checkbox: ValueSetter<boolean> = {
  type: "checkbox"
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})
test('check string type value invalid', async () => {
  const casePath = getCasePath('task-5', 'case-2')
  await writeCaseContent(
    casePath,
    `
    import { ValueSetter } from '../../types/setter'

    const invalid1: ValueSetter<number> = {
      type: "string"
    }

    const invalid2: ValueSetter<boolean> = {
      type: "string"
    }  
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check number type value invalid', async () => {
  const casePath = getCasePath('task-5', 'case-3')
  await writeCaseContent(
    casePath,
    `
    import { ValueSetter } from '../../types/setter'

    const invalid1: ValueSetter<string> = {
      type: "number"
    }

    const invalid2: ValueSetter<boolean> = {
      type: "number"
    }  
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check boolean type value invalid', async () => {
  const casePath = getCasePath('task-5', 'case-4')
  await writeCaseContent(
    casePath,
    `
    import { ValueSetter } from '../../types/setter'

    const invalid1: ValueSetter<string> = {
      type: "boolean"
    }

    const invalid2: ValueSetter<number> = {
      type: "boolean"
    }  
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})
