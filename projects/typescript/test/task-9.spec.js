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

test('check tuple type support', async () => {
  const casePath = getCasePath('task-9', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { TupleSetter, Setter } from '../../types/setter'

const input: TupleSetter<[string, number, boolean]> = {
  type: 'tuple',
  items: [
    {
      type: 'input',
    },
    {
      type: 'number',
    },
    {
      type: 'checkbox',
    },
  ],
  value: ['string', 1, true],
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check tuple items type error', async () => {
  const casePath = getCasePath('task-9', 'case-2')
  await writeCaseContent(
    casePath,
    `
import { TupleSetter, Setter } from '../../types/setter'

const input: TupleSetter<[string, number, boolean]> = {
  type: 'tuple',
  items: [
    {
      type: 'input',
    },
    {
      type: 'input',
    },
    {
      type: 'checkbox',
    },
  ],
  value: ['string', 1, true],
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})
