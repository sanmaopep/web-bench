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

export const PORT_UPPER = 25000
export const PORT_LOWER = 10000

// 部分 port unsafe
const UNSAFE_PORT = [10080]

// function checkPortUse(port: number): Promise<boolean> {
//   return new Promise((resolve) => {
//     const command = `lsof -i :${port}`

//     child_process.exec(command, (error, stdout) => {
//       if (error) {
//         resolve(false)
//       }

//       // If stdout has content, port is in use
//       resolve(stdout.length > 0)
//     })
//   })
// }

/**
 * port 端口管理
 * 1. 启动时，随机分配一个端口
 * 2. 结束时，释放端口
 */
export class LocalPort {
  private static _portSet = new Set<number>()

  private static _index = PORT_LOWER

  public static applyPort(): number {
    while (this._portSet.has(this._index) || UNSAFE_PORT.includes(this._index)) {
      this._index += 1

      if (this._index > PORT_UPPER) {
        this._index = PORT_LOWER
      }
    }

    this._portSet.add(this._index)

    return this._index
  }

  public static releasePort(port: number): void {
    this._portSet.delete(port)
    // 用后即弃，避免频繁申请同一个 port
    this._index += 1
  }
}
