interface CodeInfo {
  language: string
  filename: string
  code: string
}

const markdownLanguages = [
  // 编程语言
  'javascript',
  'js',
  'typescript',
  'ts',
  'python',
  'py',
  'java',
  'cpp',
  'c++',
  'csharp',
  'c#',
  'php',
  'ruby',
  'rb',
  'go',
  'rust',
  'swift',
  'kotlin',
  'scala',

  // 前端相关
  'html',
  'css',
  'scss',
  'sass',
  'less',
  'jsx',
  'tsx',
  'vue',
  'svelte',
  'xml',
  'json',
  'yaml',
  'yml',
  'stylus',
  'styl',

  // 模板引擎
  'pug',
  'ejs',

  // 脚本/Shell
  'bash',
  'shell',
  'powershell',
  'batch',
  'sql',

  // 标记语言
  'markdown',
  'md',
  'tex',
  'latex',
  'diff',

  // 配置文件
  'ini',
  'toml',
  'dockerfile',

  // 其他
  'text',
  'plaintext',
  'diff',
  'console',
  'none',
]

export namespace MarkdownParser {
  export function parseMarkdownCodeBlocks(markdown: string): CodeInfo[] {
    // 匹配 Markdown 代码块的正则表达式
    const codeBlockRegex = /```([\s\S]+?)```/g

    // 存储解析结果
    const codeBlocks: CodeInfo[] = []

    // 使用正则表达式遍历所有匹配项
    let match
    while ((match = codeBlockRegex.exec(markdown)) !== null) {
      const content = match[1] || '\n'
      const lines = trimNewlines(content).split('\n')

      // 提取语言标识和文件名

      let language = ''
      if (markdownLanguages.includes(lines[0])) {
        language = lines.shift() || ''
      }

      let filename = ''

      if (isFileName(lines[0].startsWith('/') ? lines[0].substring(1) : lines[0])) {
        filename = lines.shift() || ''
      } else if (isFileName(lines[lines.length - 1])) {
        filename = lines.pop() || ''
      }

      if (!language && filename) {
        language = filename.split('.').pop() || ''
      }

      codeBlocks.push({
        language,
        filename: filename.startsWith('/') ? filename.substring(1) : filename,
        code: lines.join('\n'),
      })
    }

    return codeBlocks
  }

  export function isFileName(str: string): boolean {
    // 基本文件名正则模式
    const fileNamePattern = /^[\[\]\w,\s-]*(\.[A-Za-z]+)+$/

    // 带路径的文件名正则模式
    const pathFilePattern = /^(.+\/)?([^/]+)$/

    // 检查是否是基本文件名格式
    if (fileNamePattern.test(str)) {
      return true
    }

    // 检查是否是带路径的文件名
    if (pathFilePattern.test(str)) {
      // 提取文件名部分
      const fileName = str.split('/').pop()
      // 再次检查提取的文件名是否符合基本文件名格式
      return fileName ? fileNamePattern.test(fileName) : false
    }

    return false
  }

  export function trimNewlines(str: string) {
    // 使用正则表达式匹配开头和结尾的换行符（支持 \n、\r 和 \r\n）
    return str.replace(/^[\n\r]+|[\n\r]+$/g, '')
  }
}
