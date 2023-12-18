// import { asyncRouterMap } from '@/router'
import ajaxUtil from '@/libs/ajaxUtil'
import constantRouterMap from '@/router/static'
import { getQueryVariable } from '@/utils/tools'
import HighcodeEntryRouter from '@/views/app/highcodeEntryRouter.vue'
import LowcodeEntryRouter from '@/views/app/lowcodeEntryRouter.vue'
import WujieRouter from '@/views/app/wujieRouter.vue'
import Layout from '@/views/layout/Layout'
import SecondaryLayout from '@/views/layout/SecondaryLayout'
import store, { localStore } from '@util/sessionStore'
import { isJSON } from '@util/tools.js'

import Vue from 'vue'
const _import = require('../../router/_import_' + process.env.NODE_ENV)
/**
 * @param roles
 * @param route
 */

const setMeta = async(c, microMark, mark) => {
  let appid = null
  const content = JSON.parse(c.meta.resource.content)
  if (c.meta.resource.appId == null) {
    const Object = await findAppByObject({
      id: c.meta.resource.businessObjId,
    })
    if (Object) {
      appid = Object.data.appId
    }
  } else {
    // 平台菜单
    appid = c.meta.resource.appId
  }

  const app = await findApp({ id: appid })
  // 业务对象菜单
  let appMicroUrl = ''
  let appMicroMark = ''
  let appRouter = content ? content.router : null
  if (isJSON(app.data.microUrl)) {
    // 多对微前端模块地址，找到与 资源微前端模块 相同的微前端信息
    const microUrlList = JSON.parse(app.data.microUrl)
    const microInfo = microUrlList.filter(
      (item) => item.microMark === microMark
    )
    if (microInfo.length) {
      appMicroUrl = microInfo[0].microUrl
    
    } else {
      appMicroUrl = '/'
      console.warn(
        '[vue-router] ' + '找不到对应' + microMark + '应用微前端模块'
      )
    }
    appMicroMark = microMark
  } else {
    // 兼容之前单应用
    appMicroUrl = app.data.microUrl
    appMicroMark = app.data.microMark
  }
  if (appMicroUrl.indexOf('${') !== -1) {
    // 解析系统变量
    appMicroUrl = await replaceWithSystemVariables({
      url: appMicroUrl,
    })
  }
  if (
    appMicroUrl.startsWith('http://') ||
              appMicroUrl.startsWith('https://')
  ) {
    if (!appMicroUrl.endsWith('/')) {
      // 给微前端地址统一末尾添加 ‘/’
      appMicroUrl = appMicroUrl + '/'
    }
  } else {
    // 不含http,微前端地址为 当前地址环境+appMicroUrl
    const currentIPPort =
                window.location.protocol + '//' + window.location.host
    const locationUrl = currentIPPort + appMicroUrl
    appMicroUrl = locationUrl
  }
  c.meta.remote = {
    remotePath: appMicroUrl,
    url: appRouter ? appRouter : `/app/${app.data.code}/module/${appMicroMark}/page/${mark}`,
  }
}
function hasPermission(menus, route) {
  if (!Vue.config.permissionSwitch) return true
  // 在人员无任何权限的情况下，没有设置权限码的菜单应该予以显示，数据权限由后端控制
  // if (!menus || menus.length === 0) return false
  if (route.funccode) {
    return (
      menus.some((menu) => menu === route.funccode) ||
      !!(
        route.forceRole &&
        $localStore.getters.roles.some((role) => role === route.forceRole)
      )
    )
  } else {
    return true
  }
}
const buildComponent = async(c) => {
  if (c.meta.resource && c.meta.resource.content) {
    const content = JSON.parse(c.meta.resource.content)
    const { openType, afcenterPath, mark, microMark, url, resourceCode, resourceType, formStatus, viewType, appCode } = content
    // "{"openType":"afcenter","mark":null,"url":null,"params":null,"afcenterPath":"afcenter/tenant/index.vue"}"

    if (openType === 'otherMicroApp') {
      // 异构微前端
      c.component = () => {
        return new Promise((resolve, reject) => {
          setMeta(c, microMark, mark)
          resolve(WujieRouter)
        })
      }
    } else if (resourceCode) { // 低开资源
      // c.component = WujieRouter
      c.component = LowcodeEntryRouter
      c.props = {
        resourceType: viewType || resourceType,
        resourceCode,
        status: formStatus,
        appCode: appCode
      }
    } else if (openType === 'afcenter') {
      if (afcenterPath !== '*') {
        try {
          // if(afcenterPath.indexOf('afcenter') === 0){
          c.component = _import(
            `${afcenterPath.replace('.vue', '') || 'BlankComponent'}`
          )
          // }else{
          //   c.component = _import('BlankComponent')
          // }
        } catch (e) {
          // console.error(e)
          c.component = _import('BlankComponent')
        }
      }
    } else if (openType === 'iframe') {
      const iframeContent = { ...content }
      if (iframeContent.url.indexOf('${') != -1) {
        // 解析系统变量
        replaceWithSystemVariables({
          url: iframeContent.url,
        }).then((res) => {
          iframeContent.url = res.data
          c.meta.resource.content = JSON.stringify(iframeContent)
        })
      }
      c.component = _import('iframe/index')
    } else if (openType === 'microApp') {
      c.component = () => {
        return new Promise((resolve, reject) => {
          setMeta(c, microMark, mark)
          resolve(HighcodeEntryRouter)
        })
      }
    } else if (openType === 'lowReport') {
      // 低开报表
      const BiResContent = { ...content }
      if (['cockpit', 'freelayout'].includes(BiResContent.biType)) {
        c.meta.resource.content = JSON.stringify(BiResContent)
        c.component = _import('iframe/index')
      }
    }
  }
  if (c.children && c.children.length > 0) {
    // 如果有子目录
    c.component = SecondaryLayout
  }
  // if (c.meta.urlJson) {
  //   const urlJSON = JSON.parse(c.meta.urlJson)
  //   if(urlJSON.isOut){
  //     if(urlJSON.openMode === 'iframe'){
  //       c.component =  _import('iframe/index')
  //     } else if(urlJSON.openMode === 'micro'){
  //       c.component = async () => {
  //         // 加载store
  //         let components = await loadRemoteComponent({
  //           url: urlJSON.microConfig.url,
  //           scope: urlJSON.microConfig.scope,
  //           module: [`./${urlJSON.microConfig.module}`,`./store`],
  //         })
  //         return components[0]
  //       }
  //     }
  //     return
  //   }
  // }
  // if(c.children &&c.children.length > 0){ //如果有子目录
  //    c.component = SecondaryLayout
  // }else{
  // try {
  //   if(c.meta.origin){
  //     c.component = _import(`${c.meta.origin.replace('.vue','') || 'BlankComponent'}`)
  //   } else{
  //     c.component = _import(`coframe/BlankComponent`)
  //   }
  //   }catch(e){
  //     c.component = _import(`coframe/BlankComponent`)
  //   }
  // }
}
const buildRoutes = (menus = [], deep = 1) => {
  // console.log('menus',menus)
  menus.forEach(async(menu) => {
    if (deep === 1) {
      // console.log('1级目录')
      menu.component = Layout // 一级目录组件
      await buildRoutes(menu.children, deep + 1)
    } else {
      // console.log(deep+ '级目录')
      await buildComponent(menu)
      if (menu.children) {
        await buildRoutes(menu.children, deep++)
      }
    }
  })
  // if(deep === 1){
  //   menus.push({ path: '*', redirect: '/404', hidden: true })
  // }
}
const bindOutSystemRouter = (menus) => {
  Array.isArray(menus) &&
    menus.forEach((menu) => {
      menu.component = Layout
      menu.children &&
        menu.children.forEach((c) => {
          c.component = _import('iframe/index')
        })
    })
}

