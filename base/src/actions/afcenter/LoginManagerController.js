// This file is automatically generated

// 登录管理

import { LoginManagerController } from '@controller'
export default {
  actions: {
    [LoginManagerController.authenticateThirdPartyUsers.method]: {
      summary: '通过第三方授权码登录',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/login/third-party/auth`,
    },
    [LoginManagerController.getCaptchaBase64.method]: {
      summary: '获取验证码',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/validation-code`,
    },
    [LoginManagerController.getMobileRedirectThirdAuthUrl.method]: {
      summary: '获取第三方认证服务地址',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/login/third-party/mobile/authorize`,
    },
    [LoginManagerController.getPasswordKey.method]: {
      summary: '获取加密公钥',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/login/password/key`,
    },
    [LoginManagerController.getRedirectThirdAuthUrl.method]: {
      summary: '获取第三方认证服务地址',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/login/third-party/authorize`,
    },
    [LoginManagerController.getRedirectThirdQrUrl.method]: {
      summary: '获取第三方扫码登录服务地址',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/login/third-party/qrConnect`,
    },
    [LoginManagerController.login.method]: {
      summary: '登录',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/login`,
    },
    [LoginManagerController.loginWithAppSercet.method]: {
      summary: '通过clientId和secret进行认证',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/login/clientId`,
    },
    [LoginManagerController.logout.method]: {
      summary: '注销',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/logout`,
    },
    [LoginManagerController.refreshUserObject.method]: {
      summary: '刷新UserObject',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/login/user-object`,
    },
    [LoginManagerController.request.method]: {
      summary: '认证中心统一处理接口',
      method: 'get',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/oauth2/*`,
    },
    [LoginManagerController.request.method]: {
      summary: '认证中心统一处理接口',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/oauth2/*`,
    },
    [LoginManagerController.request.method]: {
      summary: '认证中心统一处理接口',
      method: 'put',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/oauth2/*`,
    },
    [LoginManagerController.request.method]: {
      summary: '认证中心统一处理接口',
      method: 'delete',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/oauth2/*`,
    },
    [LoginManagerController.requestHEAD.method]: {
      summary: '认证中心统一处理接口',
      method: 'head',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/oauth2/*`,
    },
    [LoginManagerController.requestOPTIONS.method]: {
      summary: '认证中心统一处理接口',
      method: 'options',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/oauth2/*`,
    },
    [LoginManagerController.requestPATCH.method]: {
      summary: '认证中心统一处理接口',
      method: 'patch',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/oauth2/*`,
    },
    [LoginManagerController.webAuthenticateThirdPartyUsers.method]: {
      summary: '网页内第三方授权码登录',
      method: 'post',
      apiPrefix: '/afc',
      url: (payload) => `/api/afc/login/web/third-party/auth`,
    },
  },
}
