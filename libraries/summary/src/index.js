#!/usr/bin/env node
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


// -S node --experimental-loader

const fs = require('fs')
const path = require('path')
const ignore = require('ignore')

function main() {
  const sum = {
    projects: getProjects() ?? [
      {
        name: 'proj-1',
        files: 3,
        lines: 200,
        cases: 30,
      },
      {
        name: 'proj-2',
        files: 5,
        lines: 800,
        cases: 40,
      },
    ],
    summary: {
      avgFiles: 0,
      maxFiles: 0,
      avgLines: 0,
      maxLines: 0,
      avgProjectCases: 0,
      maxProjectCases: 0,
      avgTaskCases: 0,
      maxTaskCases: 0,
    },
  }

  const projects = sum.projects
  const total = projects.length
  if (total === 0) return

  const s = sum.summary
  projects.forEach((p) => {
    s.avgFiles += p.files
    s.avgLines += p.lines
    s.avgProjectCases += p.cases

    if (p.files > s.maxFiles) s.maxFiles = p.files
    if (p.lines > s.maxLines) s.maxLines = p.lines
    if (p.cases > s.maxProjectCases) s.maxProjectCases = p.cases
  })
  s.avgFiles /= total
  s.avgLines /= total
  s.avgProjectCases /= total
  s.avgTaskCases = s.avgProjectCases / 20
  s.maxTaskCases = s.maxProjectCases / 20
  console.log(s)

  const filepath = path.join(__dirname, 'summary.json')
  fs.writeFileSync(filepath, JSON.stringify(sum, null, 2))
}

function getProjects() {
  const DIR = path.resolve(__dirname, '../../../projects')
  const projects = fs
    .readdirSync(DIR)
    .filter((dir) => fs.statSync(path.resolve(DIR, dir)).isDirectory())
    .filter((dir) => {
      const packagePath = path.resolve(DIR, dir, 'package.json')
      if (!fs.existsSync(packagePath)) return false

      const package = JSON.parse(fs.readFileSync(packagePath).toString())
      return package.eval?.stable
    })
    .map((projectName) => {
      const stat = {
        name: projectName,
        files: 0,
        lines: 0,
        cases: 0,
      }

      try {
        const projectPath = path.resolve(DIR, projectName)
        const ig = getIgnore(projectPath)

        const src = path.resolve(projectPath, 'src/')
        let srcFiles = []
        getAllFiles(src, srcFiles)

        srcFiles = srcFiles.filter((file) => !ig.ignores(path.relative(src, file)))

        stat.files = srcFiles.length
        stat.lines = srcFiles.reduce((prev, file) => prev + getLines(file), 0)

        const test = path.resolve(projectPath, 'test/')
        const testFiles = []
        getAllFiles(test, testFiles)
        stat.cases = testFiles.reduce((prev, file) => prev + getCases(file), 0)
      } catch (error) {
        console.error(projectName)
        console.error(error)
      }

      return stat
    })

  console.log(`projects`, projects.length)
  return projects
}

function getIgnore(projectPath) {
  const ig = ignore().add(['dist', 'assets', 'node_modules'].join('\n'))

  const addIgnoreFile = (ignoreFilePath) => {
    if (fs.existsSync(ignoreFilePath)) {
      const ignoreFile = fs.readFileSync(ignoreFilePath, { encoding: 'utf-8' })
      ig.add(ignoreFile)
    }
  }

  addIgnoreFile(path.join(projectPath, '.gitignore'))
  addIgnoreFile(path.join(projectPath, '.evalignore'))
  addIgnoreFile(path.join(__dirname, '../../../.gitignore'))
  addIgnoreFile(path.join(__dirname, '../../../projects/.gitignore'))

  return ig
}

function getAllFiles(dirPath, fileList = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      getAllFiles(fullPath, fileList)
    } else if (entry.isFile() && !entry.isSymbolicLink()) {
      fileList.push(fullPath)
    }
  }

  return fileList
}

function getLines(file) {
  return fs.readFileSync(file).toString().split('\n').length
}

function getCases(file) {
  const content = fs.readFileSync(file).toString()
  const regex = /test\s*\(\s*'.+'\s*,.+\)/g

  const matches = content.match(regex)
  return matches ? matches.length : 0
}

main()
