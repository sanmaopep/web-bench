import dayjs from 'dayjs'
import { groupBy } from 'lodash'
import { getErrorCounts, getErrorRate, getPassCounts, getPassRate } from '../../../utils/report'
import { EvaluatorConfig, IProjectRunner, Task } from '@web-bench/evaluator-types'
import { toCamelCase } from '../../../utils/word'
import { ProjectReporter } from './project-reporter'

type AgentRateInfo = {
  name: string

  pass: number[]

  error: number[]
}

export class EvaluationReport {
  public getMetricsTableHeader = (times: number) => {
    const passTitleArr = new Array(times).fill(0)
    const errorTitleArr = new Array(times - 1).fill(0)
    const linesArr = new Array(times * 2 - 1).fill(0)
    return `|   | ${passTitleArr.map((_, i) => `pass@${i + 1} |`).join('')}  ${errorTitleArr.map((_, i) => `error@${i + 1} |`).join('')}
| ------ |${linesArr.map(() => `------ |`).join('')}`
  }

  /**
   * 获取各 project 下各个 model 的指标
   */
  public getProjectMetricsTable({
    projects,
    times,
  }: {
    projects: IProjectRunner[]
    times: number
  }): string {
    const allRate = new Array(times * 2 - 1).fill(0)

    const projectLength = projects.length

    const detailContent = `${projects
      .map((project) => {
        const { settings, tasks, taskSnippets } = project

        const taskInfo = new Map<string, Task>()
        tasks.forEach((task) => taskInfo.set(task.task.id, task.task))

        const taskSnippetsWithoutInit = taskSnippets.filter((taskSnippet) => {
          return !taskInfo.get(taskSnippet.id)?.isInit
        })

        return `| >> ${settings.model || settings.endpoint} | ${getPassRate(
          taskSnippetsWithoutInit,
          project.settings.taskCount,
          project.settings.retry
        )
          .map((v, i) => {
            allRate[i] += v
            return ` ${v}% |`
          })
          .join('')} ${getErrorRate(
          taskSnippetsWithoutInit,
          project.settings.taskCount,
          project.settings.retry
        )
          .map((v, i) => {
            allRate[i + times] += v
            return ` ${v}% |`
          })
          .join('')}`
      })
      .join('\n')}
`
    return `
${this.getMetricsTableHeader(times)}
| average | ${allRate.map((v) => ` ${(v / projectLength).toFixed(2)}% |`).join('')}
${detailContent}
  `
  }

  /**
   *
   * @param evalConfig
   * @param taskCount
   * @returns
   */
  public getReportBaseInfo = (evalConfig: EvaluatorConfig, taskCount?: number) => {
    return `
${evalConfig.agentMode ? `* AgentMode: ${toCamelCase(evalConfig.agentMode)}` : ''}
${evalConfig.agentEndPoint ? `* EndPoint: ${evalConfig.agentEndPoint}` : ''}
${taskCount ? `* Tasks: ${taskCount}` : ''}
* Exported: ${dayjs().format('YYYY/MM/DD HH:mm:ss')}
    `
  }

