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

const path = require('path');

class MarkdownResolverPlugin {
  constructor(options = {}) {
    this.defaultLang = options.defaultLang || 'zh';
  }

  apply(resolver) {
    const target = resolver.ensureHook('file');

    resolver.getHook('resolve').tapAsync(
      'MarkdownResolverPlugin',
      (request, resolveContext, callback) => {
        if (!request.request || typeof request.request !== 'string' || !request.request.endsWith('.md')) {
          return callback();
        }

        const context = request.context?.issuer 
          ? path.dirname(request.context.issuer)
          : request.path;

        if (!context) {
          return callback();
        }

        try {
          const mdPath = request.request;
          const dirName = path.dirname(mdPath);
          const baseName = path.basename(mdPath, '.md');

          const localizedPath = path.join(dirName, `${baseName}.${this.defaultLang}.md`);

          const resolvedLocalizedPath = resolver.join(context, localizedPath)
          resolver.fileSystem.stat(
            resolvedLocalizedPath,
            (err, stat) => {
              if (!err && stat && stat.isFile()) {
                const obj = Object.assign({}, request, {
                  path: resolvedLocalizedPath
                });
                resolver.doResolve(
                  target,
                  obj,
                  `localized file: ${localizedPath}`,
                  resolveContext,
                  (...args) => {
                    callback(...args)
                  }
                );
              } else {
                callback();
              }
            }
          );
        } catch (error) {
          console.error('[MarkdownResolverPlugin] Error:', error);
          callback();
        }
      }
    );
  }
}

module.exports = MarkdownResolverPlugin; 