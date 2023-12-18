import { localStore } from '@util/sessionStore'
//判断一个字符串是不是json格式
export const isJSON = str => {
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
}
//解析出来${XX} => ['XX'...]
const getExecStrs = str => {
  var reg = /\$\{(.+?)\}/g
  var list = []
  var result = null
  do {
    result = reg.exec(str)
    result && list.push(result[1])
  } while (result)

  return list
}
//aa=a1&bb=b1=>{aa:a1,bb:b1} 把query参数变成对象;并支持解析userInfo
export const toQueryObject = str => {
  if (!str) {
    return null
  }
  if (str instanceof Object){
    return str
  }
  const userInfo = localStore.get('user') || {}
  let obj = {}
  let arr = typeof str === 'string' && str.split('&')
  if (arr) {
    arr.forEach(item => {
      let tempArr = item.split('=')
      let key = decodeURIComponent(tempArr[0])
      let val = ''
      if (tempArr[1].indexOf('${') != -1) {
        //包含当前用户信息； 需解析
        const userKey = getExecStrs(tempArr[1])[0]
        val = userInfo[userKey] ? userInfo[userKey] : null
      } else {
        val = decodeURIComponent(tempArr[1])
      }
      obj[key] = val
    })
  }
  return obj
}
//例如${userName}解析出userInfo，并返回字符串
export function replaceValueByUser(str){
  const user = localStore.get('user') || {}
  const list = getExecStrs(str)
  for (const item of list) {
      str = str.replace('${' + item + '}', user[item])
  }
  return str
}
//  获取地址栏参数
export function getUrlParam(name, url) {
  let qs = arguments[1] || window.location.href,
    reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
    r = qs.substr(qs.indexOf('?') + 1).match(reg)
  if (r !== null) {
    let i = decodeURI(r[2]).indexOf('#')
    if (i !== -1) {
      return decodeURI(r[2]).substring(0, i)
    } else {
      return decodeURI(r[2])
    }
  } else {
    return ''
  }
}

export function getQueryVariable(variable) {
  let query = window.location.search
  let hash = window.location.hash
  let queryStr = query ? query.substring(1) : hash ? hash.split('?')[1] : ''

  var vars = queryStr ? queryStr.split('&') : []
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] == variable) {
      return pair[1]
    }
  }
  return false
}
