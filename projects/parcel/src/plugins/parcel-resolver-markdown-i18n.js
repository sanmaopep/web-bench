const { Resolver } = require('@parcel/plugin');
const path = require('path');
const fs = require('fs');

module.exports = new Resolver({
  async resolve({ specifier, options, dependency }) {
    // 只处理 .md 文件
    if (!specifier.endsWith('.md')) {
      return null;
    }

    // 获取语言设置，默认为 'zh'
    const language = options.env.language || 'zh';
    
    // 构建可能的本地化文件路径
    const dir = path.dirname(dependency.resolveFrom);
    const basename = path.basename(specifier, '.md');
    const localizedPath = path.join(dir, `${basename}.${language}.md`);
    
    // 检查本地化文件是否存在
    try {
      await fs.promises.access(localizedPath);
      // 如果本地化文件存在，返回该文件路径
      return {
        filePath: localizedPath,
      };
    } catch (err) {
      // 如果本地化文件不存在，返回原始文件路径
      return {
        filePath: path.join(dir, specifier),
      };
    }
  }
}); 