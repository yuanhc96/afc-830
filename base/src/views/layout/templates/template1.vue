<template>
  <div class="app-layout" :class="currentAppId || 'single-application'">
    <el-row type="flex" class="top">
      <el-col class="logo">
        <!--logo区-->
        <slot name="logo" />
      </el-col>
      <el-col class="select-app-box">
        <!--selectApp区-->
        <slot name="selectApp" />
      </el-col>
      <el-col class="topmenu">
        <!--logo区-->
        <HScroll>
          <slot name="topmenu" />
        </HScroll>
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
import { mapGetters, mapState } from 'vuex'
import HScroll from './HScroll'
export default {
  components: { HScroll },
  computed: {
    ...mapGetters(['sidebar']),
    ...mapState({
      sidebar: state => state.app.sidebar,
      mainCenter: state => state.settings.mainCenter,
    }),
    isCollapse() {
      return !this.sidebar.opened
    },
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
    }
  },
  created() {
    this.currentAppId = getQueryVariable('appId')
    // this.$BaseBus.$on('micro:beforeMount', (data) => {
    //   if (data.type === 'loadComponent') {
    //     const { appCode, moduleCode, _remoteUrl } = data
    //     this.appName = appCode
    //     this.loadComponent = async() => {
    //       const components = await loadRemoteComponent({
    //         url: _remoteUrl || `/${appCode}/remoteEntry.js`,
    //         scope: appCode,
    //         module: [`./${moduleCode}`],
    //       })
    //       return components[0]
    //     }
    //   }
    // })
  },
  beforeDestroy() {
    // this.$BaseBus.$off('micro:beforeMount')
  }
  // methods:{
  //   rollRight(){
  //     this.marginLeft = this.marginLeft - 100
  //     document.getElementById('top-menu').style.marginLeft = this.marginLeft + 'px'
  //   }
  // }
}
</script>

<style lang="scss" scoped>

$leftCollapseWidth: 50px;
$topHeight: 50px;
$logoWidth: 350px;
$topBorderColor: var(--tagBorderColor);
$background: var(--tagBg);
$sidebarBackground: #fff;
$borderColor:#e5e5e5;
.app-layout {
  height: 100vh;
  position:relative;
  &.single-application {
    .topmenu {
      width: calc(100vw - 480px) !important;
    }
  }
  .top {
    position: relative;
    background: $background;
    border-bottom: 1px solid #ddd;
    flex: 1 0 auto;
    .logo {
      height: $topHeight;
      width: auto;
      display: flex;
      align-items: center;
      white-space: nowrap;
    }
    .select-app-box {
      width: auto;
      display: flex;
      align-items: center;
    }
    .topmenu {
      height: $topHeight;
      width: calc(100vw - 380px);
      -ms-width: 100%;
      margin-left: 54px;
      position: relative;
      .more{
        position:absolute;
        right:0px;
        top:0px;
        height:50px;
        background:rgba(255,255,255,.2);
        cursor: pointer;
        width:10px;
        &:hover{
          background:rgba(255,255,255,.4);
        }
      }
      ul{
          width:2000px;//设置足够的宽度
          overflow:hidden;
          white-space:nowrap;
      }
      li{
        list-style:none;
        float:left;//向左排列
        margin-left:15px;
        width:130px;
        }
    }
    .topbar {
      background: $background;
      height: $topHeight;
      flex-grow: inherit;
      width: max-content;
    }
    .right{
        min-width:155px!important;
    }
  }
  .bottom{
      display:flex;
      flex-flow:row;
      position: relative;
      .left {
          transition: all ease .1s;

          border-right:solid 1px #e5e5e5;
          position: relative;
          z-index: 1;
          box-shadow: 0 2px 6px 0 #e8e8e8;
          ::v-deep .el-scrollbar__thumb {
            background-color: #F4F5F7 !important;
            right: -2px;
          }
      }

      .left.collapse{
        width: $leftCollapseWidth;
      }

      .full-right{
         width: calc(100%)
      }
      .right.collapse{
        width: calc(100% - $leftCollapseWidth);
      }
  }

  .sidebar {
    background: $sidebarBackground;
    .el-scrollbar__wrap {
     overflow-x: hidden;
    }
  }
  .main {
    height: calc(100vh - $topHeight - 1px);
  }
}
.main-center{
  padding:0px calc(50vw - 800px);
  background:#eaeaea;
}
</style>