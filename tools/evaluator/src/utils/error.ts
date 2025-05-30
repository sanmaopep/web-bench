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

import stripAnsi from 'strip-ansi'
import { filterNumberStartString } from './string'

/**
 * Remove some irrelevant information from the error
 * For example, irrelevant file paths, to avoid returning absolute paths
 */
export const clearErrorMsg = (error: string | undefined, dirs: string[]) => {
  let res = error

  dirs.forEach((dir) => {
    let patternObj = new RegExp(dir, 'g')
    res = res?.replace(patternObj, '.')
  })

  return res
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}

export function prettierErrorMessage(errorMsg: string, clearErrorMsgDir?: string[]) {
  let outputData = stripAnsi(errorMsg)

  if (outputData) {
    outputData = outputData
      .split('\n')
      // Filter out logs that will be cleared after playwright output
      .filter((v) => {
        return !filterNumberStartString(v) && !v.startsWith('<') && Boolean(v.trim())
      })
      .join('\n')
  }

  if (clearErrorMsgDir) {
    return clearErrorMsg(outputData, clearErrorMsgDir)
  }
  return outputData
}
