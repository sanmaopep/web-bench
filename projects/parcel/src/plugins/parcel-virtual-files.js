const { Resolver } = require('@parcel/plugin');
const path = require('path');
const fs = require('fs');
const glob = require('glob');

module.exports = new Resolver({
  async resolve({specifier, dependency, options}) {
    // 只处理 ~files 导入
    if (specifier !== '~files') {
      return null;
    }

    const cwd = options.projectRoot
    const files = glob.sync('src/files/**/*.ts', {cwd, absolute: true});

    const filePath = path.join(options.projectRoot, 'src/virtual-files.js')

    const imports = files.map((file, i) => 
      `import * as file${i} from './${path.relative(path.dirname(filePath), file)}';`
    ).join('\n');
    
    const exports = files.map((file, i) => 
      `  "${path.basename(file)}": file${i},`
    ).join('\n');

    const code = `${imports}
    
export default {
${exports}
};`;

    // 创建虚拟模块
    return {
      filePath,
      code,
      invalidateOnFileChange: files
    };
  }
}); 