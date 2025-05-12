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

import { EvalPlugin } from '@web-bench/evaluator-types'
import { EvalPluginPrefix } from '../../common'
import fs from 'fs/promises'
import { ContextGetter, TesterFactory } from '../../utils'
import { Writer } from '../../utils/writer'
import { Environment } from '../../utils/environment'
import { Builder } from '../../utils/builder'

export const BenchProjectPlugin: EvalPlugin[] = [
  {
    name: EvalPluginPrefix + 'local',
    enforce: 'replace',
    onTaskStart: async ({ project, task, times }) => {
      const lastOutputProjectDir = project.settings.outputProjectDir[0]
      const settings = await project.projectGetter.updateSettingBeforeRunTask(project.settings, {
        task,
        times,
      })
      project.updateSettings(settings)
      const currentOutputProjectDir = project.settings.outputProjectDir[0]

      await fs.mkdir(currentOutputProjectDir, { recursive: true })

      // 初始化的 outputProjectDir 为空，此时没有前序 task，不需要将上一次 task 的结果 copy 到本次 task 执行目录
      if (lastOutputProjectDir) {
        // 上一次 task 的结果 copy 到本次 task 执行目录
        await fs.cp(lastOutputProjectDir, currentOutputProjectDir, {
          recursive: true,
          dereference: true,
        })
      }
    },
    onTaskContextCollect: async ({ project }) => {
      const context = new ContextGetter(project)
      return await context.getTaskContext()
    },
    onTaskRewriteFiles: async ({ project, files }) => {
      const writer = new Writer(project)
      await writer.writeFiles(files)
    },
    onTaskInitEnv: async ({ project }) => {
      const environment = new Environment(project)
      return await environment.init()
    },
    onTaskBuild: async ({ project }) => {
      const builder = new Builder(project)
      const buildResult = await builder.build()
      return buildResult
    },
    onTaskTest: async ({ project, task }) => {
      const tester = TesterFactory.createTester(project.settings.tester, project)

      const testResult = await tester.test(task, project.settings)

      return testResult
    },
  },
]
