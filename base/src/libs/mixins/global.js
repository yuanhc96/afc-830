import { VueUtil } from '@/libs'
const findAppName = (_this) => { // 向上查找 appName 参数， 如有则表示该请求是在某应用的作用域下发起， 需要进入是否添加context 的判断
  if (['high-code-entry', 'low-code-entry', 'remote-entry'].includes(_this.$options.name)) {
    return _this.appName
  } else if (_this.$parent) {
    return findAppName(_this.$parent)
  } else {
    return null
  }
}
export default {
  // inject: ['appName'],
  methods: {
    async dispatch(action, data = {}, fn) {
      if (Array.isArray(data)) {
        data = {
          payload: data,
        }
      }
      const appName = this.$route.params.appName || this.$route.query.appName || this.$attrs.appName || this.appName || findAppName(this)
      if (data && !data.__apiPrefix && appName) { // 将 appName 注入到 __apiPrefix 中
        data.__apiPrefix = `/${appName}`
      }

      if (fn === true) { // cache
        data.__cache__ = true
        const resp = _.get(this, `${action.controller}.${action.method}`)
        if (!resp.loading && _.isEqual(resp.request, data) && Array.isArray(resp.data) && resp.data.length > 0) {
          if (process.env.NODE_ENV === `development`) {
            console.log('read cache :', action, resp)
          }
          return resp
        }
      }
      
      return await VueUtil(this).dispatchAsync(action, data, fn || null)
    },
  },
}
