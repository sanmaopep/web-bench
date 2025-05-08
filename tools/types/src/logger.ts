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
   * 只写入日志内，但是在控制台不输出
   */
  silentLog: (...args: any[]) => void
  /**
   * 获取日志输出历史
   */
  getHistory: () => string[]
  /**
   * 清空日志历史
   */
  clearHistory(): void
}
