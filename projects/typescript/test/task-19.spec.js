const { test, expect } = require('@playwright/test')
const { writeCaseContent, getCasePath, executeCaseFile, getErrors } = require('./utils')

test('check custom setter type valid', async () => {
  const casePath = getCasePath('task-19', 'case-1')
  await writeCaseContent(
    casePath,
    `
    import { FormSchema } from '../../types/schema'
    import { CustomSetterRender } from '../../types/setter'
    import * as React from 'react'
    
    type TestCustomRenderDefs = {
      customSetterA: CustomSetterRender<string, { test: string }>
    }
    
    type TestValue = {
      name: string
    }
    type Schema = FormSchema<TestValue, TestCustomRenderDefs>
    
    const schema: Schema = {
      fields: {
        type: 'object',
        properties: {
          name: {
            type: 'custom',
            customType: 'customSetterA',
          }
        },
      },
      customSetterRenderDefinitions: {
        customSetterA: {
          render: ({ test }) => {
            return React.createElement('p', {})
          },
        }
      },
    }

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check custom setter type invalid', async () => {
  const casePath = getCasePath('task-19', 'case-2')
  await writeCaseContent(
    casePath,
    `
    import * as React from 'react'

    type TestCustomRenderDefs = {
      ['customSetter-a']: CustomSetterRender<string, { test: string }>
    }
    
    type TestValue = {
      name: string
    }
    type Schema = FormSchema<TestValue, TestCustomRenderDefs>
    
    const schema: Schema = {
      fields: {
        type: 'object',
        properties: {
          name: {
            type: 'custom',
            customType: 'customSetter-a',
          },
        },
      },
      customSetterRenderDefinitions: {
        ['customSetter-a']: {
          render: ({ test }) => {
            return React.createElement('p', {})
          },
        }
      },
    }
    
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})
