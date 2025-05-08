const { test, expect } = require('@playwright/test')
const { writeCaseContent, getCasePath, executeCaseFile, getErrors } = require('./utils')

test('check definition of custom setter render valid', async () => {
  const casePath = getCasePath('task-15', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { FormSchema } from '../../types/schema'
import { CustomSetterRender } from '../../types/setter'
import * as React from 'react'

type TestCustomRenderDefs = {
  customType: CustomSetterRender<string, { test: string }>
}

type FormValue = { name: string }
type Schema = FormSchema<FormValue, TestCustomRenderDefs>

const schema: Schema = {
  fields: {
    type: 'object',
    properties: {
      name: {
        type: 'input',
      },
    },
  },
  customSetterRenderDefinitions: {
    customType: {
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

test('check form schema provide form key mismatch', async () => {
  const casePath = getCasePath('task-15', 'case-2')
  await writeCaseContent(
    casePath,
    `
    import { FormSchema } from '../../types/schema'
    import { CustomSetterRender } from '../../types/setter'
    import * as React from 'react'
    
    type TestCustomRenderDefs = {
      customType: CustomSetterRender<string, { test: string }>
    }
    
    type FormValue = { name: string }
    type Schema = FormSchema<FormValue, TestCustomRenderDefs>
    
    const schema: Schema = {
      fields: {
        type: 'object',
        properties: {
          name: {
            type: 'input',
          },
        },
      },
      customSetterRenderDefinitions: {
        test: {
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

test('check form schema provide form function param mismatch', async () => {
  const casePath = getCasePath('task-15', 'case-3')
  await writeCaseContent(
    casePath,
    `
    import { FormSchema } from '../../types/schema'
    import { CustomSetterRender } from '../../types/setter'
    import * as React from 'react'
    
    type TestCustomRenderDefs = {
      customType: CustomSetterRender<string, { test: string }>
    }
    
    type FormValue = { name: string }
    type Schema = FormSchema<FormValue, TestCustomRenderDefs>
    
    const schema: Schema = {
      fields: {
        type: 'object',
        properties: {
          name: {
            type: 'input',
          },
        },
      },
      customSetterRenderDefinitions: {
        test: {
          render: ({ test }: { test: boolean }) => {
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
