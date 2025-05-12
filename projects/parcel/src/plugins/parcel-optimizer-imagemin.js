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

const { Optimizer } = require('@parcel/plugin');
const utils = require('@parcel/utils');
const imagemin = require('imagemin');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');

module.exports = new Optimizer({
  async optimize({ contents, map, bundle }) {
    // 检查文件类型是否为图片
    const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];
    if (!supportedExtensions.some(ext => bundle.getMainEntry().filePath.endsWith(ext))) {
      return { contents, map };
    }

    // 只在构建命令时运行
    if (process.env.NODE_ENV !== 'production') {
      return { contents, map };
    }

    const buffer = await utils.blobToBuffer(contents)

    const optimizedBuffer = await imagemin.default.buffer(buffer, {
      plugins: [
        imageminGifsicle({
          optimizationLevel: 3
        }),
        imageminJpegtran({
          progressive: true
        }),
        imageminPngquant({
          quality: [0.6, 0.8],  // 压缩质量范围
          speed: 4,             // 压缩速度（1-11，1最慢但质量最好）
          strip: true          // 删除不必要的元数据
        }),
        imageminSvgo.default({
          plugins: [
            {
              name: 'removeViewBox',
              active: false
            }
          ]
        })
      ]
    });

    return {
      contents: optimizedBuffer,
      map
    };
  }
}); 