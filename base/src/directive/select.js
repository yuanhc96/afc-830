import Vue from 'vue'
Vue.directive('select', {
  bind: function(el) {

  },
  updated: function(el) {
  },
  inserted: function(el) {
    el.children && el.children[0] && el.children[0].select()
  }
})
