<!--华东事业一部UI对tab显示进行升级改造-->
<template>
  <div class="tags-view-container">
    <div v-if="isMultiple">
      <scroll-pane ref="scrollPane" class="tags-view-wrapper">
        <router-link
          v-for="tag in Array.from(visitedViews)"
          v-show="tag.name !== 'portal_public'"
          ref="tag"
          :key="tag.path"
          class="tags-view-item"
          :class="isActive(tag) ? 'active' : ''"
          :to="{path:tag.path,query:getQueryAppId('appId') ? {...tag.query,appId:getQueryAppId('appId')}: {...tag.query}}"
          @contextmenu.prevent.native="openMenu(tag,$event)"
        >
          {{ generateTitle(tag.title) }} <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
        </router-link>
      </scroll-pane>
      <ul v-show="visible" :style="{left:left+'px',top:(top)+'px'}" class="contextmenu">
        <li @click="closeSelectedTag(selectedTag)">{{ $t('tagsView.close') }}</li>
        <li @click="closeOthersTags(selectedTag)">{{ $t('tagsView.closeOthers') }}</li>
        <!-- <li @click="closeRightsTags()">{{ $t('tagsView.closeRights') }}</li> -->
        <li @click="closeAllTags(selectedTag)">{{ $t('tagsView.closeAll') }}</li>
      </ul>
    </div>
   
  </div>
</template>

<script>
import Hamburger from '@/components/Hamburger'
import Icon from '@/components/Icon/icon'
import ScrollPane from '@/components/ScrollPane'
import { generateTitle } from '@/utils/i18n'
import { getQueryVariable } from '@/utils/tools'
import { BaseVue } from '@lib'
import { localStore } from '@util/sessionStore'
import { mapGetters } from 'vuex'

