const fse = require('fs-extra')
const path = require('path')
const { execa } = require('execa')

const ROOT = process.env.EVAL_PROJECT_ROOT || 'src'

export const writeCaseContent = async (casePath, content) => {
  await fse.ensureDir(path.dirname(casePath))

  await fse.writeFile(casePath, content, {
    encoding: 'utf-8',
  })
}

export const getCasePath = (taskid, caseid) => path.join(ROOT, 'tasks', taskid, `${caseid}.ts`)

export const executeCaseFile = async (casePath) => {
  try {
    await execa({})`tsc ${casePath}`
    return
  } catch (error) {
    return error.stdout
  }
}

export const getErrors = (error) => {
  return error.split('\n').map((v) => {
    return v.split(':').splice(1).join(':')
  })
}
