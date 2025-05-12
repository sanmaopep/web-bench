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

test('check EditorRef setSetterValueByPath type valid', async () => {
  const casePath = getCasePath('task-20', 'case-1')
  await writeCaseContent(
    casePath,
    `
    import { EditorRef } from '../../types/schema'

    type TestValue = {
      name: string
    
      object: {
        age: number
      }
    }
    
    const a: EditorRef<TestValue> = {} as any

    a.setSetterValueByPath<['object']>(['object'], { age: 12 })


  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check EditorRef setSetterValueByPath type invalid', async () => {
  const casePath = getCasePath('task-20', 'case-2')
  await writeCaseContent(
    casePath,
    `
    import { EditorRef } from '../../types/schema'

    type TestValue = {
      name: string
    
      object: {
        age: number
      }
    }
    
    const a: EditorRef<TestValue> = {} as any

    a.setSetterValueByPath<['object']>(['object'], { age: "12" })


  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})
