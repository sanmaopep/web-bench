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

import { ScheduleTask } from './type'

export class LLMSchedule {
  private _index = 0

  public runningTasks: ScheduleTask[] = []

  public queuingTasks: (ScheduleTask & { start: () => Promise<void> })[] = []

  public _getTaskId = () => {
    return `task_${this._index++}`
  }

  public async scheduleTask(
    taskInfo: Pick<ScheduleTask, 'llm' | 'run' | 'inputTokens' | 'outputTokens'>,
    log: (message: string) => void
  ) {
    const taskId = this._getTaskId()

    try {
      const { llm, run, inputTokens, outputTokens } = taskInfo

      const checked = llm.checkLimit({
        runningTask: this.runningTasks.filter((t) => t.llm.provider === llm.provider),
      })

      log(['scheduleTask', taskId, llm.provider, checked, this.runningTasks.length].join(' '))

      const task = {
        id: taskId,
        llm,
        inputTokens,
        outputTokens,
        requestTime: +new Date(),
        run,
      }

      // 如果达到限制需要先排队
      if (!checked) {
        await this.queue(task)
      }

      await this.runTask(task, log)
    } catch (error) {
      const errMsg =
        typeof error === 'string'
          ? error
          : error instanceof Error
            ? error.message
            : (error as string)

      log(['scheduleTask', taskId, 'errMsg', errMsg].join(' '))

      throw new Error(errMsg)
    }
  }

  public runTask = async (task: ScheduleTask, log: (message: string) => void) => {
    try {
      this.runningTasks.push(task)

      log(['scheduleTask', task.id, 'start run'].join(' '))

      await task.run()

      log(['scheduleTask', task.id, 'end run'].join(' '))

      const idx = this.runningTasks.findIndex((v) => v.id === task.id)

      if (idx !== -1) {
        this.runningTasks.splice(idx, 1)
      }
      await this.triggerQueue(log, task.llm.provider)
    } catch (e) {
      const errMsg = typeof e === 'string' ? e : e instanceof Error ? e.message : (e as string)
      const idx = this.runningTasks.findIndex((v) => v.id === task.id)

      if (idx !== -1) {
        this.runningTasks.splice(idx, 1)
      }

      log(['scheduleTask', task.id, 'end errMsg', errMsg].join(' '))

      this.triggerQueue(log, task.llm.provider)

      throw new Error(errMsg)
    }
  }

  public triggerQueue = async (log: (message: string) => void, provider: string) => {
    while (this.queuingTasks.length !== 0) {
      const queueIdx = this.queuingTasks.findIndex((t) => t.llm.provider === provider)
      // 当没有 queuingTasks 没有同一个 provider 的 task 就结束

      log(['scheduleTask', 'queueIdx', queueIdx, this.queuingTasks.length].join(' '))

      if (queueIdx !== -1) {
        const nextTask = this.queuingTasks[queueIdx]
        // 当达到限制就结束
        const queueCheck = nextTask.llm.checkLimit({
          runningTask: this.runningTasks.filter((t) => t.llm.provider === provider),
        })
        log(['scheduleTask', 'queueCheck', queueCheck].join(''))

        if (queueCheck) {
          this.queuingTasks.splice(queueIdx, 1)

          await nextTask.start()
        } else {
          break
        }
      } else {
        break
      }
    }
  }

  public queue = async (task: ScheduleTask) => {
    return new Promise((resolve) => {
      this.queuingTasks.push({
        ...task,
        start: async () => {
          resolve(true)
        },
      })
    })
  }
}

export const schedule = new LLMSchedule()
