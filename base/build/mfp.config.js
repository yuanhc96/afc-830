const devMode = process.env.NODE_ENV === 'development'
const moduleName = 'base'
module.exports = {
  name: moduleName,
  filename: 'remoteEntry.js',
  exposes: {
    './controller': './src/actions/controller', // afcenter 服务接口
    './lib': './src/libs/index.js', // 公共方法和基础类， BaseVue，Form，List，ajaxUtil等
    './utils': './src/utils/index.js', // 普通工具类
    './api': './src/api/expose.js', // user menu 等 api
    './components': './src/components/index.js', // 常用组件 echarts，icon-select 等
    './elSelect': './node_modules/element-ui/lib/select.js',
    './permission': './src/permission/index.js', // 权限码
    './elMessage': './node_modules/element-ui/lib/message.js', // element-ui 组件

    './loadRemote': './src/utils/loadRemote.js', // 远程加载微应用的方法类
    './entry': './src/views/app/entry.js', // 高低开页面组件入口
  },
  shared: {
    vue: {
      requiredVersion: '^2.7.8',
      singleton: true,
      eager: true,
    },
  },
}
