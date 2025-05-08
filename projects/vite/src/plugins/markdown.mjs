import fs from 'node:fs'
import path from 'node:path'
import { marked } from 'marked'
import matter from 'gray-matter'

function markdown(options = {}) {
  const { language } = options
  
  return {
    name: 'vite:markdown',
    enforce: 'pre',
    
    async resolveId(source, importer, options) {
      // 只处理 .md 文件
      if (!source.endsWith('.md')) return null
      
      // 如果没有设置语言，使用原始路径
      if (!language) return null
      
      if (!importer) return null
      
      // 获取原始文件的绝对路径
      let originalPath
      if (path.isAbsolute(source)) {
        originalPath = source
      } else {
        originalPath = path.resolve(path.dirname(importer), source)
      }
      
      // 构造语言特定的路径
      const dir = path.dirname(originalPath)
      const basename = path.basename(originalPath)
      const languagePath = path.join(dir, basename.replace('.md', `.${language}.md`))
      
      console.log('languagePath', languagePath)
      
      // 检查语言特定的文件是否存在
      try {
        await fs.promises.access(languagePath)
        return languagePath
      } catch {
        // 如果语言特定的文件不存在，返回原始路径
        try {
          await fs.promises.access(originalPath)
          return null // 返回 null 让其他插件继续处理
        } catch {
          return null
        }
      }
    },
    
    // 添加 handleHotUpdate 钩子以支持 HMR
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.md')) {
        server.ws.send({
          type: 'full-reload'
        })
        return []
      }
    },

    transform(code, id) {
      if (id.endsWith('.md')) {
        const dir = path.dirname(id)
        const fileContent = fs.readFileSync(id, 'utf-8')
        
        // 解析 frontmatter
        const { data: frontmatter, content } = matter(fileContent)
        
        const imports = new Set()
        let importIndex = 0
        
        const renderer = new marked.Renderer()
        renderer.image = (href, title, text) => {
          if (href.startsWith('http')) {
            return `<img src="${href}" alt="${text}"${title ? ` title="${title}"` : ''}>`
          } else {
            const varName = `_img${importIndex++}`
            const imagePath = path.join(dir, href)
            console.log('md path', imagePath, dir, href)
            imports.add(`import ${varName} from "${imagePath}";`)
            return `<img src="\${${varName}}" alt="${text}"${title ? ` title="${title}"` : ''}>`
          }
        }

        // 使用解析后的 content 而不是原始的 fileContent
        const html = marked.parse(content, { renderer })
        
        // 生成最终的代码，包括 frontmatter 导出
        const code = `
          ${Array.from(imports).join('\n')}
          const html = \`${html}\`;
          export const frontmatter = ${JSON.stringify(frontmatter)};
          export default html;
        `
        
        return {
          code: code
        }
      }
    }
  }
}

export default markdown