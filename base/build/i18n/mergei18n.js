const fs = require('fs')
const path = require('path')

const merge = (src) => {
  const target = process.argv.slice(2)[0].split('=')[1] || 'en'
  const zhPath = src + '/zh.json'
  const enPath = src + '/' + target + '.json'
  console.log(zhPath, enPath)

  if (!fs.existsSync(zhPath)) {
    console.error('未找到 zh.json')
    return
  }

  if (!fs.existsSync(enPath)) {
    console.log('create ' + target + '.json')
    fs.copyFileSync(zhPath, enPath)
  } else {
    const zhJson = fs.readFileSync(zhPath).toString()
    const enJson = fs.readFileSync(enPath).toString()
    const zhObj = JSON.parse(zhJson)
    const enObj = JSON.parse(enJson)
    Object.assign(zhObj, enObj)
    fs.writeFileSync(enPath, JSON.stringify(zhObj, null, 2))
  }
}

merge(path.resolve(__dirname, '../../static/lang'))
module.exports = merge
