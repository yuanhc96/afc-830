/**
 * Created by binwang on 17/8/23.
 * 用于将 简化版 vuex 转换成 标准 vuex
 */
import extension from '@/actions/extension.js'
import ajaxUtil from '@/libs/ajaxUtil'
import _ from 'lodash'
// import { Message, MessageBox } from 'element-ui'

export default (scope, vuex) => {
  'use strict'

  // 扩展 action
  if (extension[scope]) {
    if (extension[scope].actions) {
      vuex.actions = { ...vuex.actions, ...extension[scope].actions }
    }
    if (extension[scope].state) {
      vuex.state = { ...vuex.state, ...extension[scope].state }
    }
    if (extension[scope].mutations) {
      vuex.mutations = { ...vuex.mutations, ...extension[scope].mutations }
    }
    if (extension[scope].getters) {
      vuex.getters = { ...vuex.getters, ...extension[scope].getters }
    }
  }

  const state = { ...vuex.state }
  const actions = {}
  const mutations = {}
  _.forEach(_.keys(vuex.actions), key => {
    state[key] = {
      type: key,
      loading: false,
      error: null,
      request: null,
      data: {},
      date: null,
    }
    mutations[`set_${scope}_${key}`] = (state, data) => {
      if (!state[key]) state[key] = data
      else state[key] = { ...state[key], ...data }
    }

    const action = vuex.actions[key]
    actions[`${scope}_${key}`] = async({ commit, state }, payload) => {
      if (payload && payload.skipHttp) {
        commit(`set_${scope}_${key}`, { loading: payload.loading })
        return
      }

      // 必填参数校验机制，确定swagger无误后开放
      // if (_.isArray(action.parameters)) {
      //   action.parameters.forEach(param => {
      //     if (param.required && !payload[param.name]) {
      //       console.log(`%c param [${param.name}] is required!`, 'color:red')
      //       throw new Error('Missing required arameters!')
      //     }
      //   })
      // }
      if (!action.url) {
        commit(`set_${scope}_${key}`, { data: payload })
      } else {
        commit(`set_${scope}_${key}`, { loading: true })
        let resp = null
        try {
          resp = await ajaxUtil.myRequest(action, payload, action.apiPrefix ? action.apiPrefix : false)
        } catch (e) {
          resp = e
        }

        let handleResult = null

        if (!resp) {
          handleResult = {
            loading: false,
            error: null,
          }
        } else if (resp.status >= 500) {
          handleResult = {
            loading: false,
            error: resp.errorMessage || resp.status,
            message: resp.errorLocalizedMessage || resp.status + '请联系管理员',
            data: resp.data,
            code: resp.errorCode,
            httpStatus: resp.status,
          }
        } else if (resp.status >= 200 && resp.status < 300) {
          if (action.format) {
            handleResult = {
              loading: false,
              error: null,
              request: payload,
              data: action.format(resp.data)
            }
          } else {
            handleResult = {
              ...ajaxUtil.apiHandler(resp),
              request: payload
            }
          }
          if (handleResult) {
            handleResult.date = resp.headers.date
          }
        }

        if (payload && payload.__cache__) {
          commit(`set_${scope}_${key}`, handleResult)
        } else {
          commit(`set_${scope}_${key}`, {
            loading: false,
            error: handleResult.error,
            request: handleResult.request,
            date: handleResult.date,
            httpStatus: handleResult.httpStatus,
          })
        }
        return handleResult
      }
    }
  })
  return {
    state,
    actions,
    getters: { ...vuex.getters },
    mutations: { ...mutations, ...vuex.mutations },
  }
}

