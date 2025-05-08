const { test, expect } = require('@playwright/test')
const { writeCaseContent, getCasePath, executeCaseFile, getErrors } = require('./utils')

test('check all type support', async () => {
  const casePath = getCasePath('init', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { InputSetter, NumberSetter, CheckboxSetter, Setter } from '../../types/setter'

const input: InputSetter = {
  type: "input",
  value: "value"
}

const num: NumberSetter = {
  type: "number",
  value: 123
}

const cbx: CheckboxSetter = {
  type: "checkbox",
  value: true
}

const inputSetter: Setter = input
const numberSetter: Setter = num
const checkboxSetter: Setter = cbx
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})
test('check input setter invalid', async () => {
  const casePath = getCasePath('init', 'case-2')
  await writeCaseContent(
    casePath,
    `
import { InputSetter } from '../../types/setter'

const invalid1: InputSetter = {
  type: "input",
  value: 123
}

const invalid2: InputSetter = {
  type: "input",
  value: true
}

const invalid3: InputSetter = {
  type: "number",
  value: "str"
}

const invalid4: InputSetter = {
  type: "number",
  value: "str",
  invalidProps: true,
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check number setter invalid', async () => {
  const casePath = getCasePath('init', 'case-3')
  await writeCaseContent(
    casePath,
    `
import { NumberSetter } from '../../types/setter'

const invalid1: NumberSetter = {
  type: "number",
  value: "str"
}

const invalid2: NumberSetter = {
  type: "number",
  value: true
}

const invalid3: NumberSetter = {
  type: "checkbox",
  value: 123
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check checkbox setter invalid', async () => {
  const casePath = getCasePath('init', 'case-4')
  await writeCaseContent(
    casePath,
    `
import { CheckboxSetter } from '../../types/setter'

const invalid1: CheckboxSetter = {
  type: "checkbox",
  value: 123
}

const invalid2: CheckboxSetter = {
  type: "checkbox",
  value: "str"
}

const invalid3: CheckboxSetter = {
  type: "number",
  value: true
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})
