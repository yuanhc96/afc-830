import { localStore } from '@/utils/sessionStore'
const get = function(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('get', url, true)
    xhr.onload = function() {
      if (xhr.status == 200) {
        resolve(JSON.parse(xhr.responseText))
      } else {
        reject(null)
      }
    }
    xhr.onerror = function() {
      reject(null)
    }
    xhr.send(null)
  })
}

export default async(vue) => {
  const resp = await get('./config/app-config.json')
  if (resp) {
    vue.config.login_type = resp.loginType || 'normal' // normal ,iam, pass， sso 单点登录
    vue.config.server_url = resp.serverUrl || '' // 后台服务地址, 当login_type 为 iam时, 用于接受 iframe 跨域信息,
    vue.config.ssoLoginUrl = resp.ssoLoginUrl || '' // 后台服务地址, 当login_type 为 sso时, 用于SSO登录登出地址,
    vue.config.ssoLogoutUrl = resp.ssoLogoutUrl || '' // 后台服务地址, 当login_type 为 sso时, 用于SSO登录登出地址,
    vue.config.loginPage = resp.loginPage
    vue.config.ableScan = resp.ableScan
    vue.config.title = resp.title || ''
    vue.config.logoutTo = resp.logoutTo || '/'
    vue.config.shortTitle = resp.shortTitle || ''
    vue.config.platformRoleTmpId = resp.platformRoleTmpId || ''
    vue.config.headers = resp.headers || null
    vue.config.apiPrefix = resp.apiPrefix // 动态添加请求前缀 appName 的开关
    vue.config.componentExt = resp.componentExt // 添加扩展组件配置
    vue.config.isExpress = resp.isExpress // 添加是否单机应用标识
    vue.config.homePage = resp.homePage // 登录完成后跳转目标页
    vue.config.loginBgSwitch = resp.loginBgSwitch // 自动切换登录页背景图
    vue.config.recordLabel = resp.recordLabel // 自动切换登录页背景图
    vue.config.loginLogoVisible = resp.loginLogoVisible // 登陆页普元logo是否显示
    vue.config.isRelativePath = resp.isRelativePath // 添加是否相对路径配置
    vue.config.isBpsStandalone = resp.isBpsStandalone // 是否三方应用
    vue.config.actionsPosition = resp.actionsPosition // 流程审批页面按钮位置 top-顶部 bottom-底部
    vue.config.helpDocUrl = resp.helpDocUrl // 帮助文档地址
    vue.config.componentLibraryUrl = resp.componentLibraryUrl // 组件库地址
    vue.config.amap = resp.amap // 高德地图组件配置
    vue.config.buildInfos = resp.buildInfos // build 版本号
    vue.config.homePageLogoUrl = resp.homePageLogoUrl // home页左上角logo地址
    vue.config.isAI = resp.isAI // 是否展示AI
    localStore.set('globalConfig', resp) // 全局配置
    localStore.set('loadComponentExt', resp.componentExt)
  }
}
