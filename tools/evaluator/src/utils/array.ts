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
