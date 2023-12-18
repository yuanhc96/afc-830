import Cookies from 'js-cookie'
import Vue from 'vue'
import VueI18n from 'vue-i18n'

import { loadI18nJson } from '@/utils/i18n.js'
import elementEnLocale from 'element-ui/lib/locale/lang/en'; // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'; // element-ui lang
import zhCN from 'vxe-table/lib/locale/lang/zh-CN'
import enUS from 'vxe-table/lib/locale/lang/en-US'
import enLocale from './en'
import zhLocale from './zh'

Vue.use(VueI18n)

const messages = {
  en_US: {
    ...enLocale,
    ...elementEnLocale,
    ...enUS,
  },
  zh_CN: {
    ...zhLocale,
    ...elementZhLocale,
    ...zhCN,
  },
}

const i18n = new VueI18n({
  locale: Cookies.get('language') || 'zh_CN',
  messages,
  silentTranslationWarn: true,
})
// 外部国际化方法
window._i18n = (key, text, group = 'afc') => {
  const store = window[`i18n_store_${group}`]
  return !store || !store[key] ? text : store[key]
}
loadI18nJson('afc')
export default i18n
