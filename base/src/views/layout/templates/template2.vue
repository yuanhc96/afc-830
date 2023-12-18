<template>
  <div class="app-layout" :class="currentAppId || 'single-application'">
    <el-row type="flex" class="top">
      <el-col class="topmenu">
        <el-popover
          v-model="showHover"
          width="400"
          transition="none"
          trigger="click"
        >
          <slot name="topmenu" @close="close" />
          <div slot="reference" class="navigation">
            <svg-icon v-if="objectMenu" class="svg-back" icon-class="back" @click="gotoPlatform" />
            <!--            <svg-icon v-else @click.stop="refresh" icon-class="AFC" style="width:110px;height:36px;"/>-->
            <img v-else :src="homePageLogoUrl" style="width:245px;height:36px;">
            <el-divider direction="vertical" />
            <div class="menu-picker">
              <i class="el-icon-s-grid" :style="{color: iconColor}" />
              <div>
                <span class="title">{{ rootRoute?.meta?.title }}</span>
              </div>
            </div>
          </div>
        </el-popover>
      </el-col>
      <el-col class="tagview">
        <template v-if="tagsView === 'multiple'">
          <TagsView />
        </template>
      </el-col>
      <el-col class="search">
        <MenuSearch />
      </el-col>
      <el-col class="topbar right">
        <!--上导航区-->
        <slot name="topbar" />
      </el-col>
    </el-row>
    <div class="bottom" :class="`main-${mainCenter}`">
      <div v-show="showSideBar" class="left sidebar" :class="{collapse:isCollapse}">
        <el-scrollbar class="left-component__scroll">
          <!--左侧菜单区-->
          <slot name="sidebar" />
        </el-scrollbar>
      </div>
      <div class="main" :class="{collapse:isCollapse,'full-right':!showSideBar,'right':showSideBar}">
        <!--页面主显示区-->
        <slot name="main" />
      </div>
    </div>

    <component :is="loadComponent" :app-name="appName" />
  </div>
</template>
<script>
import { getQueryVariable } from '@/utils/tools'
// import { loadRemoteComponent } from '@/utils/loadRemote.js'
import { localStore } from '@/utils/sessionStore'
import { mapGetters, mapState } from 'vuex'
import TagsView from '../components/TagsView.vue'
import HScroll from './HScroll'
import MenuSearch from './menuSearch.vue'
import Vue from 'vue'
export default {
  components: { HScroll, TagsView, MenuSearch },
  computed: {
    ...mapGetters(['sidebar', 'permission_routers']),
    ...mapState({
      sidebar: state => state.app.sidebar,
      mainCenter: state => state.settings.mainCenter,
      tagsView: state => state.settings.tagsView,
    }),
    isCollapse() {
      return !this.sidebar.opened
    },
    iconColor() {
      const color = this.rootRoute?.meta?.iconColor
      if (color) {
        return color.slice(-8, -1).substring(0, 7)
      } else {
        return '#f0a800'
      }
    },
    menus() {
      return this.permission_routers.filter(
        (menu) => menu.isNewWindowOpen || (!menu.hidden && menu.children && menu.children.length > 0)
      )
    },
    rootRoute() {
      const root = this.menus.find(menu => this.$route.path.startsWith(menu.path))
      if (root) {
        return root
      } else {
        return ''
      }
    },
    objectMenu() {
      return localStore.get('isobjectMenu')
    }

  },
  props: {
    showSideBar: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      appName: null,
      loadComponent: null,
      marginLeft: 0,
      currentAppId: '',
      showHover: false,
      tagsViewVisible: false,
      key: '',
      homePageLogoUrl: Vue.config.homePageLogoUrl,
    }
  },
  created() {
    this.$bus.$on('closeHover', () => {
      this.showHover = false
    })
    this.currentAppId = getQueryVariable('appId')
  },
  methods: {
    refresh() {
      window.history.go(0)
    },
    showTagsView() {
      this.tagsViewVisible = !this.tagsViewVisible
    },
    gotoPlatform() {
      const { origin } = location
      // 业务对象返回
      // if (localStore.get('isobjectMenu')) {
        localStore.set('isobjectMenu', false)
        // 拼装路由后，再跳转
        this.setRouter()
        window.location.href = localStore.get('returnPlatformRouter') || origin
        window.location.reload()
      // }
    },
    setRouter() {
      this.$store.dispatch('GetUserInfo').then(res => {
        this.$store.dispatch('GenerateRoutes').then(() => {
          router.addRoutes(this.$store.getters.addRouters)
          this.$store.dispatch('setNeedGetPermission', false)
        })
      })
    }
  }

}
</script>

<style lang="scss" scoped>
@import './template.scss';
</style>
