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

interface CodeInfo {
  language: string
  filename: string
  code: string
}

const markdownLanguages = [
  // Programming languages
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

  // Frontend related
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

  // Template engines
  'pug',
  'ejs',

  // Script/Shell
  'bash',
  'shell',
  'powershell',
  'batch',
  'sql',

  // Markup languages
  'markdown',
  'md',
  'tex',
  'latex',
  'diff',

  // Configuration files
  'ini',
  'toml',
  'dockerfile',

  // Others
  'text',
  'plaintext',
  'diff',
  'console',
  'none',
]

export namespace MarkdownParser {
  export function parseMarkdownCodeBlocks(markdown: string): CodeInfo[] {
    // Regular expression to match Markdown code blocks
    const codeBlockRegex = /```([\s\S]+?)```/g

    // Store parsing results
    const codeBlocks: CodeInfo[] = []

    // Use regular expression to iterate through all matches
    let match
    while ((match = codeBlockRegex.exec(markdown)) !== null) {
      const content = match[1] || '\n'
      const lines = trimNewlines(content).split('\n')

      // Extract language identifier and filename

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
    // Basic filename regex pattern
    const fileNamePattern = /^[\[\]\w,\s-]*(\.[A-Za-z]+)+$/

    // Filename with path regex pattern
    const pathFilePattern = /^(.+\/)?([^/]+)$/

    // Check if it is a basic filename format
    if (fileNamePattern.test(str)) {
      return true
    }

    // Check if it is a filename with path
    if (pathFilePattern.test(str)) {
      // Extract filename part
      const fileName = str.split('/').pop()
      // Recheck if the extracted filename conforms to the basic filename format
      return fileName ? fileNamePattern.test(fileName) : false
    }

    return false
  }

  export function trimNewlines(str: string) {
    // Use regular expression to match line breaks at the beginning and end (supports \n, \r, and \r\n)
    return str.replace(/^[\n\r]+|[\n\r]+$/g, '')
  }
}
