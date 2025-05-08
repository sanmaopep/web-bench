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
