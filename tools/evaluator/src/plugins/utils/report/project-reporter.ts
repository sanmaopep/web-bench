import { TaskResultSnippet, TaskSnippet } from '@web-bench/evaluator-types'
import dayjs from 'dayjs'
import { getErrorRate, getOrdinalNumberAbbreviation, getPassRate } from '../../../utils/report'
import path from 'path'
import fs from 'fs/promises'

export class ProjectReporter {
  /**
   * 单次 task 执行的详细记录
   */
  public getReportResultSnippet(
    id: string,
    description: string,
    result: TaskResultSnippet,
    index: number
  ) {
    return `
#### ${getOrdinalNumberAbbreviation(index + 1)} Attempt ${result.success ? '✅' : '❌'}
        
*Description:*
${description}
        
${
  result.screenshot
    ? `
*Screenshot:*
![screenshot-${id}-${index}](./${result.screenshot})
`
    : ''
}
        
    
*Request:*
        
\`\`\`json
${JSON.stringify(JSON.parse(result.request || '{}'), null, 2)}
\`\`\`
        
        
*Response:*          
${Object.keys(result.response || {})
  .map((path) => {
    return `
\`\`\`${path.split('.').pop()}
${path}
${(result.response || {})[path]}
\`\`\`
  
  `
  })
  .join('\n')}
    
        
${
  result.errorMessage
    ? `
*ErrorMessage:*     
${result.errorMessage}
`
    : ''
}
`
  }

  /**
   * 每个 task 执行包括多次的记录
   */
  public getReportSnippet(task: TaskSnippet) {
    return `
### ${task.id}
				${task.result
          .map((result, index) =>
            this.getReportResultSnippet(task.id, task.description, result, index)
          )
          .join('\n')}
			  
			  `
  }

  /**
   * 根据 taskSnippets 生成指标表格
   */
  public getMetricsTable({
    allTaskCount,
    times,
    taskSnippets,
  }: {
    taskSnippets: TaskSnippet[]
    allTaskCount: number
    times: number
  }): string {
    const passRate = getPassRate(taskSnippets, allTaskCount, times)

    const errorRate: number[] = getErrorRate(taskSnippets, allTaskCount, times)

    return `	  
| Metric | Result |
| ------ | ------ |
${passRate.map((v, i) => `|pass@${i + 1} | ${v}% |`).join('\n')}
${errorRate.map((v, i) => `|error@${i + 1} | ${v}% |`).join('\n')}
`
  }

  public getResultsTable({ taskSnippets, times }: { taskSnippets: TaskSnippet[]; times: number }) {
    const timeArr = new Array(times).fill(0)

    return `
| Task             | ${timeArr.map((v, i) => `${getOrdinalNumberAbbreviation(i + 1)} Result |`).join('')}
| ---------------- | ${timeArr.map(() => `---------------|`).join('')}
${taskSnippets
  .map(
    (task) =>
      `|${task.id}|${timeArr.map((v, i) => (task.result[i] ? (task.result[i].success ? '✅ |' : '❌ |') : '- |')).join('')}`
  )
  .join('\n')}
`
  }

  /**
   * 临时报告初始化内容
   */
  public getTempleReportInitContent({
    model,
    allTaskCount,
    endpoint,
    projectName,
  }: {
    model?: string
    allTaskCount: number
    endpoint?: string
    projectName: string
  }) {
    return `
# Evaluation Report for ${projectName}
  
${model ? `* Model: ${model}` : ''}
${endpoint ? `* EndPoint: ${endpoint}` : ''}

* Tasks: ${allTaskCount}

## Evaluation Details
    `
  }

  /**
   * 报告完整内容
   */
  public getModelReportContent = ({
    taskSnippets,
    allTaskCount,
    model,
    taskSnippetsWithoutInit,
    endpoint,
    projectName,
    retry,
  }: {
    taskSnippets: TaskSnippet[]
    taskSnippetsWithoutInit: TaskSnippet[]
    retry: number
    endpoint?: string
    allTaskCount: number
    model?: string
    projectName: string
  }) => {
    const times = retry

    const TEMPLE = `
	  
# Evaluation Report for ${projectName}
  
${model ? `* Model: ${model}` : ''}
${endpoint ? `* EndPoint: ${endpoint}` : ''}

* Tasks: ${allTaskCount}
  
* Exported: ${dayjs().format('YYYY/MM/DD HH:mm:ss')}
	  
## Metrics
${this.getMetricsTable({ allTaskCount, taskSnippets: taskSnippetsWithoutInit, times })}

## Evaluation Results
✅ pass ❌ error
${this.getResultsTable({ taskSnippets, times })}
  
## Evaluation Details
${taskSnippets.map((task) => this.getReportSnippet(task)).join('\n')}
`

    return TEMPLE
  }

  /**
   * report 临时日志
   */

  public async reportTaskSnippet(ctx: {
    id: string
    description: string
    result: TaskResultSnippet
    index: number
    reportDir: string
    reportName: string
  }) {
    const { id, description, reportDir, reportName, result, index } = ctx
    let content = this.getReportResultSnippet(id, description, result, index)

    const reportPath = path.join(reportDir, reportName + '.report.md')

    // content
    if (!index) {
      content = '\n### ' + id + '\n' + content
    }

    await fs.appendFile(reportPath, content + '\n', {
      encoding: 'utf-8',
    })
  }
}
