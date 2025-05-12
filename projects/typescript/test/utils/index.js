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
