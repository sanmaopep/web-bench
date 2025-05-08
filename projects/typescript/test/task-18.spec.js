const { test, expect } = require('@playwright/test')
const { writeCaseContent, getCasePath, executeCaseFile, getErrors } = require('./utils')

test('check setter ctxValue in array type valid', async () => {
  const casePath = getCasePath('task-18', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { FormSchema } from '../../types/schema'
import { Setter, ArraySetter } from '../../types/setter'
import * as React from 'react'

const setter: ArraySetter<string[]> = {
  type: 'array',
  item: {
    type: 'input',
    value: {
      type: 'expression',
      value: ({ ctxValue }) => {
        return ctxValue!
      },
    },
  },
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check setter ctxValue not in array type valid', async () => {
  const casePath = getCasePath('task-18', 'case-2')
  await writeCaseContent(
    casePath,
    `
import { FormSchema } from '../../types/schema'
import { Setter } from '../../types/setter'
import * as React from 'react'

const setter: Setter<{ name: string; checked: boolean }, { name: string; checked: boolean }> = {
  type: 'object',
  properties: {
    name: {
      type: 'input',
    },
    checked: {
      type: 'checkbox',
      visible: {
        type: 'expression',
        value: (ctx) => ctx.ctxValue!.checked,
      },
    },
  },
}


  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check setter ctxValue not in array type invalid', async () => {
  const casePath = getCasePath('task-18', 'case-3')
  await writeCaseContent(
    casePath,
    `
import { FormSchema } from '../../types/schema'
import { Setter } from '../../types/setter'
import * as React from 'react'

const setter: Setter<{ name: string; checked: boolean }, { name: string; checked: boolean }> = {
  type: 'object',
  properties: {
    name: {
      type: 'input',
    },
    checked: {
      type: 'checkbox',
      visible: {
        type: 'expression',
        value: (ctx) => ctx.ctxValue!,
      },
    },
  },
}


  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check setter ctxValue in recursive setter valid', async () => {
  const casePath = getCasePath('task-18', 'case-4')
  await writeCaseContent(
    casePath,
    `
import { FormSchema } from '../../types/schema'
import { Setter } from '../../types/setter'
import * as React from 'react'

const setter: Setter<{
  users: {
    name: string
    checked: boolean

    parents: string[]
  }[]
}> = {
  type: 'object',
  properties: {
    users: {
      type: 'array',
      item: {
        type: 'object',
        properties: {
          name: {
            type: 'input',
          },
          checked: {
            type: 'checkbox',
            visible: {
              type: 'expression',
              value: (ctx) => ctx.ctxValue!.checked,
            },
          },
          parents: {
            type: 'array',
            item: {
              type: 'input',
              value: {
                type: 'expression',
                value: ({ ctxValue }) => {
                  return ctxValue!
                },
              },
            },
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

test('check setter ctxValue in schema type valid', async () => {
  const casePath = getCasePath('task-18', 'case-5')
  await writeCaseContent(
    casePath,
    `
import { FormSchema } from '../../types/schema'
import { Setter } from '../../types/setter'
import * as React from 'react'

const schema: FormSchema<{ users: { name: string; checked: boolean }[] }> = {
  fields: {
    type: 'object',
    properties: {
      users: {
        type: 'array',
        item: {
          type: 'object',
          properties: {
            name: {
              type: 'input',
            },
            checked: {
              type: 'checkbox',
              visible: {
                type: 'expression',
                value: (ctx) => ctx.ctxValue!.checked,
              },
            },
          },
        },
      },
    },
    visible: {
      type: 'expression',
      value: (ctx) => {
        return ctx.ctxValue!.users[0].checked
      },
    },
  },
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check setter ctxValue in schema type invalid', async () => {
  const casePath = getCasePath('task-18', 'case-6')
  await writeCaseContent(
    casePath,
    `
import { FormSchema } from '../../types/schema'
import { Setter } from '../../types/setter'
import * as React from 'react'

const schema: FormSchema<{ users: { name: string; checked: boolean }[] }> = {
  fields: {
    type: 'object',
    properties: {
      users: {
        type: 'array',
        item: {
          type: 'object',
          properties: {
            name: {
              type: 'input',
            },
            checked: {
              type: 'checkbox',
              visible: {
                type: 'expression',
                value: (ctx) => ctx.ctxValue!,
              },
            },
          },
        },
      },
    },
    visible: {
      type: 'expression',
      value: (ctx) => {
        return ctx.ctxValue!.users[0].checked
      },
    },
  },
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})
