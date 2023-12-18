
const path = require('path')
const DllPlugin = require('webpack/lib/DllPlugin')
module.exports = {
  entry: {
    vendor: [
      'vue/dist/vue.esm.js',
      'vue-i18n',
      'tinymce',
      // 'vuex',
      // 'd3',
      // 'echarts',
      // 'primeton-ui',
      '@antv/g6',
      'vxe-table',
      'lodash',
      'lodash.debounce',
      'store'
    ]
  },
  output: {
    filename: '[name].dll.js',
    path: path.join(__dirname, '../static/js'),
    library: '_dll_[name]'
  },
  plugins: [
    new DllPlugin({
      name: '_dll_[name]',
      context: __dirname, // 必填
      path: path.join(__dirname, '.', 'dll/[name].manifest.json')
    })
  ]
}
