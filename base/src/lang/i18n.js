import Cookies from 'js-cookie'

window._i18n = (key, value) => {
  return value
}
const get = function(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('get', url, true)
    xhr.onload = function() {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        reject(null)
      }
    }
    xhr.onerror = function() {
      reject(null)
    }
    xhr.send(null)
  })
}

const initI18n = async() => {
  const lang = Cookies.get('language') || 'zh_CN'
  const resp = await get(`/static/lang/${lang}.json`)
  console.log('加载语言包...')
  if (resp) {
    window.LOCAL = {
      [lang]: resp
    }
    window._i18n = (key, value) => {
      if (window.LOCAL && window.LOCAL[Cookies.get('language')]) {
        const val = window.LOCAL[Cookies.get('language')][key]
        return val ? val.trim() : value
      } else {
        return value
      }
    }
  }
}
export default initI18n

