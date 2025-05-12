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

test('check array type support', async () => {
  const casePath = getCasePath('task-8', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { ArraySetter, Setter } from '../../types/setter'

const input: ArraySetter<string[]> = {
  type: "array",
  item: {
    type: "input"
  },
  value: ["string"],
}

const num: ArraySetter<number[]> = {
  type: "array",
  item: {
    type: "number"
  },
  value: [123, 456],
}

const cbx: ArraySetter<boolean[]> = {
  type: "array",
  item: {
    type: "checkbox"
  },
  value: [true],
}

const inputSetter: Setter = input
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})
test('check array setter missing item type', async () => {
  const casePath = getCasePath('task-8', 'case-2')
  await writeCaseContent(
    casePath,
    `
import { ArraySetter } from '../../types/setter'

const invalid: ArraySetter<number[]> = {
  type: "array",
  value: [123]
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check array setter item type error', async () => {
  const casePath = getCasePath('task-8', 'case-3')
  await writeCaseContent(
    casePath,
    `
import { ArraySetter } from '../../types/setter'

const invalid2: ArraySetter<string[]> = {
  type: "array",
  item: "test-type",
  value: ["233"]
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check array setter invalid props', async () => {
  const casePath = getCasePath('task-8', 'case-4')
  await writeCaseContent(
    casePath,
    `
import { ArraySetter } from '../../types/setter'

const invalid: ArraySetter = {
  type: "array",
  item: "input",
  value: ["233"]
  invalidProps: true,
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check array value type mismatch with item type', async () => {
  const casePath = getCasePath('task-8', 'case-5')
  await writeCaseContent(
    casePath,
    `
import { ArraySetter } from '../../types/setter'


const invalid: ArraySetter<boolean[]> = {
  type: 'array',
  item: {
    type: 'checkbox',
  },
  value: ['str'],
}


  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check recursive array valid', async () => {
  const casePath = getCasePath('task-8', 'case-6')
  await writeCaseContent(
    casePath,
    `
import { ArraySetter } from '../../types/setter'

const valid: ArraySetter<string[][]> = {
  type: 'array',
  item: {
    type: 'array',
    item: {
      type: "input"
    }
  },
  value: [["str"]],
}


  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})
