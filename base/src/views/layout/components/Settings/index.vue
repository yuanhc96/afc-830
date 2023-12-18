<template>
  <el-drawer :visible.sync="visible" size="360px" :modal="false" :with-header="false" @close="close">
    <el-divider>自定义设置</el-divider>
    <el-form label-width="80px">
      <el-form-item label="主题色">
        <el-radio-group v-model="theme" class="pm-radio-button">
          <!-- <el-radio-button label="light">白昼</el-radio-button> -->
          <el-radio-button label="dark">暗夜</el-radio-button>
          <el-radio-button label="green">绿茵</el-radio-button>
          <el-radio-button label="blue">海蓝</el-radio-button>
          <!-- <el-radio-button label="red">火焰</el-radio-button> -->
          <el-radio-button label="orange">秋叶</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="多标签">
        <el-radio-group v-model="tagsView" class="pm-radio-button">
          <el-radio-button label="multiple">多标签</el-radio-button>
          <el-radio-button label="single">单页面</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="居中">
        <el-radio-group v-model="mainCenter" class="pm-radio-button">
          <el-radio-button label="center">居中</el-radio-button>
          <el-radio-button label="full">撑满</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="元素间距">
        <el-radio-group v-model="menuSize" class="pm-radio-button">
          <el-radio-button label="big">大</el-radio-button>
          <el-radio-button label="default">中</el-radio-button>
          <el-radio-button label="small">小</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单模式">
        <el-radio-group v-model="menuMode" class="pm-radio-button">
          <el-radio-button label="normal">经典</el-radio-button>
          <el-radio-button label="map">地图</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="全屏">
        <Screenfull />
        <!-- <el-switch v-model="fullscreen" /> -->
      </el-form-item>
      <el-form-item label="字体大小">
        <el-radio-group v-model="fontScale" class="pm-radio-button">
          <el-radio-button label="0.9">小</el-radio-button>
          <el-radio-button label="1">默认</el-radio-button>
          <el-radio-button label="1.1">大</el-radio-button>
          <el-radio-button label="1.2">超大</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="语言">
          <el-radio-group class="pm-radio-button" v-model="lang">
            <el-radio-button v-for="(value,key,index) in langs" :key="key" :class="index!==0?'ml-10':''" :label="key">
              {{ value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item> -->

      <!-- <el-form-item label="进入测试">
        <el-button @click="$BaseBus.$emit('openTest')">打开测试窗口</el-button>
      </el-form-item> -->
    </el-form>
  </el-drawer>
</template>

<script>

import Screenfull from '@/components/Screenfull/index.vue'
import { changeTheme } from '@/plugins/theme.js'
import { BaseVue } from '@lib'
import Cookie from 'js-cookie'
// import Test from './test.vue'
import { resetFontScale } from '@/utils/resetFontScale'

export default {
  inject: ['reload', 'hideApp', 'showApp'],
  components: { Screenfull },
  mixins: [BaseVue],
  props: {
    visible: {
      default: false,
    }
  },
  created() {
    resetFontScale(this.fontScale)
    this.setThemeStore(Cookie.get('theme'))
  },
  data() {
    return {
      fullscreen: false,
      // lang: Cookie.get('language') || 'zh_CN',
      // langs: {
      //   'zh_CN': '中文',
      //   'en': '英文',
      // },
      // theme: Cookie.get('theme') || 'blue',
    }
  },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
        this.$nextTick(() => {
          this.setUserBaseConfig()
        })
      }
    },
    homePage: {
      get() {
        return this.$store.state.settings.homePage
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'homePage',
          value: val
        })
        this.$nextTick(() => {
          this.setUserBaseConfig()
        })
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        Cookie.set('tagsView', val)
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    mainCenter: {
      get() {
        return this.$store.state.settings.mainCenter
      },
      set(val) {
        Cookie.set('mainCenter', val)
        this.$store.dispatch('settings/changeSetting', {
          key: 'mainCenter',
          value: val
        })
      }
    },
    menuSize: {
      get() {
        return this.$store.state.settings.menuSize
      },
      set(val) {
        Cookie.set('menuSize', val)
        this.$store.dispatch('settings/changeSetting', {
          key: 'menuSize',
          value: val
        })
      }
    },
    fontScale: {
      get() {
        return this.$store.state.settings.fontScale
      },
      set(val) {
        resetFontScale(Number(val))
        Cookie.set('fontScale', val)
        this.$store.dispatch('settings/changeSetting', {
          key: 'fontScale',
          value: val
        })
      }
    },
    menuMode: {
      get() {
        return this.$store.state.settings.menuMode
      },
      set(val) {
        Cookie.set('menuMode', val)
        this.$store.dispatch('settings/changeSetting', {
          key: 'menuMode',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
        this.$nextTick(() => {
        })
      }
    },
    theme: {
      get() {
        return this.$store.state.settings.theme || Cookie.get('theme') || 'blue'
      },
      set(val) {
        this.setThemeStore(val)
        changeTheme(val)
      }
    },
  },
  watch: {
    menuSize: {
      immediate: true,
      handler(val) {
        const menuSize = { big: '50px', default: '43px', small: '36px' }
        const leftWidth = { big: '200px', default: '180px', small: '160px' }
        document.documentElement.style.setProperty(`--menuSize`, menuSize[val || 'default'])
        document.documentElement.style.setProperty(`--leftWidth`, leftWidth[val || 'default'])
      }
    },
  },
  beforeDestroy() {
    document.removeEventListener('fullscreenchange', this.fullscreenMethod)
  },
  methods: {
    setThemeStore(val){
      this.$store.dispatch('settings/changeSetting', {
          key: 'theme',
          value: val
        })
    },
    fullscreenMethod() {
      let isFullscreen =
          document.fullscreenElement ||
          document.mozFullScreenElement ||
          document.webkitFullscreenElement ||
          document.fullScreen ||
          document.mozFullScreen ||
          document.webkitIsFullScreen
      isFullscreen = !!isFullscreen
      this.fullscreen = isFullscreen
    },
    fullscreenListener() {
      document.addEventListener('fullscreenchange', this.fullscreenMethod)
    },
    close() {
      this.$emit('update:visible', false)
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
