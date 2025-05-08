const path = require('path');
const fs = require('fs');

class LicenseExtractorPlugin {
  constructor(options = {}) {
    this.filename = options.filename || 'vendor-licenses.txt';
  }

  apply(compiler) {
    compiler.hooks.done.tap('LicenseExtractorPlugin', (stats) => {
      const modules = stats.compilation.modules;
      const licenses = new Map();

      // 遍历所有模块
      modules.forEach(module => {
        if (module.resource && module.resource.includes('node_modules')) {
          const packagePath = this.findPackageJson(module.resource);
          if (packagePath) {
            try {
              const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
              const packageInfo = {
                name: packageJson.name,
                version: packageJson.version,
                license: packageJson.license || 'Unknown',
                author: packageJson.author ? 
                  (typeof packageJson.author === 'string' ? packageJson.author : packageJson.author.name)
                  : 'Unknown'
              };
              // 使用 包名@版本号 作为唯一标识
              const packageKey = `${packageJson.name}@${packageJson.version}`;
              licenses.set(packageKey, packageInfo);
            } catch (error) {
              console.warn(`无法读取包信息: ${packagePath}`);
            }
          }
        }
      });

      // 生成许可证文本
      let licenseText = '# Third Party Licenses\n\n';
      // 按照包名排序，确保输出结果稳定
      const sortedEntries = Array.from(licenses.entries()).sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
      
      sortedEntries.forEach(([packageKey, pkg]) => {
        licenseText += `## ${packageKey}\n`;
        licenseText += `- License: ${pkg.license}\n`;
        licenseText += `- Author: ${pkg.author}\n\n`;
      });

      // 写入文件
      const outputPath = path.join(compiler.options.output.path, this.filename);
      fs.mkdirSync(compiler.options.output.path, { recursive: true });
      fs.writeFileSync(outputPath, licenseText);
    });
  }

  findPackageJson(modulePath) {
    let currentDir = path.dirname(modulePath);
    const rootDir = path.parse(currentDir).root;

    while (currentDir !== rootDir) {
      const packagePath = path.join(currentDir, 'package.json');
      if (fs.existsSync(packagePath)) {
        return packagePath;
      }
      currentDir = path.dirname(currentDir);
    }
    return null;
  }
}

module.exports = LicenseExtractorPlugin; 