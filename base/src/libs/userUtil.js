import store, { localStore } from '@util/sessionStore'
import vuexStore from '../store'
import { get } from 'lodash'
export function platform() {
  return store.get('platform')
}
export function currentSystem() {
  return store.get('system')
}
export function currentTenant() {
  return userInfo() && userInfo().attributes && userInfo().attributes['TENANT_ID']
}
export function currentSystemId() {
  return get(store.get('system'), 'id', null)
}
export function userInfo() {
  return vuexStore.getters.userInfo || localStore.get('user') || {}
}
export function roles() {
  return vuexStore.getters.roles || []
}
export function isAdmin() {
  return roles().some(role => role === 'sysadmin')
}