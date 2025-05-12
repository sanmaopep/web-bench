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
 * 删除 error 的一些无关信息
 * 比如无关的文件路径，避免绝对返回路径
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
      // 过滤掉  playwright 输出后就会清理的日志
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
