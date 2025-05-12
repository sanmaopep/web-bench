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

const { Reporter } = require('@parcel/plugin');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);
const unlink = promisify(fs.unlink);

module.exports = new Reporter({
  async report({ event, options }) {
    // 只在生产构建完成后执行
    if (event.type !== 'buildSuccess' || options.mode !== 'production') {
      return;
    }

    const { bundleGraph } = event;
    const bundles = bundleGraph.getBundles();
    
    // 创建 sourcemaps 目录
    const projectRoot = options.projectRoot;
    const sourcemapsDir = path.join(projectRoot, 'sourcemaps');
    
    try {
      await mkdir(sourcemapsDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') {
        console.error('创建 sourcemaps 目录失败:', err);
        throw err;
      }
    }

    // 处理每个包含源映射的包
    for (const bundle of bundles) {
      const filePath = bundle.filePath;
      const mapPath = `${filePath}.map`;
      
      // 检查是否存在源映射文件
      try {
        await fs.promises.access(mapPath, fs.constants.F_OK);
      } catch (err) {
        // 没有源映射文件，跳过
        continue;
      }

      const distDir = path.join(projectRoot, 'dist')

      const relativePath = path.relative(distDir, filePath);
      const targetMapDir = path.join(sourcemapsDir, path.dirname(relativePath));
      const targetMapPath = path.join(sourcemapsDir, relativePath) + '.map';

      // 确保目标目录存在
      await mkdir(targetMapDir, { recursive: true });
      
      // 复制源映射文件到新位置
      await copyFile(mapPath, targetMapPath);
      
      // 删除原始源映射文件
      await unlink(mapPath);
      
      // 更新 JS/CSS 文件中的 sourceMappingURL 注释
      if (bundle.type === 'js' || bundle.type === 'css') {
        let content = await readFile(filePath, 'utf8');
        
        // 根据文件类型移除现有的 sourceMappingURL 注释（如果有）
        if (bundle.type === 'js') {
          content = content.replace(/\/\/# sourceMappingURL=.*$/m, '');
        } else if (bundle.type === 'css') {
          content = content.replace(/\/\*# sourceMappingURL=.*\*\/$/m, '');
        }
        
        // 添加新的 sourceMappingURL 注释
        const sourcemapRelativePath = relativePath + '.map';
        const sourcemapUrl = `https://internal.com/sourcemaps/${sourcemapRelativePath.replace(/\\/g, '/')}`;
        
        // 根据文件类型添加适当的注释
        if (bundle.type === 'js') {
          content += `\n//# sourceMappingURL=${sourcemapUrl}\n`;
        } else if (bundle.type === 'css') {
          content += `\n/*# sourceMappingURL=${sourcemapUrl} */\n`;
        }
        
        // 写回文件
        await writeFile(filePath, content);
      }
    }
    
    console.log('源映射文件已移动到 sourcemaps 目录，并更新了引用链接。');
  }
}); 