const { test, expect } = require('@playwright/test')
const { writeCaseContent, getCasePath, executeCaseFile, getErrors } = require('./utils')

test('check object type support', async () => {
  const casePath = getCasePath('task-10', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { ObjectSetter, Setter } from '../../types/setter'

const object1: ObjectSetter<{ a: string, b: number, c: boolean }> = {
  type: "object",
  properties: {
    a: {
      type: "input"
    },
    b: {
      type: "number"
    },
    c: {
      type: "checkbox"
    },
  },
  value: { a: "str", b: 12, c: true },
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})
test('check object setter missing properties type', async () => {
  const casePath = getCasePath('task-10', 'case-2')
  await writeCaseContent(
    casePath,
    `
import { ObjectSetter } from '../../types/setter'

const invalid: ObjectSetter<{ a: string, b: number, c: boolean }> = {
  type: "object",
  value: { a: "str", b: 12, c: true }
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check object setter properties type error', async () => {
  const casePath = getCasePath('task-10', 'case-4')
  await writeCaseContent(
    casePath,
    `
    import { ObjectSetter } from '../../types/setter'


    const invalid: ObjectSetter<{ a: string, b: number, c: boolean }> = {
      type: "object",
      properties: {
        a: {
          type: "number"
        },
        b: {
          type: "number"
        },
        c: {
          type: "checkbox"
        },
      },
      value: { a: "str", b: 12, c: true },
    }

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check array value type mismatch with item type', async () => {
  const casePath = getCasePath('task-10', 'case-5')
  await writeCaseContent(
    casePath,
    `
import { ObjectSetter } from '../../types/setter'


const invalid: ObjectSetter<{ a: string, b: number, c: boolean }> = {
  type: "object",
  properties: {
    a: {
      type: "input"
    },
    b: {
      type: "number"
    },
    c: {
      type: "checkbox"
    },
  },
  value: { a: "str", b: 12 },
}


  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check recursive object valid', async () => {
  const casePath = getCasePath('task-10', 'case-6')
  await writeCaseContent(
    casePath,
    `
import { ObjectSetter } from '../../types/setter'

const valid: ObjectSetter<{
  a: number
  b: string
  c: boolean
  d: {
    v: string[]
  }
}> = {
    type: 'object',
    properties: {
      a: {
        type: 'number',
      },
      b: {
        type: 'input',
      },
      c: {
        type: 'checkbox',
      },
      d: {
        type: 'object',
        properties: {
          v: {
            type: 'array',
            item: {
              type: 'input',
            },
          },
        },
      },
    },
  }

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})
