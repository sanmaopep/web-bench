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