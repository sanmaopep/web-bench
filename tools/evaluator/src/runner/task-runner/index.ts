import { ITaskRunner, Task } from '@web-bench/evaluator-types'
import { ProjectRunner } from '../project-runner'
import { DefaultTaskRunner } from './default-task-runner'
import { InitTaskRunner } from './init-task-runner'

export class TaskRunnerFactory {
  static create(task: Task, projectRunner: ProjectRunner): ITaskRunner {
    if (task.isInit) {
      return new InitTaskRunner(task, projectRunner)
    }
    return new DefaultTaskRunner(task, projectRunner)
  }
}
