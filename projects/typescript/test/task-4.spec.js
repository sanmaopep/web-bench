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

test('check SetterValueType and BaseSetter valid', async () => {
  const casePath = getCasePath('task-4', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { SetterValueType, BaseSetter } from '../../types/setter'

const valid: SetterValueType  = 'str'
const validSetter: BaseSetter<typeof valid>  = {
  value: 'str',
  onChange: (val: string) => val
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check SetterValueType type invalid', async () => {
  const casePath = getCasePath('task-4', 'case-2')
  await writeCaseContent(
    casePath,
    `
import { SetterValueType, BaseSetter } from '../../types/setter'

const fn = () => 'test fn'
const valid: SetterValueType<typeof fn>  = fn
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check BaseSetter type invalid', async () => {
  const casePath = getCasePath('task-4', 'case-3')
  await writeCaseContent(
    casePath,
    `
import { BaseSetter } from '../../types/setter'

const fn = () => 'test fn'
const valid: BaseSetter<typeof fn> = {
  value:  fn,
  onChange: (val: typeof fn) => val
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})
