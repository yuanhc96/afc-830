<template>
  <div class="p-20 position-relative" :class="appName">
    <RemoteComponent
      ref="remoteComponent"
      module="formDesigner"
      page="render"
      remote-path="/"
      :resource-type="resourceType"
      :resource-code="resourceCode"
      :before-load="[]"
      :app-name="appName"
      v-bind="{ ...params, ...$attrs, ...$route.query }"
      :source="source"
      @loaded="onloaded"
      v-on="$listeners"
    />
    <el-tooltip content="刷新" v-if="dev">
      <el-button
        class="reload-btn"
        type="text"
        :icon="`el-icon-${loading ? 'loading' : 'refresh'}`"
        @click="reload"
      />
    </el-tooltip>
  </div>
</template>
<script>
import RemoteComponent from '@/components/RemoteComponent/index.vue'
import base from './base'
export default {
  name: 'low-code-entry',
  mixins: [base],
  components: { RemoteComponent },
  props: {
    url: {
      default: ''
    },
    source: {
      default: 'default' // bfp ,default
    },
    appCode: {
      default: ''
    },
    status: {
      default: ''
    }
  },
  data() {
    return {
      loading: false
    }
  },

  computed: {
    appName() {
      return (
        this.appCode ||
        this.params.appName ||
        this.$attrs.appName ||
        this.$attrs['app-name'] ||
        this.$route.path.split('/')[1]
      )
    },
    params() {
      const obj = {}
      try {
        if (this.url) {
          const data = this.url.split('?')
          const prefix = data[0].split('/')
          if(this.source === 'bfp'){ // bfp 只允许 form 资源
            obj.resourceType = 'form'
          } else {
            obj.resourceType = prefix[prefix.length - 1]
          }
          obj.appName = prefix[2]
          data[1].split('&').forEach((item) => {
            const prop = item.split('=')
            obj[prop[0]] = prop[1]
          })
        }
      } catch (e) {
        console.error(`url[${this.url}] 不符合规范，例如 :lowcode/view?resourceCode=form_goods&status=create`)
      }
      if (this.$route.query.pageType === 'view' || this.$route.query.pageType === 'processView') {
        obj.status = 'view'
      } else if(this.status) {
        obj.status = this.status
      }
      return obj
    },
    resourceCode() {
      return this.$attrs.resourceCode || this.params.resourceCode
    },
    resourceType() {
      return this.$attrs.resourceType || this.params.resourceType
    }
  },
  provide() {
    return {
      entry: this
    }
  },

  methods: {
    reload() {
      this.loading = true
      this.$refs['remoteComponent'].reload()
    },
    onloaded() {
      this.loading = false
      this.$emit('loaded', true)
    }
  },
  beforeDestroy(){
    console.log('销毁 组件' ,this)
  }
}
</script>
<style lang="scss" scoped>
.reload-btn {
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
