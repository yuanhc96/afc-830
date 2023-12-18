import Vue from 'vue'
import store from './store'

// you can set only in production env show the error-log
// if (process.env.NODE_ENV === 'production') {
Vue.config.warnHandler = function(msg,vm,info,trace){

}
Vue.config.errorHandler = function(err, vm, info, a) {
  // detail see https://forum.vuejs.org/t/dispatch-in-vue-config-errorhandler-has-some-problem/23500
  Vue.nextTick(() => {
    store.dispatch('addErrorLog', {
      err,
      vm,
      info,
      url: window.location.href,
    })
    console.error(err, info)
  })
}

// }
