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

test('check setter support object setter', async () => {
  const casePath = getCasePath('task-12', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { Setter } from '../../types/setter'

const object1: Setter<{ a: string, b: number, c: boolean }> = {
  type: "object",
  properties: {
    a: {
      type: "input"
    },
    b: {
      type: "number"
    },
    c: {
      type: "checkbox"
    },
  },
  value: { a: "str", b: 12, c: true },
}

const valid: Setter<{
  a: number
  b: string
  c: boolean
  d: {
    v: string[]
  }
}> = {
    type: 'object',
    properties: {
      a: {
        type: 'number',
      },
      b: {
        type: 'input',
      },
      c: {
        type: 'checkbox',
      },
      d: {
        type: 'object',
        properties: {
          v: {
            type: 'array',
            item: {
              type: 'input',
            },
          },
        },
      },
    },
  }

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check setter support object setter properties type error', async () => {
  const casePath = getCasePath('task-12', 'case-2')
  await writeCaseContent(
    casePath,
    `
    import { Setter } from '../../types/setter'


    const invalid: Setter<{ a: string, b: number, c: boolean }> = {
      type: "object",
      properties: {
        a: {
          type: "number"
        },
        b: {
          type: "number"
        },
        c: {
          type: "checkbox"
        },
      },
      value: { a: "str", b: 12, c: true },
    }

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check setter support array setter', async () => {
  const casePath = getCasePath('task-12', 'case-3')
  await writeCaseContent(
    casePath,
    `
import { Setter } from '../../types/setter'

const input: Setter<string[]> = {
  type: "array",
  item: {
    type: "input"
  },
  value: ["string"],
}

const valid: Setter<string[][]> = {
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

test('check setter support array setter item type error', async () => {
  const casePath = getCasePath('task-12', 'case-4')
  await writeCaseContent(
    casePath,
    `
    import { Setter } from '../../types/setter'

    const invalid: Setter<boolean> = {
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

test('check setter support setter without generic valid', async () => {
  const casePath = getCasePath('task-12', 'case-5')
  await writeCaseContent(
    casePath,
    `
import { Setter } from '../../types/setter'

const input: Setter = {
  type: "input",
  value: "str"
}

  `
  )
  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check setter support custom setter', async () => {
  const casePath = getCasePath('task-12', 'case-6')
  await writeCaseContent(
    casePath,
    `
import { Setter } from '../../types/setter'

const customSetter: Setter<string> = {
  type: "custom",
  customType: "custom1"
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check setter support custom setter error', async () => {
  const casePath = getCasePath('task-12', 'case-7')
  await writeCaseContent(
    casePath,
    `
import { Setter } from '../../types/setter'

const customSetter: Setter<string> = {
  type: "custom",
  customType: "custom1",
  value: 123
}

  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})
