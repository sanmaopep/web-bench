const { expect } = require('@playwright/test')
const { isExisted } = require('@web-bench/test-util')
const path = require('path')

export const checkExists = (filePath) => {
  expect(isExisted(filePath, path.join(__dirname, '../../src'))).toBeTruthy()
}
