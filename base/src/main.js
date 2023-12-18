import Global from '@/libs/mixins/global.js';
import '@/styles/index.scss'; // global css
import 'animate.css';
import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
import Vue from 'vue';
import flowConfig from '../static/flow-config.json';
import App from './app.vue';
import './directive/index.js'; // global  directiveZ
import './filters/index.js'; // global filters
import './icons/index.js'; // icon
import './plugins/index.js';
// import initI18n from './lang/i18n.js';
import Cookies from 'js-cookie';
import i18n from './lang/index.js'; // Internationalization

// import appConfig from '../config/app-config.json' //升级SP1注释掉
import ReadConfig from './utils/config.js';
import './views/common/index.js';

Vue.mixin(Global)
window.Vue = Vue

Vue.config.flowConfig = flowConfig

Vue.config.title = 'TM20 MES ADP' // 登录页项目名称取值定义
Vue.config.silent = true
Vue.config.productionTip = false
Vue.config.sys_error_show = true
Vue.config.lang = Cookies.get('language') || 'zh_CN'
Vue.config.login_type = 'normal'
Vue.config.permissionSwitch = true
Vue.config.devtools = true
Vue.config.apiPrefixSwitch = true // 动态添加请求前缀 appName 的开关

Vue.config.pagination = {
  limitAlias: 'pageSize',
  offsetAlias: 'pageIndex'
}
// Vue.config.appConfig = appConfig

Vue.prototype.$BaseBus = new Vue() // 注入一个全局事件总线
Vue.prototype.$bus = new Vue()

// debugger
window.$BaseBus = Vue.prototype.$BaseBus
;
(async() => {
  await ReadConfig(Vue)
  import ('./plugins/primeton-ui.js')
  // await initI18n()
  const router = await

  import ('./router/index.js')
  const store = await
  import ('./store/index.js')
  await
  import ('./errorLog') // error log
  await
  import ('./router/before') // permission control
  new Vue({
    el: '#app',
    router: router.default,
    store: store.default,
    i18n,
    components: {
      App
    },
    template: '<App/>'
  })
})()
