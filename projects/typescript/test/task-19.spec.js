// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
