const { Transformer } = require('@parcel/plugin');
const marked = require('marked');
const matter = require('gray-matter');
const path = require('path')

exports.default = new Transformer({
  async transform({ asset }) {
    // 只处理 .md 文件
    if (asset.type !== 'md') {
      return [asset];
    }

    const dir = path.dirname(asset.filePath)

    // 获取 markdown 内容
    const source = await asset.getCode();
    
    // 解析 frontmatter
    const { data: frontmatter, content } = matter(source);
    
    const imports = new Set()
    let importIndex = 0
    
    const renderer = new marked.Renderer()
    renderer.image = (href, title, text) => {
        if (href.startsWith('http')) {
        return `<img src="${href}" alt="${text}"${title ? ` title="${title}"` : ''}>`
        } else {
        const varName = `_img${importIndex++}`
        imports.add(`import ${varName} from "${href}";`)
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

    // 设置新的代码和类型
    asset.type = 'js';
    asset.setCode(code);

    return [asset];
  }
}); 