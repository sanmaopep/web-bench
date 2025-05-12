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

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const SourceMapsPlugin = require('./plugins/source-maps-plugin')
const ts = require('typescript')
const LicenseExtractorPlugin = require('./plugins/license-extractor-plugin')
const fs = require('fs')
const ImageCompressionPlugin = require('./plugins/image-compression-plugin')
const MarkdownResolverPlugin = require('./plugins/markdown-resolver-plugin')

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
    assetModuleFilename: '[name][ext]'
  },
  devtool: 'source-map',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~files': path.resolve(__dirname, './virtual-files-loader.js')
    },
    extensions: ['.js', '.ts', '.jsx'],
    plugins: [
      new MarkdownResolverPlugin({ 
        defaultLang: 'zh'
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.(svg|png)$/,
        type: 'asset/resource'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.module\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          'less-loader'
        ]
      },
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            getCustomTransformers: () => ({
              before: [
                (context) => {
                  return (sourceFile) => {
                    function visitor(node) {
                      if (ts.isExpressionStatement(node) &&
                        ts.isCallExpression(node.expression) &&
                        ts.isPropertyAccessExpression(node.expression.expression) &&
                        ts.isIdentifier(node.expression.expression.expression) &&
                        node.expression.expression.expression.text === 'console' &&
                        node.expression.expression.name.text === 'log') {
                        return undefined;
                      }
                      return ts.visitEachChild(node, visitor, context);
                    }
                    return ts.visitNode(sourceFile, visitor);
                  };
                }
              ]
            })
          }
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /virtual-files-loader\.js$/,
        use: [
          {
            loader: 'val-loader',
            options: {
              pattern: path.resolve(__dirname, 'src/files/**/*.ts')
            }
          }
        ]
      },
      {
        test: /\.md$/,
        use: [
          './plugins/markdown-loader.js'
        ]
      }
    ]
  },
  devServer: {
    port: process.env.PROJECT_PORT || 3000,
    historyApiFallback: true,
    proxy: {
      '/postman': {
        target: 'https://postman-echo.com',
        pathRewrite: {'^/postman' : ''},
        changeOrigin: true
      }
    },
    onBeforeSetupMiddleware: function (devServer) {
      const mockData = JSON.parse(fs.readFileSync('./mock.json'))
      for (const [route, response] of Object.entries(mockData)) {
        const [method, path] = route.split(' ')
        devServer.app[method.toLowerCase()](path, (req, res) => {
          res.json(response)
        })
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.__VERSION__': JSON.stringify('v1.0.0'),
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    }),
    new VueLoaderPlugin(),
    new SourceMapsPlugin(),
    new LicenseExtractorPlugin(),
    new ImageCompressionPlugin({
      quality: [0.3, 0.5]
    })
  ],
  target: ['web', 'es2020'],
}