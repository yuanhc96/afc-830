/**
 * Created by binwang on 18/5/24.
 */
import { hasPermission } from '@/directive/permission'
import { FuncCode } from '@/permission/index.js'
// import * as Controllers from '@controller'
import { Dict } from '@lib'
import store, { localStore } from '@util/sessionStore'
import { get  } from 'lodash'

export default {
  inject: ['reload'],
  computed: {
    // ...VueUtil(this)
    //   .select(ControllersMap)
    //   .state(),

    isFullModel() {
      return false
    },
    platform() {
      return store.get('platform')
    },
    currentSystem() {
      return store.get('system')
    },
    currentTenant() {
      return this.userInfo && this.userInfo.attributes && this.userInfo.attributes['TENANT_ID']
    },
    currentSystemId() {
      return get(store.get('system'), 'id', null)
    },
    userInfo() {
      return this.$store.getters.userInfo || localStore.get('user') || {}
    },
    roles() {
      return this.$store.getters.roles || []
    },
    isAdmin() {
      return this.roles.some(role => role === 'sysadmin')
    },
    isIE() {
      return window.ActiveXObject || 'ActiveXObject' in window
    },
  },
  data() {
    return {
      Dict: Dict,
      FuncCode: FuncCode,
      fullScreenLoading: null,
    }
  },

  methods: {
    // ...VueUtil(this)
    //   .select(map(Controllers, (value, key) => {
    //     return value
    //   }))
    //   .actions(),

    allow(funcCode) {
      return hasPermission(this.$store.getters.permissions.functions, funcCode)
    },
    goto({ name, props, title = null }) {
      this.$emit('goto', {
        _title: title,
        name,
        props: {
          ...props,
        },
      })
    },

    choosePlatform(type, val) {
      store.set(store.get('platform'), null)
      store.set('platform', type)
      if (val) {
        store.set(type, val)
      }
      // 处理 切换平台后 重新拉取权限的逻辑
      this.$router.push({ path: '/' })
      this.$store.dispatch('setNeedGetPermission', true)
      this.$store.dispatch('delAllViews')
      this.reload()

      // 拼接一个参数 使得 router.beforeEach 可以激活
      const query = { platform: type }
      this.$router.push({ path: '/', query: query })
    },

    confirm(message) {
      return this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
    },

    successMessage(message) {
      this.$msg.success(message)
    },
    errorMessage(message) {
      this.$msg.error(message)
    },
    warningMessage(message) {
      this.$msg.warning(message)
    },
    switchScreenLoading(isLoading) {
      if (isLoading && this.fullScreenLoading === null) {
        this.fullScreenLoading = this.$loading({
          lock: true,
          text: '拼命加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.4)'
        })
      } else if (!isLoading && this.fullScreenLoading !== null) {
        this.fullScreenLoading.close()
      }
    }
  },
}
