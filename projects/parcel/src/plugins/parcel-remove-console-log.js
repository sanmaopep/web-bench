const { Transformer } = require('@parcel/plugin');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

module.exports = new Transformer({
  async transform({ asset }) {
    if (asset.type !== 'js') return [asset];

    if (asset.filePath.includes('node_modules')) {
      return [asset]
    }

    let code = await asset.getCode();
    
    // 解析代码生成 AST
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'] // 支持 JSX 和 TypeScript
    });

    // 遍历 AST 查找并移除 console.log
    traverse(ast, {
      CallExpression(path) {
        if (
          path.node.callee.type === 'MemberExpression' &&
          path.node.callee.object.name === 'console' &&
          path.node.callee.property.name === 'log'
        ) {
          path.remove();
        }
      }
    });

    // 生成代码
    const output = generate(ast, {}, code);
    asset.setCode(output.code);
    
    return [asset];
  }
});