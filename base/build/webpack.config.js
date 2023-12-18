const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin') // 处理静态资源
const HtmlWebpackPlugin = require('html-webpack-plugin') // 处理模板页面
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 打包css文件
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const mfpConfig = require('./mfp.config.js')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const WindiCSSWebpackPlugin = require('windicss-webpack-plugin')

const Mfp = require('webpack').container.ModuleFederationPlugin
// const HappyPack = require('happypack')
const resolve = function(dir) {
  return path.resolve(__dirname, '../' + dir)
}
const devMode = process.env.NODE_ENV === 'development'
const supportIE = process.env.IE === 'true'
const mustBabel = !devMode && supportIE

console.log('support ie ' + mustBabel)
// webpack的基本配置
module.exports = {
  entry: mustBabel ? ['babel-polyfill', './src/main.js'] : './src/main.js', // 获取入口配置
  output: {
    filename: 'assets/js/[name].[chunkhash:5].js', // js 输出到 dist/js/xxx
    // publicPath: '', // 公用的公共路径 /
    path: resolve('../dist'), // 输出目录为 dist
  },
  externals: {
    // 'vue': 'Vue',
    // 'element-ui': 'ELEMENT'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src'),
      'vue$': 'vue/dist/vue.esm.js',
      'vue': 'vue/dist/vue.esm.js',
      '@lib': resolve('src/libs'),
      '@util': resolve('src/utils'),
      '@actions': resolve('src/actions'),
      '@static': resolve('static'),
      '@controller': resolve('src/actions/controller.js'),
    },
    fallback: {
      path: require.resolve('path-browserify'),
      https: require.resolve('https-browserify'),
      http: require.resolve('stream-http'),
      crypto: require.resolve('crypto-browserify'),
      fs: false,
      buffer: require.resolve('buffer/'),
      stream: require.resolve('stream-browserify'),
      timers: require.resolve('timers-browserify'),
    },
  },
  stats: {
    colors: true, // 打包时使用不同的颜色区分信息
    modules: true, // 打包时不显示具体模块信息
    entrypoints: true, // 打包时不显示入口模块信息
    children: true, // 打包时不显示子模块信息
  },
  module: {
    rules: [
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        exclude: [resolve('src/icons')],
        use: [
          {
            loader: 'url-loader',
            options: {
              publicPath: '../../',
              limit: 1024,
              esModule: false,
              name: 'assets/fonts/[name].[hash:5].[ext]'
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          publicPath: './',
          symbolId: 'icon-[name]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [resolve('src/icons')],
        options: {
          publicPath: './',
          limit: 10000,
          name: 'assets/images/[name].[hash:5].[ext]',
          esModule: false,
        }
      },
      // {
      //   test: /\.(eot)|(woff)|(ttf)$/i,
      //   use: [
      //     {
      //       loader: 'url-loader',
      //       options: {
      //         publicPath: '../../',
      //         limit: 1024,
      //         esModule: false,
      //         name: 'assets/fonts/[name].[hash:5].[ext]'
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.css$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        test: /\.scss$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      },
      mustBabel ? {
        test: /\.js$/,
        use: 'babel-loader'
      } : {},
    ],
  },
  plugins: [
    // new HappyPack({
    //   loaders: ['babel-loader']
    // }),
    new webpack.DllReferencePlugin({
      manifest: require('./dll/vendor.manifest.json')
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
    // new WindiCSSWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        // {
        //   from: resolve('public'),
        //   to: './',
        //   globOptions: {
        //     dot: true,
        //     gitignore: true,
        //     ignore: ["*.html"],
        //   },
        // },
        {
          from: resolve('static'),
          to: './static',
        },
        {
          from: resolve('config'),
          to: './config',
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './public/base.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[hash:5].css',
    }),
    new VueLoaderPlugin(),
    new Mfp(mfpConfig)
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'all',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
}
