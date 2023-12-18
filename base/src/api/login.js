import ajaxUtil from '@/libs/ajaxUtil'
import store, { localStore } from '@/utils/sessionStore'
export function iamLogout() {
  return ajaxUtil.ajax({
    url: 'api/afc/client/sso-logout',
    method: 'post',
  })
}

export function logout(uniqueId) {
  return ajaxUtil.ajax({
    url: '/api/afc/logout',
    method: 'post',
    data: { Authorization: localStore.get('uniqueId') }
  })
}
export function login(user) {
  return ajaxUtil.ajax({
    url: '/api/afc/login',
    method: 'post',
    data: user,
  })
}
export function getKey() {
  return ajaxUtil.ajax({
    url: '/api/afc/login/password/key',
    method: 'get',
    data: {},
  })
}
export function getVerifiedCode() {
  return ajaxUtil.ajax({
    url: '/api/afc/validation-code',
    method: 'post',
    data: {},
  })
}
// 扫码登录的三方地址
export function getThirdParty() {
  return ajaxUtil.ajax({
    url: '/api/afc/login/third-party/qrConnect',
    method: 'get',
    data: {},
  })
}
// 认证登录
export function oauthLogin(data) {
  return ajaxUtil.ajax({
    url: '/api/afc/oauth2/login',
    method: 'post',
    data: data,
  })
}
// 授权码登录
export function loginByScanning(data) {
  return ajaxUtil.ajax({
    url: '/api/afc/login/third-party/auth',
    method: 'post',
    data: data,
  })
}

// 密码策略
export function isMustChangePsword() {
  return ajaxUtil.ajax({
    url: '/api/afc/users/password/safety',
    method: 'get',
    data: {},
  })
}
// 刷新UserObject
export function refreshUserObject(data) {
  return ajaxUtil.ajax({
    url: '/api/afc/login/user-object',
    method: 'post',
    data: data,
  })
}
// 获取业务对象实例功能码
function queryFunctionCodesByBusinessObj(payload) {
  return ajaxUtil.ajax({
    url: `/api/afc/menus/${payload.businessObjId}/${payload.businessObjInstId}/function`,
    method: 'get',
    data: payload,
  })
}
function getOwnerId() {
  if (store.get('platform') === 'system') {
    return store.get('system').id
  } else {
    return 'platform'
  }
}

const getFunctionsUrl = () => {
  return `/api/afc/resources/current/function`
}
const getUserUrl = () => `api/afc/users/get/current-user`
const getRolesUrl = 'api/afc/uc/permissions/employees/authorised'

function getUser(token) {
  return ajaxUtil
    .ajax({
      url: getUserUrl(),
      method: 'post',
    })
}
function getFunctions() {
  return ajaxUtil
    .ajax({
      url: getFunctionsUrl(),
      method: 'get',
      data: {}
    })
}

function getMenus() {
  return ajaxUtil
    .ajax({
      url: '/api/afc/menus/current/menus',
      method: 'get',
      data: {}
    })
}

function getObjectMenus(payload) {
  return ajaxUtil
    .ajax({
      url: `/api/afc/menus/${payload.businessObjId}/${payload.businessObjInstId}/menus`,
      method: 'get',
      data: payload
    })
}
// 获取应用菜单
function getAppMenus(payload) {
  return ajaxUtil
    .ajax({
      url: `/api/afc/menus/current/app-menus/${payload.appId}`,
      method: 'get',
      data: payload
    })
}
// 获取应用功能码
function queryFunctionCodesByAppId(payload) {
  return ajaxUtil.ajax({
    url: `/api/afc/menus/current/app-menus/${payload.appId}`,
    method: 'get',
    data: payload,
  })
}
export function getPermissions() {
  return Promise.all([getMenus(), getFunctions()])
}
export function getObjectPermissions(payload, data) {
  return Promise.all([getObjectMenus(payload), queryFunctionCodesByBusinessObj(data), getFunctions()])
}
export function getAppPermissions(payload) {
  return Promise.all([getAppMenus(payload), queryFunctionCodesByAppId(payload), getFunctions()])
}
