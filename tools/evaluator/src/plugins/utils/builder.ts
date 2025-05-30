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
import child_process from 'child_process'
import { filterNumberStartString } from '../../utils/string'
import { clearErrorMsg } from '../../utils/error'
import { IProjectRunner } from '@web-bench/evaluator-types'

export class Builder {
  public project: IProjectRunner
  constructor(project: IProjectRunner) {
    this.project = project
  }

  public build = (): Promise<string> => {
    const {
      settings: { projectDir, outputProjectDir, repositoryDir },
      currentTask,
    } = this.project

    const {
      project: { logger },
    } = this
    return new Promise((resolve) => {
      logger.debug('excute build', `cd ${projectDir} && npm run build`)

      child_process.exec(
        `cd ${projectDir} && npm run build`,
        {
          env: {
            ...process.env,
            EVAL_PROJECT_ROOT: outputProjectDir[0],
            EVAL_TASK: currentTask?.task.id,

            EVAL: 'true',
          },
        },
        (err, stdout, stderr) => {
          logger.silentLog('stdout', stdout)
          logger.debug('stderr', stderr)
          logger.silentLog('error', err)

          if (!err) {
            return resolve('')
          }

          let outputData: string = stderr?.toString()

          if (outputData) {
            outputData = stripAnsi(outputData)

            outputData = outputData
              .split('\n')
              // Filter out logs that will be cleared after playwright output
              .filter((v) => !filterNumberStartString(v) && !v.startsWith('<'))
              .join('\n')

            outputData = clearErrorMsg(outputData, [
              'src/',
              outputProjectDir[0],
              projectDir,
              repositoryDir,
            ])!

            console.log('outputData', outputData)

            resolve(outputData)
          }
          resolve(stderr)
        }
      )
    })
  }
}
