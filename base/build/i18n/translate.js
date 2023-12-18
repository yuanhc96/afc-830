var Lang = require('i18n-zh2other/dist/lang').default
const config = {
  entry: {
    inPath: 'E:\\git_eos\\2022\\coframe2022-ui\\dist\\static\\lang', // 读取源文件
    outPath: 'E:\\git_eos\\2022\\coframe2022-ui\\dist\\static\\lang' // 输出目录
  },
  baiduTranslate: {
    key: 'EF5c1blVn5dht1QcVNtl',
    appid: '20201229000658689',
    url: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
    delay: 1100, // 延迟
    batchCount: 9, // dps (百度翻译开放平台普通版 dps 为 10/s , 故这里设为9)
  }
}
new Lang(config).startExecuteTranslate('en')