export default {
  components: {
    ScrollPane,
    Hamburger,
    Icon
  },
  mixins: [BaseVue],
  props: {
    isMultiple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'avatar', 'roles', 'pageModel']),
    isAdmin() {
      return ['sysadmin'].some(role => this.$store.getters.roles.some(r1 => r1 === role))
    },
    isFullScreen() {
      return this.pageModel === 'fullscreen'
    },
    hamburgarDisable() {
      return this.$route.name === 'dashboard' && this.currentPlatformName === null
    },
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    single() {
      const arr = Array.from(this.$store.state.tagsView.visitedViews).filter(i => i.path === this.$route.path)
      if (arr.length) {
        const obj = arr[0]
        return {
          ...obj,
          icon: obj.icon === 'org' ? 'fenlei' : obj.icon,
        }
      } else {
        return {}
      }
    },
  },
  watch: {
    $route() {
      this.addViewTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    },
  },
  mounted() {
    if (`#${this.$route.path}` === window.location.hash.split('?')[0]) {
      this.addViewTags()
    }
  },
  methods: {
    getQueryAppId(appid) {
      return getQueryVariable(appid)
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    generateTitle, // generateTitle by vue-i18n
    generateRoute() {
      if (this.$route.name) {
        return this.$route
      }
      return false
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    addViewTags() {
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      this.$store.dispatch('addVisitedViews', route)
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        if (tags) {
          for (const tag of tags) {
            if (tag.to.path === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag.$el)
              break
            }
          }
        }
      })
    },
    clearRouteMemory(view) {
      this.routes = this.$router.getRoutes()
      const removeRoutes = Array.isArray(view) ? view : [view]
      for (let index = 0; index < this.routes.length; index++) {
        const r = this.routes[index]
        removeRoutes.forEach(route => {
          if (r.regex.test(route.path)) {
            console.log('==========r', r)
            if (r && r.instances && r.instances.default) {
              // 清理关闭的路由实例
              console.log('清除 route')
              r.instances.default = undefined
            }
            if (r.parent && r.parent.instances && r.parent.instances.default) {
              // 清理关闭的路由实例
              console.log('清除 route.parent')
              r.parent.instances.default = undefined
            }
          }
        })
      }
    },
    closeSelectedTag(view) {
      this.clearRouteMemory(view)
      this.$store.dispatch('delVisitedViews', view).then(views => {
        if (this.isActive(view)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView.path)
          } else {
            this.goToFirstMenu(view)
          }
        }
      })
    },
    closeRightsTags() {
      if (this.$route.path !== this.selectedTag.path) {
        this.$router.push(this.selectedTag.path)
      }
      this.$store.dispatch('delRightsViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeOthersTags() {
      if (this.$route.path !== this.selectedTag.path) {
        this.$router.push(this.selectedTag.path)
      }
      this.clearRouteMemory(this.$store.state.tagsView.visitedViews.filter(view => view.path !== this.$route.path))
      // const oldView = this.visitedViews.map(view => view.path)
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        // const newView = this.visitedViews.map(view => view.path)
        // console.log('=========', difference(oldView, newView))
        // this.$bus.$emit('clearKeepAlive', difference(oldView, newView))
        this.moveToCurrentTag()
      })
    },
    closeAllTags() {
      // this.$bus.$emit('clearKeepAlive', 'all')
      this.clearRouteMemory(this.$store.state.tagsView.visitedViews)
      this.$store.dispatch('delAllViews').then(() => {
        this.goToFirstMenu()
      })
    },
    // 换成第一个菜单
    goToFirstMenu(view) {
      const appId = this.getQueryAppId('appId')
      const menus = appId ? this.$store.getters.appMenus[appId] : localStore.get('menus')
      const route = menus.length && menus[0].children && menus[0].children[0]
      let url = route.path
      if (route.children && route.children[0]) {
        url = `${url}/${route.children[0].path}`
      }
      const path = menus.length && menus[0].children && menus[0].children.length ? `${menus[0].path}/${url}` : null
      const { hash } = window.location
      if (!view && hash.slice(1) !== path || view && view.path !== path) {
        if (appId) {
          path && this.$router.push({ path: path, query: this.$route.query })
        } else {
          path && this.$router.push(path)
        }
      }
    },
    openMenu(tag, e) {
      this.visible = true
      this.selectedTag = tag
      this.left = e.clientX
      this.top = e.clientY
    },
    closeMenu() {
      this.visible = false
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '@/styles/variables.scss';
  .tags-view-container {
    border-bottom: 1px solid #ebeef5;
    .tags-view-wrapper {
      background: #ffffff;
      height: 40px;
      padding: 4px 0;
      .tags-view-item {
        display: inline-block;
        position: relative;
        height: 32px;
        line-height: 30px;
        border: 1px solid #D3D7E0;
        color: #414754;
        background: #f5f5f5;
        padding: 0 10px 0 12px;
        font-size: 14px;
        margin-right: 4px;
        &:first-of-type {
          margin-left: 15px;
        }
        &.active {
          background-color: var(--tagBg);
          color: var(--mainTextColor);
          border-color: var(--tagBorderColor);
          &::before {
            content: '';
            background: #fff;
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            position: relative;
            top: -1px;
            margin-right: 2px;
          }
        }
      }
    }
    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 100;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }
  .single {
    height: 40px;
    background: #f5f5f5;
    color: $base-color-black;
    line-height: 38px;
    font-size: 15px;
    padding-left: 20px;
    font-weight: 700;
    i {
      color: var(--menuItemActiveText);
      margin-right: 5px;
      font-size: 19px;
      font-weight: 500;
    }
    span {
      // line-height: 40px;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss">
  //reset element css of el-icon-close
  .tags-view-wrapper {
    .tags-view-item {
      .el-icon-close {
        width: 16px;
        height: 16px;
        vertical-align: 1px;
        border-radius: 50%;
        text-align: center;
        transform-origin: 100% 50%;
        &:before {
          transform: scale(0.6);
          display: inline-block;
          vertical-align: -1px;
        }
      }
    }
  }

  .hamburger-container {
    position: relative;
    z-index: 1000;
    // height: 36px;
    line-height: 32px;
    padding: 0px 0px 0 10px;
    background-color: #ffffff;
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
</style>
