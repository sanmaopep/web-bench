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

import { ProjectSetting, Task } from '@web-bench/evaluator-types'

export interface CodeTester {
  /**
   * provider 唯一标识
   */
  provider: string
  /**
   * 判断当前是否有该环境
   */
  exist(): Promise<boolean>

  /**
   * 执行测试代码
   */
  test(task: Task, projectSetting: ProjectSetting): Promise<string>
  /**
   * 执行截图
   */
  screenshot?(filename: string, task: Task, settings: ProjectSetting): Promise<void>
}
