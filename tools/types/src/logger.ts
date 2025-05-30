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

import { LoggerLevel } from "./config"

/**
 * logger
 */
export interface ILogger {
  /**
   * info
   */
  info: (...args: any[]) => void
  /**
   * warning
   */
  warn: (...args: any[]) => void
  /**
   * error
   */
  error: (...args: any[]) => void
  /**
   * debug
   */
  debug: (...args: any[]) => void
  /**
     * Only write to log but not output to console
     */
  silentLog: (...args: any[]) => void
  /**
     * Get log output history
     */
  getHistory: () => string[]
  /**
     * Clear log history
     */
  clearHistory(): void
  /**
   * 
   */
  shouldLog: (level: LoggerLevel) => boolean
}
