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

import ChildProcess from 'node:child_process'

export const promiseSpawn = (
  ...param: Parameters<typeof ChildProcess.spawn>
): Promise<number | null> => {
  return new Promise(async (resolve, reject) => {
    const task = ChildProcess.spawn(...param)
    task.on('close', (code) => {
      // code 0 means success
      // 1 means failure
      resolve(code)
    })

    task.stdout?.on('data', (data) => {
      // console.log(data.toString());
    })

    task.on('error', (err) => {
      reject(err)
    })
  })
}
