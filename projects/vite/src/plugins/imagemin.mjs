import imagemin from 'imagemin'
import imageminGifsicle from 'imagemin-gifsicle'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'
import imageminSvgo from 'imagemin-svgo'
import { createFilter } from '@rollup/pluginutils'

export default function imageminPlugin(options = {}) {
  const {
    include = /\.(png|jpg|jpeg|gif|svg)$/,
    exclude,
    quality = 75,
  } = options

  const filter = createFilter(include, exclude)

  return {
    name: 'vite-plugin-imagemin',
    apply: 'build', // 只在构建时运行
    enforce: 'post', // 在构建后运行

    async generateBundle(options, bundle) {
      for (const fileName in bundle) {
        if (!filter(fileName)) continue;
        
        const file = bundle[fileName];
        if (file.type !== 'asset') continue;

        const buffer = file.source;
        const optimizedBuffer = await imagemin.buffer(buffer, {
          plugins: [
            imageminGifsicle({
              optimizationLevel: 3
            }),
            imageminMozjpeg({
              quality
            }),
            imageminPngquant({
              quality: [quality / 100, 0.9]
            }),
            imageminSvgo({
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false
                }
              ]
            })
          ]
        });

        file.source = optimizedBuffer;
      }
    }
  }
} 