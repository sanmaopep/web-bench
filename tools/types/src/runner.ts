export interface IRunner {
  /**
   * 返回是否成功执行
   */
  run: () => Promise<boolean | void>
}