  public calculateEvalOverviewMetrics({
    projectsList,
    times,
  }: {
    projectsList: IProjectRunner[][]
    times: number
  }): {
    allPassRate: number[]
    agentRates: Array<AgentRateInfo>
    allErrorRate: number[]
  } {
    const groupedProjects = Object.values(groupBy(projectsList.flat(), (p) => p.agent.key))

    let allCounts = 0

    const numeratorOfPass: number[] = new Array(times).fill(0)
    const numeratorOfError: number[] = new Array(times - 1).fill(0)

    const agentRates: Array<AgentRateInfo> = []

    groupedProjects.forEach((projects) => {
      const projectNumeratorOfPass: number[] = new Array(times).fill(0)
      const projectNumeratorOfError: number[] = new Array(times - 1).fill(0)
      let projectAllCount = 0

      projects.forEach((project) => {
        const {
          taskSnippets,
          settings: { taskCount },
        } = project
        projectAllCount += project.settings.taskCount

        const taskInfo = new Map<string, Task>()
        project.tasks.forEach((task) => taskInfo.set(task.task.id, task.task))

        const taskSnippetsWithoutInit = taskSnippets.filter((taskSnippet) => {
          return !taskInfo.get(taskSnippet.id)?.isInit
        })

        const passCounts = getPassCounts(taskSnippetsWithoutInit, taskCount, times)
        passCounts.forEach((v, i) => {
          projectNumeratorOfPass[i] += v
        })

        const errorCounts: number[] = getErrorCounts(taskSnippetsWithoutInit, taskCount, times)

        errorCounts.forEach((v, i) => {
          projectNumeratorOfError[i] += v
        })
      })

      agentRates.push({
        name: projects[0].agent.key!,
        pass: projectNumeratorOfPass.map((v, i) => {
          numeratorOfPass[i] += v
          return +((v / projectAllCount) * 100).toFixed(2)
        }),
        error: projectNumeratorOfError.map((v, i) => {
          numeratorOfError[i] += v
          return +((v / projectAllCount) * 100).toFixed(2)
        }),
      })

      allCounts += projectAllCount
    })

    return {
      agentRates,
      allPassRate: numeratorOfPass.map((v) => +((v / allCounts) * 100).toFixed(2)),
      allErrorRate: numeratorOfError.map((v) => +((v / allCounts) * 100).toFixed(2)),
    }
  }

  /**
   * 获取 overview 指标表格
   */
  public getEvalOverviewTable({
    projectsList,
    retry,
  }: {
    projectsList: IProjectRunner[][]
    retry: number
  }) {
    const { allErrorRate, allPassRate, agentRates } = this.calculateEvalOverviewMetrics({
      projectsList,
      times: retry,
    })

    return `
${this.getMetricsTableHeader(retry)}
| average | ${allPassRate.map((v) => ` ${v}% |`).join('')} ${allErrorRate.map((v) => ` ${v}%  |`).join('')}
${agentRates.map((agent) => `| >> ${agent.name} | ${agent.pass.map((v) => ` ${v}% |`).join('')} ${agent.error.map((v) => ` ${v}%  |`).join('')}`).join('\n')}
    `
  }

  /**
   * 获取 project report 内容
   */

  public getProjectReportContent({
    projects,
    evalConfig,
  }: {
    projects: IProjectRunner[]
    evalConfig: EvaluatorConfig
  }) {
    if (projects.length === 0) {
      return ''
    }

    const { name, taskCount, retry } = projects[0].settings

    return `
# Evaluation Report for ${name}
${this.getReportBaseInfo(evalConfig, taskCount)}

## Metrics
${this.getProjectMetricsTable({ projects, times: retry })}

## Evaluation Results
✅ pass ❌ error
${projects
  .map((p) => {
    const reporter = new ProjectReporter()

    return `
### ${p.settings.model || p.settings.endpoint}
${reporter.getResultsTable({ taskSnippets: p.taskSnippets, times: retry })}
`
  })
  .join('\n')}
`
  }

  /**
   * 获取 eval report 内容
   */
  public getEvaluationReportContent({
    projectsList,
    evalConfig,
  }: {
    projectsList: IProjectRunner[][]
    evalConfig: EvaluatorConfig
  }) {
    const {
      settings: { retry },
    } = projectsList[0][0]

    return `
# Evaluation Report
${this.getReportBaseInfo(evalConfig)}

## Metrics

### Overview
${this.getEvalOverviewTable({ projectsList, retry })}

${projectsList
  .map((projects) => {
    return `### ${projects[0].settings.name}${this.getProjectMetricsTable({ projects, times: retry })}
  `
  })
  .join('\n')}
    `
  }
}
