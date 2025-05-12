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

test('check select setter string valid', async () => {
  const casePath = getCasePath('task-7', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { SelectSetter, ValueSetter, Setter } from '../../types/setter'

const select: SelectSetter = {
  type: "select",
  value: "value"
}

const setter: Setter = select

const value: ValueSetter<string> = {
  type: "select"
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check select setter number valid', async () => {
  const casePath = getCasePath('task-7', 'case-2')
  await writeCaseContent(
    casePath,
    `
import { SelectSetter, ValueSetter, Setter } from '../../types/setter'

const select: SelectSetter = {
  type: "select",
  value: 123
}

const setter: Setter = select

const value: ValueSetter<number> = {
  type: "select"
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check select setter boolean invalid', async () => {
  const casePath = getCasePath('task-7', 'case-3')
  await writeCaseContent(
    casePath,
    `
import { SelectSetter, ValueSetter, Setter } from '../../types/setter'

const select: SelectSetter = {
  type: "select",
  value: true
}

const setter: Setter = select

const value: ValueSetter<true> = {
  type: "select"
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})
