const { test, expect } = require('@playwright/test')
const { writeCaseContent, getCasePath, executeCaseFile, getErrors } = require('./utils')

test('check EditorRef setSetterValueByPath type valid', async () => {
  const casePath = getCasePath('task-20', 'case-1')
  await writeCaseContent(
    casePath,
    `
    import { EditorRef } from '../../types/schema'

    type TestValue = {
      name: string
    
      object: {
        age: number
      }
    }
    
    const a: EditorRef<TestValue> = {} as any

    a.setSetterValueByPath<['object']>(['object'], { age: 12 })


  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).toBeUndefined()
})

test('check EditorRef setSetterValueByPath type invalid', async () => {
  const casePath = getCasePath('task-20', 'case-2')
  await writeCaseContent(
    casePath,
    `
    import { EditorRef } from '../../types/schema'

    type TestValue = {
      name: string
    
      object: {
        age: number
      }
    }
    
    const a: EditorRef<TestValue> = {} as any

    a.setSetterValueByPath<['object']>(['object'], { age: "12" })


  `
  )

  const res = await executeCaseFile(casePath)

  expect(res).not.toBeUndefined()
})
