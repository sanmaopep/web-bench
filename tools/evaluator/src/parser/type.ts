export interface CodeParser {
  /**
   * 文件后缀
   */
  suffix: string[]
  /**
   * 解析文件内容是否合法，合法返回空字符串
   * @param codeText 代码文本
   */
  validate(codeText?: string): string
}
