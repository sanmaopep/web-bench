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

import { ILogger, LoggerLevel } from '@web-bench/evaluator-types'
import chalk from 'chalk'
import { ProjectRunner } from '../runner'

const levelOrder: Record<LoggerLevel, number> = {
  debug: -1,
  info: 0,
  warn: 1,
  error: 2,
}

export class Logger implements ILogger {
  project: ProjectRunner

  model: string = ''

  cache: string[] = []

  public constructor(project: ProjectRunner) {
    this.project = project
  }

  private get prefix(): string {
    return this.project.settings.model
      ? `[${this.project.settings.originName}-${this.project.settings.model}]`
      : `[${this.project.settings.originName}]`
  }

  private canLogger(level: LoggerLevel): boolean {
    return levelOrder[level] >= levelOrder[this.project.settings.logLevel]
  }

  info(...args: any[]) {
    this.addHistoryItems(...args)
    if (this.canLogger('info')) {
      console.log(chalk.blue(this.prefix), ...args)
    }
  }

  warn(...args: any[]) {
    this.addHistoryItems(...args)
    if (this.canLogger('warn')) {
      console.log(chalk.yellow(this.prefix), ...args)
    }
  }

  error(...args: any[]) {
    this.addHistoryItems(...args)
    if (this.canLogger('error')) {
      console.log(chalk.red(this.prefix), ...args)
    }
  }

  debug(...args: any[]) {
    this.addHistoryItems(...args)
    if (this.canLogger('debug')) {
      console.log(chalk.magenta(this.prefix), ...args)
    }
  }

  silentLog(...args: any[]) {
    this.addHistoryItems(...args)
  }

  addHistoryItems(...args: any[]) {
    this.cache.push([this.prefix, ...args].map((v) => JSON.stringify(v)).join('\n'))
  }

  getHistory(): string[] {
    return this.cache
  }

  clearHistory(): void {
    this.cache = []
  }

  shouldLog = (level: LoggerLevel) => this.canLogger(level)
  
}
