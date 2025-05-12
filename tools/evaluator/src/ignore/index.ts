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

import { ProjectRunner } from '../runner'
import ignore, { Ignore } from 'ignore'
import path from 'path'
import fs from 'promise-fs'

export class IgnoreGetter {
  public project: ProjectRunner

  protected _ignore: Ignore

  public constructor(project: ProjectRunner) {
    this.project = project
  }

  public async getIgnore(): Promise<Ignore> {
    // Cache to prevent repeatedly reading ignore files
    if (this._ignore) {
      return this._ignore
    }

    const {
      project: {
        settings: { projectDir, repositoryDir },
      },
    } = this

    const ig = ignore()

    const addIgnoreFile = async (ignoreFilePath: string) => {
      if (fs.existsSync(ignoreFilePath)) {
        const ignoreFile = await fs.readFile(ignoreFilePath, { encoding: 'utf-8' })
        ig.add(ignoreFile)
      }
    }
    await addIgnoreFile(path.join(projectDir, '.gitignore'))
    await addIgnoreFile(path.join(projectDir, '.npmignore'))
    await addIgnoreFile(path.join(repositoryDir, '.gitignore'))
    await addIgnoreFile(path.join(projectDir, '.evalignore'))

    this._ignore = ig

    return this._ignore
  }
}
