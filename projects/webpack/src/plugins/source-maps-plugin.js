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
const fs = require('fs');

class SourceMapsPlugin {
  constructor(options = {}) {
    this.sourcemapHost = options.sourcemapHost || 'https://internal.com';
    this.sourcemapDir = options.sourcemapDir || 'sourcemaps';
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('SourceMapsPlugin', (compilation) => {
      compilation.hooks.afterProcessAssets.tap('SourceMapsPlugin', () => {
        const outputPath = compilation.outputOptions.path;
        const sourcemapsPath = path.resolve(process.cwd(), this.sourcemapDir);

        if (!fs.existsSync(sourcemapsPath)) {
          fs.mkdirSync(sourcemapsPath, { recursive: true });
        }

        const assets = compilation.getAssets();

        assets.forEach(asset => {
          const filename = asset.name;
          if (!filename.endsWith('.map')) return;

          const sourceFile = filename.slice(0, -4);
          const sourceContent = compilation.assets[sourceFile]?.source();
          if (!sourceContent) return;

          const sourcemapContent = asset.source.source();
          const relativePath = path.relative(outputPath, path.join(outputPath, filename));
          const sourcemapOutputPath = path.join(sourcemapsPath, relativePath);
          
          fs.mkdirSync(path.dirname(sourcemapOutputPath), { recursive: true });
          fs.writeFileSync(sourcemapOutputPath, sourcemapContent);

          const sourcemapUrl = `${this.sourcemapHost}/${this.sourcemapDir}/${relativePath}`;
          const sourceExt = path.extname(sourceFile);
          
          let newContent = sourceContent;
          console.log('sourceExt', sourceExt)
          if (sourceExt === '.js') {
            newContent = sourceContent.replace(/\/\/# sourceMappingURL=.+$/m, '');
            newContent = newContent + '\n//# sourceMappingURL=' + sourcemapUrl;
          } else if (sourceExt === '.css') {
            newContent = sourceContent.replace(/\/\*# sourceMappingURL=.+\*\//m, '');
            newContent = newContent + '\n/*# sourceMappingURL=' + sourcemapUrl + ' */';
          }

          compilation.updateAsset(sourceFile, new compiler.webpack.sources.RawSource(newContent));
          compilation.deleteAsset(filename);
        });
      });
    });
  }
}

module.exports = SourceMapsPlugin;