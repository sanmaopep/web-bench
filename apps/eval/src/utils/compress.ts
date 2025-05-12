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

import fs from 'fs'
import archiver from 'archiver'
import path from 'path'

export function compressFolder(folderPath: string) {
  return new Promise((resolve, reject) => {
    // 检查文件夹是否存在
    if (!fs.existsSync(folderPath)) {
      return reject(new Error(`文件夹 ${folderPath} 不存在`))
    }

    // 获取文件夹名称，用于生成压缩文件名称
    const folderName = path.basename(folderPath)
    const outputPath = path.join(path.dirname(folderPath), `${folderName}.zip`)

    const output = fs.createWriteStream(outputPath)
    const archive = archiver('zip')

    archive.pipe(output)

    function addFolderToArchive(folderPath: string, base: string) {
      const files = fs.readdirSync(folderPath)
      files.forEach((file) => {
        const filePath = path.join(folderPath, file)
        const stats = fs.statSync(filePath)
        if (stats.isDirectory()) {
          addFolderToArchive(filePath, base)
        } else {
          const relativePath = path.relative(base, filePath)
          archive.file(filePath, { name: relativePath })
        }
      })
    }

    addFolderToArchive(folderPath, folderPath)

    archive.on('error', (err) => {
      reject(err)
    })

    output.on('close', () => {
      resolve(outputPath)
    })

    archive.finalize()
  })
}
