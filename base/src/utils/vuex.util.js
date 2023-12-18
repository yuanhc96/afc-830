// import store from '@/store/index.js'
const registerModule = (...arg) => {
  if (arg.length === 1) {
    let modules = arg[0]
    if (!Array.isArray(modules)) {
      modules = [modules]
    }
    modules.forEach(({ key, module }) => {
      if (!window.baseVueStore._modules.root._children[key]) {
        window.baseVueStore.registerModule(key, module)
        console.log('register vuex module', key, module)
      }
    })
  } else if (arg.length === 2) {
    window.baseVueStore.registerModule(arg[0], arg[1])
    console.log('register vuex module', arg[0], arg[1])
  }
}
const registerController = (Controllers) => {
  if(window.baseVueStore){
    registerModule(Object.keys(Controllers.default).map(key => {
      return {
        key,
        module: Controllers.default[key]
      }
    }))
  }else{
    console.warn('未找到 baseVueStore')
  }
}

export default {
  registerModule,
  registerController,
}

