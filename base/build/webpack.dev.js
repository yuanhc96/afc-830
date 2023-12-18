const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.config.js')

const devConfig = {
  mode: 'development',
  devtool: 'source-map',
  target: ['web', 'es5'], // 必须配置, 否则无法热更新代码
  optimization: {
    runtimeChunk: 'single' // 必须配置, 否则无法热更新代码
  },
  devServer: {
    open: true,
    hot: true,
    port: 8000,
    client: {
      logging: 'error',
      overlay: {
        errors: true,
        warnings: false
      }
    },
    proxy: {
      // '/AFCENTER': {
      //   target: 'http://10.15.15.151:14083/',
      //   pathRewrite: { '^/AFCENTER': '' }
      //
      // },
      '/org': {
        target: 'http://10.15.15.151:28082/org',
      },
      '/afc/api': {
        target: 'http://10.15.15.151:13083/',
        pathRewrite: { '^/afc': '' }
        // target: 'http://10.15.15.151:13083/',
        // target: 'http://192.168.31.154:28083/',
        // target: 'http://10.89.4.186:13083',
        // target: 'http://192.168.6.25:8081/oac',
        // target: 'http://172.50.1.137:28082/'
      },
      '/afc/pro': {
        target: 'http://10.15.15.151:12023/',
        pathRewrite: { '^/afc': '' }
      },
      '/process': {
        target: 'http://localhost:8002/',
      },
      '/objectDemo': {
        target: 'http://localhost:9004/',
      },
      '/bfp': {
        target: 'http://localhost:8010/',
        // target: 'http://localhost:9000/',
      },
      '/demo1': {
        target: 'http://localhost:9003/',
      },
      '/ide': {
        target: 'http://localhost:8080/',
      },
      '/formDesigner': {
        target: 'http://localhost:9014/',
      },
      '/portal': {
        target: 'http://localhost:9007/',
      },
      '/widget': {
        target: 'http://localhost:9008/',
      },
      '/components': {
        target: 'http://localhost:9005/',
      },
      '/EOS8-DEMO-APP': {
        target: 'http://10.15.15.151:12023',
        pathRewrite: { '^/EOS8-DEMO-APP': '' }
      },
      // '/AFCENTER': {
      //   target: 'http://10.15.15.151:14082',
      //   // target: 'http://10.15.15.151:13083',
      //   // target: 'http://192.168.31.154:28083',
      //   pathRewrite: { '^/AFCENTER': '' }
      // },
      '/AFCENTER': {
        target: 'http://10.15.15.151:14082/',
        pathRewrite: { '^/AFCENTER': '' }
      }
    }

  },
}
module.exports = merge(baseConfig, devConfig)
