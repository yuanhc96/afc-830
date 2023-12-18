<template>
  <component :is="component" v-if="component" v-bind="$attrs" :cacheable="cacheable" @hook:mounted="hookMounted" v-on="$listeners"/>
  <div v-else class="loading">
    <PmSkeleton  animated/>
    <!-- <i class="el-icon-loading" /> {{ loadingText }}加载中... -->
  </div>
</template>
<script>
import { loadRemoteComponent } from '@/utils/loadRemote.js'
import { localStore } from '@/utils/sessionStore'
import { get } from 'lodash'
import Vue from 'vue'
export default {
  provide() {
    let isProduction =   get(localStore.get('user'),'attributes.loginEnvironment','dev') === 'dev'
    return {
      microPageCacheable: isProduction
    }
  },
  props: {
    page: {

    },
    module: {},
    remotePath: {},
    beforeLoadComponents: {
      default: () => ['./store']
    },
    loadingText: {
      default: ''
    }
  },
  data() {
    return {
      component: null,
      cacheable: false,
    }
  },
  async created() {
    this.init()
  },
  methods: {
    init() {
      this.reload()
    },
    async reload() {
      // 获取生产标识
      let isProduction =  get(localStore.get('user'),'attributes.loginEnvironment','dev') !== 'dev'
      const { page, module } = this
      if (!page || !module) {
        return
      }
      if (!isProduction) {
        this.component = null
      } else {
        this.cacheable = true
      }

      const componentId = `Remote-${module}-${page}`
      // if (process.env.NODE_ENV !== 'development') {
      if (isProduction && Vue.options.components[componentId]) { // 生产环境中 微应用只加载一次
        this.component = componentId
        return
      } else {
        Vue.options.components[componentId] = null
      }
      // }

      const { _remoteUrl } = this.$route.query
      const finalRemotePath = _remoteUrl || this.remotePath
      console.log('finalRemotePath', finalRemotePath)
      if (this.beforeLoadComponents && this.beforeLoadComponents.length > 0) {
        const result = await loadRemoteComponent({
          url: `${finalRemotePath}${module}/remoteEntry.js`,
          scope: module,
          module: this.beforeLoadComponents,
        })
        Promise.all(result).then(re => {
          this.loadMain(componentId, finalRemotePath, module, page)
        }).catch(re => {
          console.log('error', re)
        })
      } else {
        this.loadMain(componentId, finalRemotePath, module, page)
      }
    },
    loadMain(componentId, path, module, page) {
      this.component = async() => {
        const components = await loadRemoteComponent({
          url: `${path}${module}/remoteEntry.js`,
          scope: module,
          module: [`./${page}`],
        })
        return components[0]
      }
      Vue.component(componentId, this.component)
    },
    hookMounted() {
      this.$emit('loaded', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.loading{
  // text-align: center;
  padding: 20px 20px;
}
</style>
