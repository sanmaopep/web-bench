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

import fs from 'node:fs/promises'
import path from 'node:path'

async function getAllFiles(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true })
  const paths = []

  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    if (file.isDirectory()) {
      paths.push(...(await getAllFiles(fullPath)))
    } else {
      paths.push(fullPath)
    }
  }

  return paths
}

export default function sourceMapMover() {
  return {
    name: 'sourcemap-mover',
    enforce: 'post',
    async closeBundle() {
      const outDir = path.resolve('dist')
      const sourcemapDir = path.resolve('sourcemaps')

      try {
        // 确保 sourcemaps 目录存在
        await fs.mkdir(sourcemapDir, { recursive: true })

        // 递归读取构建输出目录中的所有文件
        const files = await getAllFiles(outDir)

        // 移动所有 .map 文件
        for (const filePath of files) {
          if (filePath.endsWith('.map')) {
            // 保持原始目录结构
            const relativePath = path.relative(outDir, filePath)
            const targetPath = path.join(sourcemapDir, relativePath)
            const targetDir = path.dirname(targetPath)

            // 确保目标目录存在
            await fs.mkdir(targetDir, { recursive: true })

            await fs.copyFile(filePath, targetPath)
            await fs.unlink(filePath)

            // 更新原始文件中的 sourceMappingURL
            const originalFilePath = filePath.slice(0, -4) // 移除 .map 扩展名
            
            if (await fs.stat(originalFilePath).catch(() => false)) {
              let content = await fs.readFile(originalFilePath, 'utf-8')
              content = content.replace(
                /\/\/# sourceMappingURL=.+/,
                `//# sourceMappingURL=https://internal.com/sourcemaps/${relativePath}`
              )
              await fs.writeFile(originalFilePath, content)
            }
          }
        }
      } catch (error) {
        console.error('Error moving sourcemap files:', error)
      }
    }
  }
} 