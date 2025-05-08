/**
 * 匹配以[数字/数字]开头的正则表达式
 */
export const filterNumberStartString = (str: string) => {
  return /^\[\d+\/\d+\]/.test(str)
}
