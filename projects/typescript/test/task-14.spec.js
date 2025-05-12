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
