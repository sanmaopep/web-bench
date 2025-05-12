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

test('check custom setter support', async () => {
  const casePath = getCasePath('task-11', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { CustomSetter, Setter } from '../../types/setter'

const customSetter: CustomSetter<string> = {
  type: "custom",
  customType: "type_1",
}


const setter: Setter = customSetter
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check custom setter type is input', async () => {
  const casePath = getCasePath('task-11', 'case-2')
  await writeCaseContent(
    casePath,
    `
    import { CustomSetter, ValueSetter } from '../../types/setter'

    const custom1Setter: ValueSetter<string> = {
      type: "custom",
      customType: "type_1",
    }

    const custom2Setter: ValueSetter<boolean> = {
      type: "custom",
      customType: "type_1",
    }

    const custom3Setter: ValueSetter<number> = {
      type: "custom",
      customType: "type_1",
    }

    const custom4Setter: ValueSetter<number[]> = {
      type: "custom",
      customType: "type_1",
    }

    const custom5Setter: ValueSetter<{ name: string }> = {
      type: "custom",
      customType: "type_1",
    }
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})
