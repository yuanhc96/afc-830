import ajaxUtil from '@/libs/ajaxUtil'
import router from '@/router'
import { getOriginUrl, getToken, removeOriginUrl, removeToken, setLoginType, setOriginUrl, setToken } from '@/utils/auth'; // getToken from cookie
import { localStore } from '@/utils/sessionStore'
import { dealWaterMark } from "@/utils/watermark"
import { getUrlParam, toQueryObject } from "@util/tools.js"
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import Vue from 'vue'
import store from '../store'
NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['/login','/auth'] // no redirect whitelist

const addRoutes = (parentName, routes)=>{
  router.addRoutes(routes)
}

const setAuthorization = () => {
  setLoginType(Vue.config.login_type || "normal")
  const finalTarget = getUrlParam('Authorization')
  setToken(finalTarget)
  localStore.set('uniqueId', finalTarget)
  if (Vue.config.homePage && Vue.config.homePage === 'portal') {
    store.commit('SET_PLATFORM', 'portal')
    router.push({ path: 'portal-index', query: { type: 'private' }})
  } else {
    store.commit('SET_PLATFORM', null)
    setOriginUrl(window.location.href.replace('Authorization', 'a'))
    window.location.href = './index.html'
  }
}
router.beforeEach((to, from, next) => {
  let routers = []
  if(to.query && to.query.appId){
    routers = store.getters.appMenus[to.query.appId] || []
  }else{
    routers = localStore.get('menus') || []
  }
  let redirect = true
  if (to.fullPath === '/dashboard' && routers.length) {
    redirect = true //登录成功重定向到第一个菜单， routers存在时页面在首页不需要重定向
    //redirect = false
  }
  NProgress.start() // start progress bar
  if (to.path === '/login' && to.query.token) {
    // 如果路由为login且带有token参数，自动删除缓存中的token重新登录
    removeToken()
  }
  // next()
  // return
  const token = getToken()

  if (token) {
    // determine if there has token
    /* has token*/
    if (getUrlParam('Authorization')) {
      // url上带Authorization，放行
      setAuthorization();
    } else if (to.path.startsWith('/model_manage') && !localStore.get('isobjectMenu')){
      //主数据业务对象内路由处理
      window.location.href = '/';
      return
    } else if (to.path === '/login') {
      const redirect = getUrlParam("redirect")
      if(redirect) {
        window.location.href = redirect && decodeURIComponent(redirect);
      } else {
        next({ path: '/' })
      }
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.needGetPermission) {
      // if ((store.getters.roles != null && store.getters.roles.length === 0) || store.getters.needGetPermission) {
        // 判断当前用户是否已拉取完user_info信息
        store
          .dispatch('GetUserInfo')
          .then(res => {
          //用to.query.appId区分是否应用菜单
          if(to.query && to.query.appId){
            routers = store.getters.appMenus[to.query.appId] || []
          }else{
            routers = localStore.get('menus') || []
          }
          try {
            if ((to.fullPath === '/dashboard' || to.fullPath === '/objectDashboard') && redirect) {
              // to = routers.length && routers[0].children && routers[0].children[0]
              const firstRoute  = routers.length && routers[0].children && routers[0].children[0]
              if(firstRoute.meta.resource){
                to = firstRoute
              } else {
                //支持登陆默认显示第一菜单的第三级叶子菜单
                to = firstRoute.children && firstRoute.children[0]
              }
              if(to.query){
                to.query = toQueryObject(to.query)
              }
            }
          } catch(e) {
            console.warn(e)
          }
          if(to.fullPath && to.fullPath.startsWith('/dashboard') && to.query){
            //应用菜单显示第一个
            to = routers.length && routers[0].children && routers[0].children[0]
            if(to.query){
              to.query = toQueryObject(to.query)
            }
          }
          // 拉取user_info
          store.dispatch('GenerateRoutes').then(() => {
            addRoutes(null, store.getters.addRouters) // 动态新建可访问路由表
            console.log('routers', router.getRoutes())
            store.dispatch('setNeedGetPermission', false)
              // //添加404动态路由
              // router.addRoute({
              //   path: "/:catchAll(.*)",
              //   redirect: "/404",
              // })
            // 根据roles权限生成可访问的路由表
            if (getOriginUrl()) {
              const originUrl = getOriginUrl();
              removeOriginUrl();
              window.location.href = originUrl;
              return
            }
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })

        })
        .catch((error) => {
          console.error(error)
          Vue.prototype.$BaseBus.$emit('request:401')

        })
      } else {
        next()
      }
    }
  } else {
    const {  origin, href } = window.location
    const search = '?' + href.split('?').reverse()[0]
    const mustArr = ['client_id', '?redirect_uri', 'token']
    /* has no token*/
    if (href.indexOf('Authorization') !== -1) {
      setAuthorization();
    } else if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else if (mustArr.every(i => search.indexOf(i) !== -1)) {
      window.location.href = origin + '/#/login' + search
    } else {
      setOriginUrl(window.location.href.replace('SSOLOGOUT=true&', ''))
      next(`/login`)
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach((to) => {
  let arr = []
  let id = ''
  let searchId = (data) => {
    data.forEach(i => {
      arr.push(i)
      if (i.children) {
        searchId(i.children)
      }
    })
  }
  searchId(store.getters.addRouters)
  if (arr.findIndex(i => i.name === to.name) > -1) {
    id = arr[arr.findIndex(i => i.name === to.name)].id
  }
  console.log(id)
  if (to.name != 'login') {
    ajaxUtil.ajax({
      url: 'api/afc/menu-record/click/menu',
      method: 'post',
      data: { menuId: id }
    })
  }
  
  NProgress.done() // finish progress bar
  if(to.path != '/login'){
    //设置水印
  dealWaterMark()
  }
})

