const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.js');
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 清除 dist 目录
const prodConfig = {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      // 设置为all, chunk可以在异步和非异步chunk之间共享。
      cacheGroups: {
        assets: {
          name: 'assets',
          test: /[\\/]src[\\/]assets[\\/]/,
          minSize: 1024,
          chunks: 'all',
          priority: 10
        },
        svg: {
          name: 'svg',
          test: /[\\/]src[\\/]icons[\\/]/,
          minSize: 1024,
          chunks: 'all',
          priority: 10
        },
        common: {
          name: 'common',
          test: /[\\/]src[\\/]views[\\/]common[\\/]/,
          minSize: 1024,
          chunks: 'initial',
          priority: 5
        },
        actions: {
          name: 'actions',
          test: /[\\/]src[\\/]actions[\\/]/,
          minSize: 1024,
          chunks: 'initial',
          priority: 5
        },
        default: {
          minChunks: 2, // 被超过两个模块引用，才会被打包（可以去掉）
          priority: -20, // 优先级
          reuseExistingChunk: true, // 如果一个模块已经被打包过了，那么这个模块也不会被打包
        },
      }
    },
  },
  
  plugins: [
    new CleanWebpackPlugin(),
    new CompressionWebpackPlugin({
      filename: '[path][name][ext].gz',
      test: /\.(js|css)$/i
    }),
    new UglifyJsPlugin({
			uglifyOptions: {
				compress: {
				  drop_console: true,
          drop_debugger: false,
          pure_funcs: ['console.log'] //移除console
				},
        output: {
          comments: false
        },
			},
			parallel: true
		})
  ]
};
module.exports = merge(baseConfig, prodConfig);
