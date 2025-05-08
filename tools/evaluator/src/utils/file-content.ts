import path from 'path'
import fs from 'promise-fs'

type Strategy =
  | {
      type: 'custom-mode'
      match: (filePath: string) => boolean
      rewriteIgnore: boolean
      getFileContent(filepath: string): Promise<string>
    }
  | {
      type: 'extname-mode'
      extname: string[]
      rewriteIgnore: boolean
      getFileContent(filepath: string): Promise<string>
    }

const strategies: Strategy[] = [
  {
    type: 'extname-mode',
    extname: ['.png'],
    rewriteIgnore: true,
    getFileContent: async () => '<Binary content...>',
  },
  {
    type: 'custom-mode',
    rewriteIgnore: false,
    // 兜底
    match: () => true,
    getFileContent: async (filepath: string) =>
      await fs.readFile(filepath, {
        encoding: 'utf-8',
      }),
  },
]
export const getFileContent = async (fullPath: string) => {
  for (const strategy of strategies) {
    if (strategy.type === 'extname-mode' && strategy.extname.includes(path.extname(fullPath))) {
      return await strategy.getFileContent(fullPath)
    }

    if (strategy.type === 'custom-mode' && strategy.match(fullPath)) {
      return await strategy.getFileContent(fullPath)
    }
  }

  return ''
}

export const checkFileRewriteIgnore = async (fullPath: string) => {
  for (const strategy of strategies) {
    if (strategy.type === 'extname-mode' && strategy.extname.includes(path.extname(fullPath))) {
      return await strategy.rewriteIgnore
    }

    if (strategy.type === 'custom-mode' && strategy.match(fullPath)) {
      return await strategy.rewriteIgnore
    }
  }

  return false
}
