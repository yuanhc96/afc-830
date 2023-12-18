import Cookies from 'js-cookie'
import localStore from 'store'
const TokenKey = `Admin-Token-coframe`

export function getUser() {
  if (localStore.get('user')) return localStore.get('user')
  else return {}
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, params) {
  return Cookies.set(TokenKey, token, params)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeLoginType() {
  return localStore.set('loginType', null)
}
export function setLoginType(loginType) {
  return localStore.set('loginType', loginType)
}
export function isIAM() {
  return localStore.get('loginType') === 'iam'
}
export function isNormal() {
  return localStore.get('loginType') === 'normal'
}
export function isMicro() {
  return localStore.get('loginType') === 'micro'
}
export function isSSO() {
  return localStore.get('loginType') === 'sso'
}
// 记录登陆后想要跳转的地址，不在跳转到首页
export function setOriginUrl(loginUrl) {
  return localStore.set('originUrl', loginUrl)
}
export function getOriginUrl() {
  return localStore.get('originUrl')
}
export function removeOriginUrl() {
  return localStore.set('originUrl', null)
}