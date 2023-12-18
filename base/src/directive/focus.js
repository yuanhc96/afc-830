import Vue from 'vue'
Vue.directive('focus', {
  bind: function(el) {

  },
  updated: function(el,binding) {
   
  },
  inserted: function(el,binding,vnode) {
    if(binding.value === true || binding.value === undefined){
      setTimeout(() => {
        el.children && el.children[0] && el.children[0].focus()
      }, 50)
    }
  }
})
