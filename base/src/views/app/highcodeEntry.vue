<template>
  <div class="pr-20 position-relative" :class="appName" style="height:100%;">
    <RemoteComponent
      v-if="appName && module && page && initFinished"
      :key="key"
      ref="remoteComponent"
      :module="module"
      :page="page"
      :app-name="appName"
      :remote-path="finalRemotePath"
      v-bind="{ ...$attrs, ...$route.query, ...attrs}"
      @loaded="onloaded"
      v-on="$listeners"
    />
    <el-tooltip v-if="dev" content="刷新">
      <el-button class="reload-btn" type="text" :icon="`el-icon-${loading?'loading':'refresh'}`" @click="reload" />
    </el-tooltip>
    <el-popover
      v-if="allowTest"
      placement="left"
      width="290"
      trigger="click"
    >
      <el-divider>测试页面</el-divider>
      <el-form label-width="50px">
        <el-form-item label="路径">
          <el-input v-model="finalRemotePath" @keypress.native.enter="reload" />
        </el-form-item>
        <el-form-item label="模块">
          <el-input v-model="module" @keypress.native.enter="reload" />
        </el-form-item>
        <el-form-item label="页面">
          <el-select v-model="page" allow-create filterable @focus="getPages">
            <el-option v-for="item in pages" :key="item" :label="item" :value="item" />
          </el-select>
          <el-button type="primary" style="cursor:pointer;" @click="reload">确定</el-button>
          <el-button type="primary" style="cursor:pointer;" @click="reset">还原</el-button>
        </el-form-item>
      </el-form>
      <div slot="reference" class="setting-btn">
        <el-tooltip content="配置">
          <el-button type="text" icon="el-icon-setting" @click="showSettings" />
        </el-tooltip>
      </div>
    </el-popover>
  </div>
</template>
<script>
import RemoteComponent from '@/components/RemoteComponent/index.vue'
import { getModules } from '@/utils/loadRemote'
import store from '@/utils/sessionStore'
import { AppController } from '@controller'
import { debounce, get } from 'lodash'
import base from './base'
export default {
  name: 'high-code-entry',
  components: { RemoteComponent },
  mixins: [base],
  props: {
    url: { // 为 bfp 等应用 按 url 方式调用微前端页面， /app/{appName}/module/{module}/page/{page}
      default: null
    },
    remotePath: {
      default: null
    },
    isTest: {
      default: true
    }
  },
  data() {
    return {
      pages: [],
      initFinished: false,
      real: {},
      loading: false,
      dev: process.env.NODE_ENV === 'development',
      appName: null,
      module: null,
      page: null,
      finalRemotePath: '/',
      key: (new Date().getMilliseconds()),
      routeName: this.$route.name,
      attrs: null,
      currentRoute: null,
    }
  },
  computed: {
    allowTest() {
      return this.isTest && this.currentRoute?.query?.__mode === 'test'
    }
  },
  created() {
    this.currentRoute = this.$route
    if (this.url) {
      this.init()
    } else {
      const interval = setInterval(() => {
        if (this.currentRoute?.meta?.remote) { // vue-router 无法监听 props变化 ，故这里手动监听meta.remote属性
          this.init()
          this.$emit('update:code', this.currentRoute?.meta?.resource?.code)
          clearInterval(interval)
        }
      }, 1)
    }
  },

  methods: {
    getPages: debounce(async function() {
      this.pages = await getModules({ url: this.finalRemotePath + this.module + '/remoteEntry.js' })
    }, 300),
    async init() {
      if (this.allowTest && store.get(this.currentRoute?.name)) {
        const { finalRemotePath, module, page, appName } = store.get(this.currentRoute?.name)
        if (finalRemotePath && module && page && appName) {
          this.finalRemotePath = finalRemotePath
          this.module = module
          this.page = page
          this.appName = appName
          this.initFinished = true
          return
        }
      }

      this.initFinished = false
      const url = this.url || this.currentRoute?.meta?.remote?.url
      this.finalRemotePath = this.remotePath || get(this, 'currentRoute.meta.remote.remotePath', null) || '/'

      if (url) {
        const urls = url.replace('/app/', '').replace('/module/', '^_^').replace('/page/', '^_^').split('^_^')
        if (urls.length === 3) {
          this.appName = urls[0]
          this.module = urls[1]
          if (urls[2].indexOf('?') > -1) { // 包含参数
            const params = urls[2].split('?')
            this.page = params[0]
            const attrs = {}
            params[1].split('&').forEach(att => {
              const values = att.split('=')
              attrs[values[0]] = values[1]
            })
            this.attrs = attrs
          } else {
            this.page = urls[2]
          }
        } else {
          const { appName, module, page } = this.currentRoute.params
          this.appName = appName
          this.module = module
          this.page = page
        }
        if (this.finalRemotePath === '/') { // 获取真实 remotePath 地址
          const app = await this.dispatch(AppController.findAppByIdOrCode, {
            code: this.appName
          })
          if (!app.error) {
            this.finalRemotePath = get(JSON.parse(app.data.microUrl).find(m => m.microMark === this.module), 'microUrl', '/')
          }
        }
        this.initFinished = true
      }
    },
    reload() {
      this.loading = true
      this.$refs['remoteComponent'] && this.$refs['remoteComponent'].reload(true)
      if (this.allowTest) {
        if (this.finalRemotePath && this.module && this.page && this.appName) {
          store.set(this.currentRoute.name, {
            finalRemotePath: this.finalRemotePath,
            page: this.page,
            module: this.module,
            appName: this.appName,
          })
        }
      }
    },
    onloaded() {
      this.loading = false
      this.$emit('loaded', true)
    },
    reset() {
      store.set(this.currentRoute.name, null)
      this.init()
    },
    showSettings() {

    }
  },
  beforeDestroy() {
    // console.log('销毁 组件', this)
  }
}
</script>
<style lang="scss" scoped>
  .reload-btn{
    position:absolute;
    right:10px;
    top:3px;
  }

  .setting-btn{
    position:absolute;
    right:10px;
    top:20px;
  }
</style>
