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
