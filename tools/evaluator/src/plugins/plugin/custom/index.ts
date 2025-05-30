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
import { readFile, mkdir, copyFile, writeFile } from 'promise-fs'
import path from 'path'
import { execa } from 'execa'
import { LocalPort } from '../../../utils/port'

export const CustomProjectPlugin: EvalPlugin[] = [
  {
    name: EvalPluginPrefix + 'custom',
    enforce: 'replace',

    onInitConfig: async ({ config }) => {
      const projectRoot = process.cwd()

      const packageJsonContent = await readFile(path.join(projectRoot, 'package.json'), {
        encoding: 'utf-8',
      })

      const packageJson: {
        name: string
      } = packageJsonContent ? JSON.parse(packageJsonContent) : {}

      const name = packageJson.name

      return {
        ...config,
        projects: [name],
      }
    },

    onTaskStart: async ({ project, task, times }) => {
      const projectRoot = process.cwd()

      const outputPath = path.join(project.settings.outputWorkspaceDir, task.id + '-' + times)

      await mkdir(path.dirname(outputPath), { recursive: true })

      await mkdir(outputPath, { recursive: true })

      await Promise.all(
        (task.context || []).map(async (filePath) => {
          await copyFile(
            path.join(projectRoot, filePath),
            path.join(outputPath, path.basename(filePath))
          )
        })
      )
    },

    onTaskContextCollect: async ({ task }) => {
      const projectRoot = process.cwd()

      const res: Record<string, string> = {}

      await Promise.all(
        (task.context || []).map(async (filePath) => {
          const content = await readFile(path.join(projectRoot, filePath), {
            encoding: 'utf-8',
          })

          res[filePath] = content
        })
      )

      return res
    },

    onTaskRewriteFiles: async ({ project, files, task, times }) => {
      const outputPath = path.join(project.settings.outputWorkspaceDir, task.id + '-' + times)

      await Promise.all(
        Object.entries(files).map(async ([filePath, content]) => {
          const basePath = path.basename(filePath)

          await mkdir(path.dirname(path.join(outputPath, basePath)), { recursive: true })
          await writeFile(path.join(outputPath, basePath), content, { encoding: 'utf-8' })
        })
      )
    },

    onTaskTest: async ({ project, task, times }) => {
      const { settings } = project
      const projectRoot = process.cwd()

      const outputPath = path.join(project.settings.outputWorkspaceDir, task.id + '-' + times)

      if (task.testcase && task.testcase.length > 0) {
        project.logger.debug(
          `test cmd:`,
          `npm run test ${task.testcase.map((t) => path.join(projectRoot, t)).join(' ')}`
        )
        project.logger.debug(`test outputPath: ${outputPath}`)
        const port = LocalPort.applyPort()
        try {
          const { stderr, exitCode } = await execa({
            stdout: ['pipe'],
            stderr: ['pipe'],
            cwd: process.cwd(),
            // Set timeout to 10min to avoid getting stuck
            timeout: 10 * 60 * 1000,
            env: {
              ...process.env,
              EVAL_PROJECT_ROOT: outputPath,
              EVAL_PROJECT_PORT: `${port}`,
              EVAL_TASK: task.id,
              IS_EVAL_PRODUCTION: settings.production ? 'true' : undefined,
              EVAL: 'true',
              FORCE_COLOR: 'true',
            },
          })`npm run test ${task.testcase.map((t) => path.join(projectRoot, t)).join(' ')}`

          if (exitCode === 0) {
            return
          }
          return stderr.toString()
        } catch (err: unknown) {
          if (!err) {
            return ''
          }

          if ((err as { timedOut: boolean }).timedOut) {
            LocalPort.releasePort(port)

            return 'Test execution timed out. Check for infinite loops or high code complexity.'
          }

          console.log('err', err)
          LocalPort.releasePort(port)

          return (err as { stdout: string }).stdout
        }
      }
    },
  },
]
