import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import i18n from '../lang'
Vue.use(Element, {
  size: 'mini',
  zIndex: 3000,
  i18n: (key, value) => i18n.t(key, value)
})
