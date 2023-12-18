/**
 * Created by binwang on 17/8/24.
 */
import { removeToken } from '@/utils/auth'
import sessionStore from '@/utils/sessionStore'
import _ from 'lodash'
import Vue from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import * as Actions from '../actions'

const loginErrorCode = ['ACCESS_CHECK_FAILED', 'AUTH_TOKEN_AUTHORIZATION_FAILED', 'AUTH_TOKEN_EXPIRED', 'TOKEN_INVALID']

function Util(_context, defaultEntity) {
  if (!arguments) throw new Error('缺少Vue上下文 this ')
  const $this = _context
  let entity = defaultEntity

  this.select = _entity => {
    entity = _entity
    return this
  }

  const pretreatment = (action, payload, handler, call) => {
    if (handler && _.isFunction(handler)) {
      payload = handler.call(this, payload)
    }
    let controller = ''
    let method = ''
    if (_.isString(action)) {
      controller = action.split('.')[0]
      method = action.split('.')[1]
    } else {
      controller = action.controller
      method = action.method
    }
    return call(controller, method, payload)
  }

  const tokenMiss = action => {
    return false
  }

  // 操作 Action end
  // 通过 Vuex 访问后台, 数据将进入 store
  this.dispatchAsync = async(action, payload, handler) => {
    if (handler && _.isFunction(handler)) {
      payload = handler.call(this, payload)
    }
    let controller = ''
    let method = ''
    if (_.isString(action)) {
      controller = action.split('.')[0]
      method = action.split('.')[1]
    } else {
      controller = action.controller
      method = action.method
    }
    this.cbData = await $this.$store.dispatch(`${controller}_${method}`, payload)
    this.error()
    return this.cbData
  }

  this.removeKey = action => {
    if (_.isString(action)) {
      $this.$store.commit(`set_${action.controller}_${action.method}`, {
        data: {},
        request: {},
      })
    } else if (_.isArray(action)) {
      _.map(action, this.removeKey)
    }
    return this
  }
  this.action = (action, payload, handler) => {
    if (handler && _.isFunction(handler)) {
      payload = handler.call(this, payload)
    }

    if (_.isFunction($this[`${entity}_${action}`])) $this[`${entity}_${action}`].call(this, payload)
    else {
      console.log(`%c not find action [${entity}_${action}]! please verify action name!`, 'color:red')
    }
    return this
  }
  this.clear = data => {
    if (_.isString(data)) {
      $this.$store.commit(`set_${entity}_${data}`, {
        data: {},
        request: {},
      })
    } else if (_.isArray(data)) {
      _.map(data, this.clear)
    }
    return this
  }
  // 操作 Action end

  // 引入 环境变量[Action State] start
  this.actions = (acts) => {
    const actions = []
    const entitys = coverEntity(entity)
    _.forEach(entitys, e => {
      _.mapKeys((acts || Actions.default)[e].actions, (value, key) => {
        actions.push(key)
      })
    })
    return mapActions(actions)
  }

  this.state = () => {
    const entitys = coverEntity(entity)
    const state = {}
    _.forEach(entitys, key => {
      _.assign(state, {
        [key]: state => {
          return _.get(state, key, null)
        },
      })
    })
    return mapState(state)
  }

  this.getters = () => {
    const getters = []
    const entitys = coverEntity(entity)
    _.forEach(entitys, e => {
      _.mapKeys(Actions.default[e].getters, (value, key) => {
        getters.push(key)
      })
    })
    return mapGetters(getters)
  }

  // 引入 环境变量[Action State] end

  function coverEntity(_entity) {
    if (_.isString(_entity)) {
      return [_entity]
    } else if (_.isArray(_entity)) {
      _entity = _entity.filter(e => !_.isUndefined(e))
      return _entity.map(e => {
        if (_.isObject(e)) {
          return e['__name']
        } else return e
      })
    } else if (_.isObject(_entity)) {
      return [_entity['__name']]
    } else {
      throw new Error('select 传递了错误的参数 ,必须是 字符串或者字符串数组!')
    }
  }

  this.guid = () => {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }

    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()
  }

  const cbData = null
  this.cb = data => {
    this.cbData = data
    return this
  }
  this.success = success => {
    if (!this.cbData.loading && !this.cbData.error) {
      if (success && _.isFunction(success)) {
        success.call()
      } else {
        $this.$msg.success(`${this.cbData.type} success!`)
        $this.loading = this.cbData.loading
      }
    }

    return this
  }
  this.beforeLogout = (msg) => {
    removeToken()
    $this
      .$confirm(`${msg || '登录信息已过期!'}`, '提示', {
        confirmButtonText: '重新登录',
        type: 'warning',
        center: true,
        showClose: false,
        showCancelButton: false,
        closeOnClickModal: false,
      })
      .then(() => {
        this.logout()
      })
      .catch(() => {})
  }
  this.logout = () => {
    sessionStore.set('lastRoute', {
      name: $this.$route.name,
      query: $this.$route.query,
      params: $this.$route.params,
    })
    $this.$store.dispatch('FedLogOut')
    if (Vue.config.login_type === 'sso') {
      // 如果是单点登录
      const { origin } = window.location
      const url = `${Vue.config.ssoLoginUrl}?SSOLOGOUT=true&service=${encodeURIComponent(`${origin}/#/login`)}&appId=${encodeURIComponent(`${origin}/`)}`
      window.location.href = url
    } else {
        window.location.href = Vue.config.logoutTo || './index.html'
    }
  }
  this.error = () => {
    const delay = 3200
    if (this.cbData && !this.cbData.loading && this.cbData.error) {
      const ret = true
      // if (error && _.isFunction(error)) {
      //   ret = error.call()
      // }
      if (ret) {
        // 锁定错误提示
        setTimeout(() => {
          $this.loading = false
        }, delay)
        if (!Vue.config.sys_error_show) {
          return
        }
        Vue.config.sys_error_show = false
        const error_code = _.get(this.cbData, 'code', 'SYSTEM_ERROR')
        let error_msg = _.get(this.cbData, 'message', '')
        // if (!_.isString(error_code)) {
        //   error_code = error_code.error
        // }
        error_msg = $this.$t(error_msg) || '服务调用异常，请联系管理员!'
        if (error_code === 'SYSTEM_ERROR') {
          //
          $this.$notify({
            message: error_msg,
            type: 'error',
            customClass: 'custom-error-tip-box',
            duration: delay,
          })
        } else if (error_code <= '100305' && error_code >= '100301') {
          // token 失效跳转
          // 100304-登录过期  100301-用户不存在
          console.log(error_code)
          this.beforeLogout(error_msg)
        } else {
          // 其它code码，直接抛错
          $this.$notify({
            message: _.isString(error_msg) ? error_msg : '系统异常!',
            customClass: 'custom-error-tip-box',
            type: 'error',
            duration: delay,
          })
        }
        setTimeout(() => {
          Vue.config.sys_error_show = true
        }, delay)
      }
    }
    return this
  }

  this.I18n = key => {
    if (!key) return ''
    return _.reduce(
      key.split(' '),
      (n1, n2) => {
        if (/^[A-Za-z\s]+$/.test(n1)) n1 = n1 + ' '
        return n1 + $this.$t(`h.${_.lowerCase(n2)}`)
      },
      '',
    )
  }
}

export default (context, defaultEntity) => new Util(context, defaultEntity)

