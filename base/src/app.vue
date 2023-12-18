<template>
  <div id="app" :class="`global-size--${globalSize}`">
    <router-view />
    <!-- <Test /> -->
    <Global />
  </div>
</template>

<script>
import store from '@/utils/sessionStore'
// import Test from '@/views/layout/components/Settings/test.vue'
import Global from './global.vue'
import Cookie from 'js-cookie'
export default {
  name: 'app',
  components: {
    // LoadChildren
    // Test,
    Global,
  },
  provide() {
    return {
      reload: this.reload,
      hideApp: this.hide,
      showApp: this.show
    }
  },
  computed: {
    globalSize() {
      return this.$store.state.settings.menuSize || Cookie.get('menuSize') || 'default'
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  created() {
    document.title = Vue.config.shortTitle
    const platform = store.get('platform')
    if (platform && this.$store._actions.setPlatform) {
      this.$store.dispatch('setPlatform', platform)
    }
    // 获取菜单发送到coframe-ui项目挂载
    // const menuData = store.get('menus')
    // window.top.postMessage({menus: menuData, params: {_type: 'single'}}, '*')
  },
  methods: {
    reload() {
      this.hide()
      this.$nextTick(() => {
        this.show()
      })
    },
    hide() {
      this.isRouterAlive = false
    },
    show() {
      this.isRouterAlive = true
    }
  }
}
</script>
<style lang="scss" scoped>
  .leave-to-class {
    display: none;
  }
</style>
