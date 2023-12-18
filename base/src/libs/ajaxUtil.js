import * as auth from '@/utils/auth.js'
import { localStore } from '@/utils/sessionStore'
import axios from 'axios'
import _ from 'lodash'
import Vue from 'vue'
const devMode = process.env.NODE_ENV === 'development'
const ajaxUtil = {}
ajaxUtil.title = function(title) {

}
ajaxUtil.config = {
  // baseURL: '/',
  responseType: 'json',
}
if (process.env.NODE_ENV === `development`) {
  ajaxUtil.config.timeout = 30000
}
const token_interceptors = (response) => {
  if (response.headers.Authorization) {
    auth.setToken(response.headers.Authorization)
  } else if (response.headers.authorization) {
    auth.setToken(response.headers.authorization)
  }
  return response
}
ajaxUtil.headers = (headers, __) => {
  const ajax = axios.create({
    ...ajaxUtil.config,
    headers: headers,
  })
  ajax.interceptors.response.use(token_interceptors,
    error => {
      console.log('error.response', error.response)
      if (error.response.status === 401) {
        Vue.prototype.$BaseBus.$emit('request:401')
      }
      return Promise.reject(error.response) // 返回接口返回的错误信息
    })
  // ajax.interceptors.response.use(function (response) {
  //   debugger
  //     const status = response.status
  //     if (status === 401) {
  //       Vue.prototype.$BaseBus.$emit('request:401')
  //       return response
  //     }
  //   })
  return {
    ajax
  }
}
// ajaxUtil.ajax.interceptors.response.use(token_interceptors,
//   // 接口错误状态处理，也就是说无响应时的处理
//   error => {
//     return Promise.reject(error.response.status) // 返回接口返回的错误信息
//   })

ajaxUtil.stitchingParams = (url, payload, all) => {
  if (!all) {
    if (payload && payload.params) {
      return ajaxUtil.stitchingParams(url, payload.params, true)
    } else {
      return url + '?_timestamp=' + Math.random(10)
    }
  }
  const params = _.keys(payload)
    .map(k => {
      if (_.isNull(payload[k]) || _.isUndefined(payload[k]) || _.isEqual(payload[k], '')) {
        return null
      } else {
        if (ajaxUtil.isMock(url)) {
          return k + '=' + payload[k]
        } else {
          if (_.isArray(payload[k])) {
            return _.reduce(
              payload[k],
              (k1, k2) => {
                return `${k1}&${k}=${encodeURIComponent(k2)}`
              },
              '',
            )
          } else if (k === 'offset') {
            return Vue.config.pagination.offsetAlias + '=' + (payload[k] - 1)
          } else if (k === 'limit') {
            return Vue.config.pagination.limitAlias + '=' + payload[k]
          } else if (k === 'sortField') {
            if (payload['sortOrder'] === 'normal') return null
            else return `sort_by=${payload['sortField']}:${payload['sortOrder']}`
          } else if (k === 'sortOrder') {
            return null
          } else return k + '=' + encodeURIComponent(payload[k])
        }
      }
    })
    .filter(m => m !== null)
    .join('&')
  const s = url + (params === '' ? '?' : '?' + params + '&') + '_timestamp=' + Math.random(10)
  if (process.env.NODE_ENV === `development`) {
    console.log(s)
  }
  return s
}

ajaxUtil.mockHandler = res => {
  return {
    source: 'mock',
    loading: false,
    error: res.errorMsg,
    data: res.data.content || 'data format error!',
  }
}

ajaxUtil.buildHeaders = (headers = {
  Locale: Vue.config.lang,
  Channel: 'website',
  overflow: false,
  'Content-Type': 'application/json'
}) => {
  const user = localStorage.getItem('user')
  if (user) {
    try {
      headers.tenantId = JSON.parse(user).attributes.TENANT_ID
    } catch (e) {
      // user解析失败
    }
  }
  if (Vue.config.headers) {
    Object.assign(headers, Vue.config.headers)
  }
  if ((auth.isNormal() || auth.isMicro() || auth.isSSO()) && localStore.get('uniqueId')) {
    headers.Authorization = localStore.get('uniqueId')
  } else if (auth.isIAM() && auth.getToken()) {
    headers['X-IAM-UN'] = auth.getToken()
  }
  return headers
}

