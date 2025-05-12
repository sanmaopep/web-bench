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

import { readdir, readFile, stat } from 'promise-fs'
import path from 'path'

export const getStableProject = async () => {
  const projectRoot = path.join(__dirname, '../../../projects/')

  const allProjects = await readdir(projectRoot)

  const projectStats = await Promise.all(
    allProjects.map((p) => {
      return stat(path.join(projectRoot, p))
    })
  )

  const projects = allProjects.filter((_, i) => projectStats[i].isDirectory())

  const packageJsons = await Promise.all(
    projects.map((p) =>
      readFile(path.join(projectRoot, p, 'package.json'), {
        encoding: 'utf-8',
      }).catch((e) => {
        return undefined
      })
    )
  )

  return packageJsons
    .filter((json) => json && JSON.parse(json).eval?.stable)
    .map((json) => JSON.parse(json!).name)
}
