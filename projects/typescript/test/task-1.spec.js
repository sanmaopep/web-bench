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

test('check all type support onchange', async () => {
  const casePath = getCasePath('task-1', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { InputSetter, NumberSetter, CheckboxSetter } from '../../types/setter'

const input: InputSetter = {
  type: "input",
  value: "value",
  onChange: (value: string | undefined) => { console.log('onChange', value) }
}

const num: NumberSetter = {
  type: "number",
  value: 123,
  onChange: (value: number | undefined) => { console.log('onChange', value) }
}

const cbx: CheckboxSetter = {
  type: "checkbox",
  value: true,
  onChange: (value: boolean | undefined) => { console.log('onChange', value) }
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})
test('check input change invalid', async () => {
  const casePath = getCasePath('task-1', 'case-2')
  await writeCaseContent(
    casePath,
    `
import { InputSetter } from '../../types/setter'

const invalid1: InputSetter = {
  type: "input",
  value: "123",
  onChange: (newVal: undefined) => {
    console.log('onChange', newVal)
  }
}

const invalid2: InputSetter = {
  type: "input",
  value: "123",
  onChange: (newVal: string) => {
    console.log('onChange', newVal)
  }
}

const invalid3: InputSetter = {
  type: "input",
  value: "123",
  onChange: (newVal: number | undefined) => {
    console.log('onChange', newVal)
  }
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check number onchange invalid', async () => {
  const casePath = getCasePath('task-1', 'case-3')
  await writeCaseContent(
    casePath,
    `
import { NumberSetter } from '../../types/setter'

const invalid1: NumberSetter = {
  type: "number",
  value: 123,
  onChange: (newVal: undefined) => {
    console.log('onChange', newVal)
  }
}

const invalid2: NumberSetter = {
  type: "number",
  value: 123,
  onChange: (newVal: number) => {
    console.log('onChange', newVal)
  }
}

const invalid3: NumberSetter = {
  type: "number",
  value: 123,
  onChange: (newVal: string | undefined) => {
    console.log('onChange', newVal)
  }
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check checkbox setter invalid', async () => {
  const casePath = getCasePath('task-1', 'case-4')
  await writeCaseContent(
    casePath,
    `
import { CheckboxSetter } from '../../types/setter'

const invalid1: CheckboxSetter = {
  type: "checkbox",
  value: true,
  onChange: (newVal: boolean) => {
    console.log('onChange', newVal)
  }
}

const invalid2: CheckboxSetter = {
  type: "checkbox",
  value: true,
  onChange: (newVal: undefined) => {
    console.log('onChange', newVal)
  }
}

const invalid3: CheckboxSetter = {
  type: "checkbox",
  value: true,
  onChange: (newVal: string | undefined) => {
    console.log('onChange', newVal)
  }
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})