ajaxUtil.ajax = (config) => {
  let finalConfig = null
  const globalConfig = localStore.get('globalConfig') // 读取全局配置
  const apiPrefix = Vue.config.apiPrefix || globalConfig.apiPrefix || {}
  const enabled = apiPrefix.enabled
  const priority = apiPrefix.priority
  const path = apiPrefix.path
  if (apiPrefix && enabled) {
    if (priority === 'highest') { // 全局配置最高优先级
      finalConfig = {
        ...config,
        baseURL: path,
      }
    } else { // 全局配置最低优先级
      finalConfig = {
        baseURL: path,
        ...config,
      }
    }
  } else {
    finalConfig = config
  }
  if (Vue.config.isRelativePath) {
    finalConfig.baseURL = '.' + finalConfig.baseURL
  }

  // console.log('finalConfig===========', finalConfig)
  return new Promise((resolve, reject) => {
    const headers = ajaxUtil.buildHeaders()
    ajaxUtil
      .headers(headers)
      .ajax(finalConfig)
      .then(response => {
        resolve(response)
      })
      .catch(res => {
        reject(res)
      })
    finalConfig = null
  })
}
ajaxUtil.myRequest = (action, payload, apiPrefixStrategy = undefined) => {
  let url = action.url(payload) || '/'
  if (action.method === 'get') {
    url = ajaxUtil.stitchingParams(url, payload, true)
  } else {
    url = ajaxUtil.stitchingParams(url, payload, false)
  }

  let finalApiPrefix = null
  // 全局配置最高优先级
  const globalConfig = localStore.get('globalConfig') // 读取全局配置
  if (globalConfig && globalConfig.apiPrefix && globalConfig.apiPrefix.enabled && globalConfig.apiPrefix.priority === 'highest') {
    finalApiPrefix = globalConfig.apiPrefix.path || '/'
  } else if (Vue.config.apiPrefix && Vue.config.apiPrefix.enabled && Vue.config.apiPrefix.priority === 'highest') {
    finalApiPrefix = Vue.config.apiPrefix.path
  } else if (typeof apiPrefixStrategy === 'string') {
    finalApiPrefix = apiPrefixStrategy
  } else if (apiPrefixStrategy === false || apiPrefixStrategy === undefined) { // api定义中的前缀优先级第二
    finalApiPrefix = null
  } else if (apiPrefixStrategy === true) {
    finalApiPrefix = payload.__apiPrefix
  } else if (Vue.config.apiPrefix && Vue.config.apiPrefix.enabled && Vue.config.apiPrefix.priority !== 'highest') { // 全局配置文件的优先级最低
    finalApiPrefix = Vue.config.apiPrefix.path
  }

  if (finalApiPrefix && !finalApiPrefix.startsWith('/')) {
    finalApiPrefix = '/' + finalApiPrefix
  }

  console.log('finalApiPrefix========', finalApiPrefix)
  return new Promise((resolve, reject) => {
    const headers = ajaxUtil.buildHeaders()
    ajaxUtil
      .headers(headers, finalApiPrefix)
      .ajax({
        baseURL: Vue.config.isRelativePath ? '.' + finalApiPrefix : finalApiPrefix,
        url: url,
        method: action.method || 'get',
        data: ajaxUtil.payloadWrapper(action, url, payload),
      })
      .then(response => {
        resolve(response)
      })
      .catch(res => {
        reject({
          ...res.data,
          status: res.status
        })
      })
    finalApiPrefix = null
  })
}

ajaxUtil.apiHandler = ({ data }) => {
  let error = null
  const keys = _.keys(data)
  if (_.includes(keys, 'offset') && _.includes(keys, 'limit')) {
    _.forEach(keys, key => {
      if (key === 'offset') {
        data[key] = data[key] + 1
      } else if (key === 'limit' || key === 'more' || key === 'total') {
        // data[key] = data[key]
      } else if (key === 'errorCode') {
        error = data[key]
      } else if (key === 'error') {
        error = data.error.code
      } else {
        data.list = data[key]
        delete data[key]
      }
    })
  }
  return {
    source: 'api',
    loading: false,
    error: error,
    data: data,
  }
}

ajaxUtil.isMock = url => {
  return /^\/mock/.test(url)
}

ajaxUtil.payloadWrapper = (action, url, payload) => {
  if (payload) {
    if (payload.payload) {
      return payload.payload
    } else return payload
  }
}

export default ajaxUtil
