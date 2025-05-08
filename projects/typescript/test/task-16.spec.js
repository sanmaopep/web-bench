const { test, expect } = require('@playwright/test')
const { writeCaseContent, getCasePath, executeCaseFile, getErrors } = require('./utils')

test('check definition of custom type valid', async () => {
  const casePath = getCasePath('task-16', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { FormSchema } from '../../types/schema'
import { CustomSetterRender } from '../../types/setter'
import * as React from 'react'

type TestCustomRenderDefs = {
  customSetterA: CustomSetterRender<string, { test: string }>
}

type TestValue = {
  name: string
}
type Schema = FormSchema<TestValue, TestCustomRenderDefs>

const schema: Schema = {
  fields: {
    type: 'object',
    properties: {
      name: {
        type: 'custom',
        customType: 'customSetterA',
      }
    },
  },
  customSetterRenderDefinitions: {
    customSetterA: {
      render: ({ test }) => {
        return React.createElement('p', {})
      },
    }
  },
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check definition of recursive custom type valid', async () => {
  const casePath = getCasePath('task-16', 'case-2')
  await writeCaseContent(
    casePath,
    `
import { FormSchema } from '../../types/schema'
import { CustomSetterRender } from '../../types/setter'
import * as React from 'react'

type TestCustomRenderDefs = {
  customSetterA: CustomSetterRender<string, { test: string }>
}

type TestValue = {
  name: string
  obj: {
    val: string
  }
}
type Schema = FormSchema<TestValue, TestCustomRenderDefs>

const schema: Schema = {
  fields: {
    type: 'object',
    properties: {
      name: {
        type: 'custom',
        customType: 'customSetterA',
      },
      obj: {
        type: 'object',
        properties: {
          val: {
            type: 'custom',
            customType: 'customSetterA',
          },
        },
      },
    },
  },
  customSetterRenderDefinitions: {
    customSetterA: {
      render: ({ test }) => {
        return React.createElement('p', {})
      },
    }
  },
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check definition of custom type invalid', async () => {
  const casePath = getCasePath('task-16', 'case-3')
  await writeCaseContent(
    casePath,
    `
import { FormSchema } from '../../types/schema'
import { CustomSetterRender } from '../../types/setter'
import * as React from 'react'

type TestCustomRenderDefs = {
  customSetterA: CustomSetterRender<string, { test: string }>
}

type TestValue = {
  name: string
}
type Schema = FormSchema<TestValue, TestCustomRenderDefs>

const schema: Schema = {
  fields: {
    type: 'object',
    properties: {
      name: {
        type: 'custom',
        customType: 'customSetterB',
      }
    },
  },
  customSetterRenderDefinitions: {
    customSetterA: {
      render: ({ test }) => {
        return React.createElement('p', {})
      },
    }
  },
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check definition of recursive custom type invalid', async () => {
  const casePath = getCasePath('task-16', 'case-4')
  await writeCaseContent(
    casePath,
    `
import { FormSchema } from '../../types/schema'
import { CustomSetterRender } from '../../types/setter'
import * as React from 'react'

type TestCustomRenderDefs = {
  customSetterA: CustomSetterRender<string, { test: string }>
}

type TestValue = {
  name: string
  obj: {
    val: string
  }
}
type Schema = FormSchema<TestValue, TestCustomRenderDefs>

const schema: Schema = {
  fields: {
    type: 'object',
    properties: {
      name: {
        type: 'custom',
        customType: 'customSetterA',
      },
      obj: {
        type: 'object',
        properties: {
          val: {
            type: 'custom',
            customType: 'customSetterB',
          },
        },
      },
    },
  },
  customSetterRenderDefinitions: {
    customSetterA: {
      render: ({ test }) => {
        return React.createElement('p', {})
      },
    }
  },
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})
