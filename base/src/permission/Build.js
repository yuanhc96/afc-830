/**
 * Created by binwang on 18/7/20.
 * 生成 FuncCode.js文件
 */

const fs = require('fs')
const moment = require('dayjs')
const http = require('http')
const Path = require('path')
const _ = require('lodash')
const FuncCodeOld = require('./FuncCodeOld.js')
const Handlebars = require('handlebars')

function resolve(dir) {
  return Path.join(__dirname, '/' + dir)
}

function buildByText(data) {
  const action_tpl = Handlebars.compile(fs.readFileSync(resolve('FuncCode.tpl'), 'utf-8'))
  let list = data.split('\n')

  let newCount = 0
  list = list
    .filter(l => !!l && l !== '')
    .map(line => {
      const names = line.split(' ')
      let comments = `// ${names[1]} `
      let status = null
      if (!FuncCodeOld[names[0]]) {
        newCount++
        status = 'new'
        comments += '\t new'
      }
      return {
        name: names[0].trim(),
        type: names[2].trim(),
        status,
        comments: comments,
      }
    })

  list = _.sortBy(list, l => l.name)

  const buttons = list.filter(l => l.type === 'button')
  const menus = list.filter(l => l.type === 'menu')

  console.log({
    'all count': list.length,
    'button count': buttons.length,
    'menu count': menus.length,
    'new count': newCount,
  })
  _.forEach(FuncCodeOld)
  const result = action_tpl({
    buttons,
    menus,
    date: moment(new Date()).format('YYYY-MM-DD HH:mm'),
  })
  fs.writeFileSync(resolve('FuncCode.js'), result)
}

(function() {
  fs.readFile(resolve('FuncCode.txt'), 'utf-8', function(error, data) {
    buildByText(data)
  })
})()
