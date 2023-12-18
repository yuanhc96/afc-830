<template>
  <component :is="template"
    :show-side-bar="showSideBar && showMenu"
  >
    <div slot="logo">
      <Logo />
    </div>
    <div slot="selectApp">
      <SelectApp />
    </div>
    <div slot="topmenu">
      <TopMenu v-if="showMenu" @sendCurrentTopMenu="getcurrentTopMenu" />
    </div>
    <div slot="topbar">
      <TopTools @sendCurrentTopMenu="getcurrentTopMenu" />
    </div>
    <div slot="sidebar">
      <template v-if="showMenu">
        <Sidebar v-if="isClassicMenu" class="sidebar-container" />
        <SidebarV2 v-else class="sidebar-container" />
      </template>
    </div>
    <div slot="main">
      <Navbar v-show="showSideBar && showMenu" />
      <AppMain :show-sidebar="showSideBar && showMenu" :class="['app-main',showSidebar ? ( sidebar.opened?'app-main-open':'app-main-close') :'']" :style="appMainStyle" />
    </div>
  </component>
</template>
<script>
import RightPanel from '@/components/RightPanel'
import { getQueryVariable } from '@/utils/tools'
import { mapState } from 'vuex'
import { AppMain, Logo, Navbar, SelectApp, Settings, Sidebar, SidebarV2, TagsView, TopMenu, TopTools } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import TemplateAppMag from './templates/template-app-mag.vue'
import TemplateApp from './templates/template-app.vue'
import Template2 from './templates/template2.vue'

export default {
  name: 'layout',
  components: {
    Template2,
    TemplateApp,
    TemplateAppMag,
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    SidebarV2,
    TagsView,
    Logo,
    TopTools,
    TopMenu,
    SelectApp
  },
  mixins: [ResizeMixin],
  data() {
    return {
      showSideBar: true,
      appId: null,
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      mainCenter: state => state.settings.mainCenter,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    isFullScreen() {
      return this.$store.state.app.pageModel === 'fullscreen'
    },
    // 是否显示经典菜单还是新式菜单
    isClassicMenu() {
      return this.$store.state.settings.menuMode === 'normal'
    },
    isPortal() {
      return this.$store.state.permission.platform === 'portal'
    },
    isAppStatus() {
      return window.location.href && window.location.href.includes('/app/')
    },
    showMenu() {
      return !this.isPortal || this.isAppStatus
    },
    template(){
      if(this.$route.path.indexOf('/app/app_mag/') > -1){
        return 'TemplateAppMag'
      }else if(this.$route.query.appId){
        return 'TemplateApp'
      }else{
        return 'Template2'
      }
    }
  },
  mounted() {
    this.appId = getQueryVariable('appId') || null
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    getcurrentTopMenu(menu) {
      this.showSideBar = !menu.isFullScreenShow
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
    z-index: 9;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

</style>
