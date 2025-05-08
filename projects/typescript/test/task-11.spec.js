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
