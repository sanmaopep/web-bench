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

const marked = require('marked');
const matter = require('gray-matter');

module.exports = function(source) {
  // 存储找到的图片路径和对应的变量名
  const images = new Map();
  let imageCount = 0;
  
  // 自定义 renderer 来捕获和处理图片
  const renderer = new marked.Renderer();
  renderer.image = function({ href, title, text }) {
    if (href && !href.startsWith('http')) {
      // 为每个本地图片生成唯一的变量名
      const varName = `img${imageCount}`;
      images.set(href, varName);
      imageCount++;
      // 直接返回使用变量的图片标签
      return `<img src="\${${varName}}" alt="${text}"${title ? ` title="${title}"` : ''}>`;
    }
    // 对于外部图片，保持原样
    return `<img src="${href}" alt="${text}"${title ? ` title="${title}"` : ''}>`;
  };

  // 使用 gray-matter 解析 frontmatter 和内容
  const { data: frontmatter, content } = matter(source);
  const html = marked.parse(content, { renderer });

  // 生成图片 imports
  const imports = Array.from(images.entries())
    .map(([path, varName]) => `import ${varName} from ${JSON.stringify(path)};`)
    .join('\n');

  // 导出处理后的内容
  return `
    ${imports}
    const html = \`${html}\`;
    export const frontmatter = ${JSON.stringify(frontmatter)};
    export default html;
  `;
}