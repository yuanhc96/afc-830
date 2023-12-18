// translate router.meta.title, be used in breadcrumb sidebar tagsview
import fetch from 'isomorphic-fetch'
import Cookies from 'js-cookie'
import i18n from '../lang/index'
export function generateTitle(title) {
  const hasKey = this.$te('route.' + title)
  const translatedTitle = this.$t('route.' + title) // $t :this method from vue-i18n, inject in @/lang/index.js

  if (hasKey) {
    return translatedTitle
  }
  return title
}
// 加载微前端的国际化文件资源
export function loadI18nJson(group = 'afc') {
  let lang = Cookies.get('language')
  lang = (lang || 'zh_CN').split('_')[0]
  if (lang && lang !== 'zh_CN') {
    let prefix = '.'
    if (group && group !== 'afc') {
      prefix = `./${group}`
    }
    fetch(`${prefix}/static/lang/${lang}.json`).then(response => {
      return response.json()
    }).then(json => {
      window[`i18n_store_${group}`] = json
    })
  } else {
    delete window[`i18n_store_${group}`]
  }
}
// 拼接微前端的国际化本地文件资源
export function mergeI18nLocaleMessage({zh,en}) {
  i18n.mergeLocaleMessage('en_US',en)        
  i18n.mergeLocaleMessage('zh_CN',zh)  
}
