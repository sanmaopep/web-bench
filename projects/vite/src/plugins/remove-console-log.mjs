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