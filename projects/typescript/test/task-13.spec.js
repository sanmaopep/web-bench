const { test, expect } = require('@playwright/test')
const { writeCaseContent, getCasePath, executeCaseFile, getErrors } = require('./utils')

test('check form schema valid', async () => {
  const casePath = getCasePath('task-13', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { FormSchema } from '../../types/schema'

const schema1: FormSchema<{ a: string, b: number, c: boolean }> = {
  fields: {
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
}

const schema2: FormSchema<{
  a: number
  b: string
  c: boolean
  d: {
    v: string[]
  }
}> = {
  fields:  {
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
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check form schema invalid', async () => {
  const casePath = getCasePath('task-13', 'case-2')
  await writeCaseContent(
    casePath,
    `
import { FormSchema } from '../../types/schema'

const schema1: FormSchema<{ a: string, b: number, c: boolean }> = {
  fields: {
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
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check ExpressionEvent valid', async () => {
  const casePath = getCasePath('task-13', 'case-3')
  await writeCaseContent(
    casePath,
    `
import { ExpressionEvent } from '../../types/setter'

const expr: Partial<ExpressionEvent<string, { name: string }>> = {
  value: "str",
  formValue: {
    name: "str"
  }
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check ExpressionEvent form value invalid', async () => {
  const casePath = getCasePath('task-13', 'case-4')
  await writeCaseContent(
    casePath,
    `
import { ExpressionEvent } from '../../types/setter'

const expr: Partial<ExpressionEvent<() => string, { name: string }>> = {
  value: () =>  "str",
  formValue: "str"
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check ExpressionEvent setter value invalid', async () => {
  const casePath = getCasePath('task-13', 'case-5')
  await writeCaseContent(
    casePath,
    `
import { ExpressionEvent } from '../../types/setter'

const expr: Partial<ExpressionEvent<string, string>> = {
  value: "str",
  formValue: "str"
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check ExpressionEvent form generic invalid', async () => {
  const casePath = getCasePath('task-13', 'case-6')
  await writeCaseContent(
    casePath,
    `
    import { ExpressionEvent } from '../../types/setter'

    const expr: Partial<ExpressionEvent> = {
      value: "str",
      formValue: {
        name: "str"
      }
    }
    
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check Expression valid', async () => {
  const casePath = getCasePath('task-13', 'case-7')
  await writeCaseContent(
    casePath,
    `
import { Expression } from '../../types/setter'

const expr: Expression<string, { name: string }, string> = {
  type: 'expression',
  value: (ctx: { value: string, formValue: { name: string } }) => ctx.value
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check Expression invalid', async () => {
  const casePath = getCasePath('task-13', 'case-8')
  await writeCaseContent(
    casePath,
    `
import { Expression } from '../../types/setter'

const expr: Expression<string, { name: string }, string> = {
  type: 'expression',
  value: (ctx: { value: string, formValue: string }) => ctx.value
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check SetterMaybeExpression valid', async () => {
  const casePath = getCasePath('task-13', 'case-9')
  await writeCaseContent(
    casePath,
    `
import { Expression, SetterMaybeExpression } from '../../types/setter'

const expr: SetterMaybeExpression<string, { name: string }, string> = {
  type: 'expression',
  value: (ctx: { value: string, formValue: { name: string } }) => ctx.value
}

const expr1: SetterMaybeExpression<string, { name: string }, string> = "23"

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})
