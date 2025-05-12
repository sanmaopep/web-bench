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

const { parse } = require('yaml')
const path = require('path')
const fs = require('promise-fs')
const fse = require('fs-extra')
const dayjs = require('dayjs')

;(async () => {
  const projectRoot = path.join(__dirname, '../../../projects/')

  const allProjects = await fs.readdir(projectRoot)

  const projectStats = await Promise.all(
    allProjects.map((p) => {
      return fs.stat(path.join(projectRoot, p))
    })
  )

  const projects = allProjects.filter((_, i) => projectStats[i].isDirectory())

  const results = []

  for (const project of projects) {
    const projectDir = path.join(projectRoot, project)

    if (!(await fse.pathExists(path.join(projectDir, 'package.json')))) {
      continue
    }
    const packageJsonStr = await fs.readFile(path.join(projectDir, 'package.json'), {
      encoding: 'utf-8',
    })

    const packageJson = packageJsonStr ? JSON.parse(packageJsonStr) : {}

    if (packageJson?.eval?.stable) {
      let baseTasks = []

      if (await fse.pathExists(path.join(projectDir, 'tasks.yml'))) {
        const ymlContent = await fs.readFile(path.join(projectDir, 'tasks.yml'), {
          encoding: 'utf8',
        })
        baseTasks = parse(ymlContent)
      } else if (await fse.pathExists(path.join(projectDir, 'tasks.jsonl'))) {
        const lines = (
          await fs.readFile(path.join(projectDir, 'tasks.jsonl'), {
            encoding: 'utf8',
          })
        ).split('\n')
        baseTasks = lines.map((line) => JSON.parse(line))
      } else {
        throw new Error(`No tasks found for project ${projectDir}`)
      }
      results.push({
        project,
        prompt_list: baseTasks.filter((t) => t.id !== 'init'),
      })
    }
  }

  const hash = dayjs().format('YYYYMMDD-HHmmss')


  try {
    fs.mkdirSync(path.join(__dirname, '..', 'datasets'))
  } catch (error) {}

  try {
    fs.mkdirSync(path.join(__dirname, '..', 'datasets', `datasets-${hash}`))
  } catch (error) {}

  results.forEach((r) => {
    fs.writeFileSync(
      path.join(
        __dirname,
        '..',
        'datasets',
        `datasets-${hash}`,
        r.project + '.jsonl'
      ),
      r.prompt_list.map((t) => JSON.stringify(t)).join('\n'),
      {
        encoding: 'utf-8',
      }
    )
  })
})()
