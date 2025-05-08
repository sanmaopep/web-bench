const { test, expect } = require('@playwright/test')
const { writeCaseContent, getCasePath, executeCaseFile, getErrors } = require('./utils')

test('check visible prop valid and optional', async () => {
  const casePath = getCasePath('task-14', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { Setter } from '../../types/setter'

type FormValue = { a: string, b: number, c: boolean }

const setter1: Setter<boolean, FormValue> = {
  type: 'checkbox',
  visible: true,
}

const setter2: Setter<boolean, FormValue> = {
  type: 'checkbox',
  visible: {
    type: 'expression',
    value: (ctx) => {
      return ctx.value
    },
  },
}

const setter3: Setter<boolean> = {
  type: 'checkbox',
}

const setter4: Setter<boolean, FormValue> = {
  type: 'checkbox',
  visible: {
    type: 'expression',
    value: (ctx) => {
      return ctx.formValue.c
    },
  },
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check form schema provide form value', async () => {
  const casePath = getCasePath('task-14', 'case-2')
  await writeCaseContent(
    casePath,
    `
import { FormSchema } from '../../types/schema'

type FormValue = { a: string, b: number, c: boolean }

const schema1: FormSchema<FormValue> = {
  fields: {
    type: "object",
    properties: {
      a: {
        type: "input"
      },
      b: {
        type: "number",
        visible: {
          type: 'expression',
          value: (ctx) => {
            return ctx.formValue.c
          },
        },
      },
      c: {
        type: "checkbox"
      },
    },
    value: { a: "str", b: 12, c: true },
  }
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})
