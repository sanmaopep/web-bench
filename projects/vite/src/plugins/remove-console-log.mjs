import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';

export default function removeConsoleLog() {
  return {
    name: 'remove-console',
    transform(code, id) {
      if (!id.match(/\.[jt]sx?$/)) return;

      try {
        const ast = parser.parse(code, {
          sourceType: 'module',
          plugins: ['jsx', 'typescript']
        });

        traverse.default(ast, {
          CallExpression(path) {
            if (
              t.isMemberExpression(path.node.callee) &&
              t.isIdentifier(path.node.callee.object, { name: 'console' }) &&
              t.isIdentifier(path.node.callee.property, { name: 'log' })
            ) {
              if (t.isExpressionStatement(path.parent)) {
                path.parentPath.remove();
              }
            }
          }
        });

        const output = generate.default(ast, {
          retainLines: true,
          compact: false
        }, code);

        return {
          code: output.code,
          map: output.map
        };
      } catch (error) {
        console.error('Error processing file:', id, error);
        return null;
      }
    }
  };
} 