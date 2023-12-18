import cache from './cache.js'
import _ from 'lodash'
import ajaxUtil from '@/libs/ajaxUtil'
import * as auth from '@/utils/auth.js'
export default async(that, { name, key, action, params, func, method, url, then, error }) => {
  if (key) {
    if (cache[key]) {
      if (cache[key].result) {
        then(that, _.cloneDeep(cache[key].result))
      } else {
        cache[key].queue.push(that)
      }
    } else {
      cache[key] = {
        queue: [that]
      }
      let resp = null
      if (action) {
        if (name) {
          that.$store.dispatch('requestBegin', name)
        }
        resp = await that.dispatch(action, params)
      } else if (func) {
        if (name) {
          that.$store.dispatch('requestBegin', name)
        }
        resp = await func.call(that, params)
      } else if (url) {
        if (name) {
          that.$store.dispatch('requestBegin', name)
        }
        resp = await ajaxUtil
          .headers({
            Authorization: auth.getToken()
          })
          .ajax({
            url: url,
            method: method || 'get'
          })
      } else {
        cache[key].queue = []
        return
      }
      if (!resp.error) {
        cache[key].result = resp
        cache[key].queue.forEach(_that => {
          then(_that, _.cloneDeep(cache[key].result))
        })
        if (name) {
          that.$store.dispatch('requestEnd', name)
        }
      } else {
        if (name) {
          that.$store.dispatch('requestEnd', name)
        }
        if (error) {
          cache[key].queue.forEach(_that => {
            error(_that, resp)
          })
        }
      }
      cache[key].queue = []
    }
  }
}
