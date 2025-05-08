const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');

class ImageCompressionPlugin {
  constructor(options = {}) {
    this.options = {
      test: /\.(png|svg)$/,
      quality: [0.6, 0.8],
      ...options
    };
  }

  apply(compiler) {
    // Only run in production mode
    if(compiler.options.mode !== 'production') return;

    compiler.hooks.emit.tapAsync('ImageCompressionPlugin', async (compilation, callback) => {
      const assets = compilation.getAssets();
      
      const imageAssets = assets.filter(asset => 
        this.options.test.test(asset.name)
      );

      try {
        await Promise.all(imageAssets.map(async asset => {
          // Get asset buffer
          const buffer = asset.source.source();

          const plugins = [
            asset.name.endsWith('.png') && imageminPngquant.default({
              quality: this.options.quality,
              strip: true
            }),
            asset.name.endsWith('.svg') && imageminSvgo.default({
              multipass: true
            })
          ].filter(Boolean);

          // Compress image
          const compressedBuffer = await imagemin.buffer(buffer, {
            plugins
          });

          // Update asset with compressed version
          compilation.updateAsset(
            asset.name,
            new compiler.webpack.sources.RawSource(compressedBuffer)
          );
        }));

        callback();
      } catch (err) {
        callback(err);
      }
    });
  }
}

module.exports = ImageCompressionPlugin;