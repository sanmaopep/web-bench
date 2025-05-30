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

import { Task } from '@web-bench/evaluator-types'
import { ProjectRunner } from '../project-runner'
import { DefaultTaskRunner } from './default-task-runner'

export class InitTaskRunner extends DefaultTaskRunner {
  public type = 'init' as const
  public constructor(task: Task, project: ProjectRunner) {
    const settings = project.settings
    const initFiles = settings.initFiles

    const newDescription = `${task.description}${(task.description.endsWith('\n') || task.description.trim().endsWith('.')) ? '' : '.'}
Add filename after code block.
The filename should appear on the line following the language specifier in your code block.
${initFiles.length > 0 ? `The existing files: ${settings.initFiles.join()}` : ''}`

    super(
      {
        ...task,
        description: newDescription,
        context: [],
      },
      project
    )
  }

  public async run(): Promise<boolean> {
    const res = await super.run()

    if (!res) {
      const { settings } = this.project

      this.project.updateSettings({
        ...settings,
        // If all init tasks fail, set the latest output to the init directory, so that the content of the init directory will be copied to the next task's run directory during the next execution.
        outputProjectDir: [settings.initDir, ...settings.outputProjectDir],
      })
    }

    return true
  }
}