const setOrigin = (routers) => {
  return routers.menus.map((menu) => {
    menu.children.map((child) => {
      child.meta.origin = routers.origin
      child.meta.key = routers.key
      return child
    })
    menu.meta.origin = routers.origin
    menu.meta.key = routers.key
    return menu
  })
}
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routers
 * @param roles
 */
function filterAsyncRouter(routers, menus) {
  const accessedRouters = routers.filter((route) => {
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, menus)
      return route.children && route.children.length
    } else {
      return hasPermission(menus, route)
    }
  })
  return accessedRouters
}
function findApp(payload) {
  return ajaxUtil.ajax({
    url: `/api/afc/apps/${payload.id}`,
    method: 'get',
    data: payload,
  })
}
function replaceWithSystemVariables(payload) {
  return ajaxUtil.ajax({
    url: `/api/afc/system-variables/resolveSysVariable`,
    method: 'post',
    data: payload,
  })
}

function findAppByObject(payload) {
  return ajaxUtil.ajax({
    url: `/api/afc/business-objects/${payload.id}`,
    method: 'get',
    data: payload,
  })
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    menus: localStore.get('menus'),
    appsInfo: localStore.get('APPSINFO') ? JSON.parse(localStore.get('APPSINFO')) : {},
    appInfo: {},
    lastAppRoute: {},
    appMenus: {},
    otherMenu: localStore.get('otherMenu') || [],
    functions: localStore.get('functions'),
    platform: localStore.get('platform'),
    needGetPermission: true,
    businessObjInst: {},
  },
  getters: {
    permissions(state) {
      return { functions: state.functions, menus: state.menus }
    },
  },
  mutations: {
    SET_NEEDGETPERMISSION: (state, data) => {
      state.needGetPermission = data
    },
    SET_ROLE: (state, role) => {
      state.role = role
    },
    SET_BUSINESSOBJINST: (state, businessObjInst) => {
      state.businessObjInst = businessObjInst
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
      localStore.set('menus', menus)
    },
    SET_APPINFO: (state, appInfo) => {
      state.appInfo = appInfo
    },
    SET_LAST_APP_ROUTE: (state, appRoute) => {
      state.lastAppRoute = appRoute
    },
    SET_APPSINFO: (state, { key, value }) => {
      debugger
      if (value === null && state.appsInfo[key]) { return }
      state.appsInfo[key] = value
      state.appsInfo = _.cloneDeep(state.appsInfo)
      localStore.set('APPSINFO', JSON.stringify(state.appsInfo))
    },
    SET_PLATFORM: (state, platform) => {
      state.platform = platform
      localStore.set('platform', platform)
      store.set('platform', platform)
    },
    SET_FUNCTIONS: (state, functions) => {
      state.functions = functions
      localStore.set('functions', functions)
    },
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    ADD_MENUS: (state, routers) => {
      state.otherMenu = setOrigin(routers)
      localStore.set('otherMenu', state.otherMenu)
    },
    ADD_APPMENUS: (state, { key, value }) => {
      if (value === null && state.appMenus[key]) { return }
      state.appMenus[key] = value
      state.appMenus = _.cloneDeep(state.appMenus)
    },
  },
  actions: {
    setNeedGetPermission({ commit, state }, data) {
      commit('SET_NEEDGETPERMISSION', data)
    },
    setBusinessObjInst({ commit, state }, data) {
      commit('SET_BUSINESSOBJINST', data)
    },
    addAppMenus({ commit }, menus) {
      commit('ADD_APPMENUS', menus)
    },
    addAppsInfo({ commit }, apps) {
      commit('SET_APPSINFO', apps)
    },
    async GenerateRoutes({ commit, state }, data) {
      const appId = getQueryVariable('appId')
      const menus = appId ? state.appMenus[appId] : state.menus
      await buildRoutes(menus, 1)
      return new Promise((resolve) => {
        bindOutSystemRouter(state.otherMenu)
        const accessedRouters = menus.concat(state.otherMenu)
        console.log('SET_ROUTERS', accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
  },
}

export default permission
