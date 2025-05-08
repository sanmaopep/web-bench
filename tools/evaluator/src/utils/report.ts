import { TaskSnippet } from '@web-bench/evaluator-types'

export function getOrdinalNumberAbbreviation(num: number): string {
  const lastDigit = num % 10
  const lastTwoDigits = num % 100
  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return num + 'st'
  } else if (lastDigit === 2 && lastTwoDigits !== 12) {
    return num + 'nd'
  } else if (lastDigit === 3 && lastTwoDigits !== 13) {
    return num + 'rd'
  }
  return num + 'th'
}

export const getPassCounts = (
  taskSnippets: TaskSnippet[],
  allTaskCount: number,
  retry: number
): number[] => {
  const timeArr = new Array(retry).fill(0)
  const passRate: number[] = [...timeArr].map((_, n) => {
    // 所有任务的前 n 次结果
    const allTaskFirstNResult = taskSnippets.map((v) => {
      return [...v.result].splice(0, Math.min(n + 1, v.result.length))
    })

    // 找到前 n 个全部失败的结果的 index
    const failIndex = allTaskFirstNResult.findIndex((taskResults) =>
      taskResults.every((result) => !result.success)
    )

    if (failIndex === -1) {
      return allTaskCount
    }

    return failIndex
  })

  return passRate
}

export const getPassRate = (
  taskSnippets: TaskSnippet[],
  allTaskCount: number,
  retry: number
): number[] => {
  const passCounts = getPassCounts(taskSnippets, allTaskCount, retry)
  const passRate = passCounts.map((count) => {
    return +((count / allTaskCount) * 100).toFixed(2)
  })

  return passRate
}

export const getErrorCounts = (
  taskSnippets: TaskSnippet[],
  allTaskCount: number,
  retry: number
) => {
  const timeArr = new Array(retry).fill(0)

  const errorCounts: number[] = [...timeArr].map((_, n) => {
    // 所有任务的前 n 次结果
    const allTaskFirstNResult = taskSnippets.map((v) =>
      [...v.result].slice(0, Math.min(n + 1, v.result.length))
    )

    // 找到前 n 个结果中存在失败的列
    const failCount = allTaskFirstNResult.filter((taskResults) =>
      taskResults.some((result) => !result.success)
    ).length

    return failCount
  })

  errorCounts.pop()

  return errorCounts
}

export const getErrorRate = (taskSnippets: TaskSnippet[], allTaskCount: number, retry: number) => {
  const errorCounts = getErrorCounts(taskSnippets, allTaskCount, retry)

  const errorRate = errorCounts.map((count) => {
    return +((count / allTaskCount) * 100).toFixed(2)
  })
  return errorRate
}
