const plugin = require('i18n-auto')
const path = require('path')
// const merge = require('./mergei18n.js')
const srcPath = path.resolve(__dirname, '../../../dist/assets/js')

const md5 = require('md5')
plugin.config({
  _test: true,
  excluded: /svg*|assets*|actions*|vendor.dll*/, // 排除文件选项（默认为：/node_modules/）
  src: srcPath, // 源文件目录（必选）

  outputPath: path.resolve(__dirname, '../../../dist/assets'),
  langPath: path.resolve(__dirname, '../../static/lang'), // 国际化配置输出目录（必选）

  // babel插件配置（以下为默认配置）
  pluginOptions: {
    $AI: '_i18n', // 全局方法$AI，参考localePolyfill.js
    group: 'afc', // 分组
    keyStrategy: (msg) => {
      return md5(msg)
    },
    filter: (msg) => {

    },
    // 排除不需要国际化配置的调用方法
    excludedCall: ['_i18n', '$AI', 'require', '$$AI', 'console.log', 'chalk.yellow'], // $$AI('value') 标记不翻译字符
    excludedPattern: /\.\w+$/, // // 排除不需要配置的字符串，默认文件名
  }
})

