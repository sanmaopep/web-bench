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
import fse from 'fs-extra'

export namespace FileUtils {
  /**
   * Traverse a folder
   * @param rootDir The root directory
   * @param callback
   */
  export async function travelDir(
    rootDir: string,
    callback: (filePath: string) => Promise<void>
  ): Promise<void> {
    const dfs = async (root: string) => {
      const files = await fs.readdir(root)

      for (const file of files) {
        const filePath = path.join(root, file)

        const stat = await fs.stat(path.join(filePath))
        if (stat.isDirectory()) {
          await dfs(filePath)
        } else {
          await callback(filePath)
        }
      }
    }

    await dfs(rootDir)
  }

  export async function getAllFiles(
    rootDir: string,
    config?: { relative?: boolean }
  ): Promise<string[]> {
    const { relative } = config || {}
    const files: string[] = []

    if (!(await fse.pathExists(rootDir))) {
      return files
    }

    await travelDir(rootDir, async (filePath) => {
      files.push(relative ? path.relative(rootDir, filePath) : filePath)
    })

    return files
  }

  export function getRelativePath(pathA: string, pathB: string) {
    // Convert the path to an absolute path
    const absolutePathA = path.resolve(pathA)
    const absolutePathB = path.resolve(pathB)

    // Calculate the relative path
    const relativePath = path.relative(path.dirname(absolutePathB), absolutePathA)

    // Use forward slashes uniformly
    return relativePath.replace(/\\/g, '/')
  }

  export async function checkDirectoryExists(path: string) {
    try {
      const stats = await fs.stat(path);
      return stats.isDirectory(); // Returns true if it is a directory, false if it is not
    } catch (err) {
      return false; // If the path does not exist, an error will be thrown
    }
  }
}
