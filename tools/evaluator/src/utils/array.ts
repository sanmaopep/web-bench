import { IAgent, IProjectRunner } from '@web-bench/evaluator-types'
import { groupBy } from 'lodash'

export function chunkArray<T>(array: T[], n: number): T[][] {
  const result: T[][] = []
  const newArray = [...array]
  for (let i = 0; i < newArray.length; i += n) {
    result.push(newArray.slice(i, i + n))
  }
  return result
}

export function groupProjectsList(
  projectsList: IProjectRunner[],
  projects: string[],
  agents: IAgent[]
) {
  // const
  const groupedProject = groupBy(projectsList, (project) => project.settings.originName)

  const projectOrder = new Map<string, number>()

  projects.forEach((packageName, index) => {
    projectOrder.set(packageName, index)
  })

  const agentOrder = new Map<string, number>()
  agents.forEach((agent, index) => {
    const key = agent.key
    if (key) {
      agentOrder.set(key, index)
    }
  })
  Object.keys(groupedProject).forEach((projectName) => {
    const projects = groupedProject[projectName]

    groupedProject[projectName] = projects.sort(
      (a, b) => (agentOrder.get(a.agent.key || '') || 0) - (agentOrder.get(b.agent.key || '') || 0)
    )
  })

  return Object.values(groupedProject).sort((a, b) => {
    const ordera = projectOrder.get(a[0].settings.packageName) || 0
    const orderb = projectOrder.get(b[0].settings.packageName) || 0
    return ordera - orderb
  })
}
