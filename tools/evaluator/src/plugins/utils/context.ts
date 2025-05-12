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

import path from 'path'
import fs from 'promise-fs'
import { IProjectRunner } from '@web-bench/evaluator-types'
import { getFileContent } from '../../utils/file-content'

export class ContextGetter {
  public project: IProjectRunner

  public constructor(project: IProjectRunner) {
    this.project = project
  }

  public async getTaskContext(): Promise<Record<string, string>> {
    const {
      project: {
        ignore,
        settings: { outputProjectDir, files },
      },
    } = this
    const res: Record<string, string> = {}

    const sourcePath = outputProjectDir[0]

    const ig = await ignore.getIgnore()

    for (const filePath of files) {
      if (ig.ignores(filePath)) {
        continue
      }

      const fullPath = path.join(sourcePath, filePath)

      const content = await getFileContent(fullPath)

      res[filePath] = content
    }

    return res
  }
}
