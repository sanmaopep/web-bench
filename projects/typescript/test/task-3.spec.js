const { test, expect } = require('@playwright/test')
const { writeCaseContent, getCasePath, executeCaseFile, getErrors } = require('./utils')

test('check BaseSetter valid', async () => {
  const casePath = getCasePath('task-3', 'case-1')
  await writeCaseContent(
    casePath,
    `
import { BaseSetter } from '../../types/setter'

const valid: BaseSetter<string> = {
  value: "123",
  onChange: (newVal: string | undefined) => {
    console.log('onChange', newVal)
  }
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check BaseSetter generics invalid', async () => {
  const casePath = getCasePath('task-3', 'case-2')
  await writeCaseContent(
    casePath,
    `
import { BaseSetter } from '../../types/setter'

const invalid: BaseSetter<boolean> = {
  value: "123",
  onChange: (newVal: string | undefined) => {
    console.log('onChange', newVal)
  }
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check BaseSetter value invalid', async () => {
  const casePath = getCasePath('task-3', 'case-3')
  await writeCaseContent(
    casePath,
    `
import { BaseSetter } from '../../types/setter'

const invalid: BaseSetter<string> = {
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

test('check BaseSetter onChange invalid', async () => {
  const casePath = getCasePath('task-3', 'case-4')
  await writeCaseContent(
    casePath,
    `
import { BaseSetter } from '../../types/setter'

const invalid: BaseSetter<string> = {
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

test('check BaseSetter onChange missing', async () => {
  const casePath = getCasePath('task-3', 'case-5')
  await writeCaseContent(
    casePath,
    `
import { BaseSetter } from '../../types/setter'

const invalid: BaseSetter<string> = {
  value: "123",
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check BaseSetter value missing', async () => {
  const casePath = getCasePath('task-3', 'case-7')
  await writeCaseContent(
    casePath,
    `
import { BaseSetter } from '../../types/setter'

const invalid: BaseSetter<string> = {
  onChange: (newVal: string | undefined) => {
    console.log('onChange', newVal)
  }
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check BaseSetter invalid props', async () => {
  const casePath = getCasePath('task-3', 'case-8')
  await writeCaseContent(
    casePath,
    `
import { BaseSetter } from '../../types/setter'

const invalid: BaseSetter<string> = {
  value: "123",
  onChange: (newVal: string | undefined) => {
    console.log('onChange', newVal)
  },
  invalidProps: true
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})

test('check OptionalBaseSetter valid', async () => {
  const casePath = getCasePath('task-3', 'case-9')
  await writeCaseContent(
    casePath,
    `
import { OptionalBaseSetter } from '../../types/setter'

const valid1: OptionalBaseSetter<string> = {
  value: "123",
  onChange: (newVal: string | undefined) => {
    console.log('onChange', newVal)
  }
}

const valid2: OptionalBaseSetter<string> = {
  onChange: (newVal: string | undefined) => {
    console.log('onChange', newVal)
  }
}

const valid3: OptionalBaseSetter<string> = {
  value: "123"
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check value is optional', async () => {
  const casePath = getCasePath('task-3', 'case-10')
  await writeCaseContent(
    casePath,
    `
import { InputSetter } from '../../types/setter'

const input: InputSetter = {
  type: "input",
}
  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})
