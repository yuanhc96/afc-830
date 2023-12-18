<template>
  <div class="app-layout" :class="currentAppId || 'single-application'">
    <el-row type="flex" class="top">
      <el-col class="topmenu">
        <div class="navigation">
          <pm-icon v-if="appExtra" :style="`font-size:30px;color:${appExtra.color || 'orange'};`" :value="appExtra.appIcon || 'guanli'" />
          <span class="ml-10">{{ appInfo.name }}</span>
          <!-- <el-divider direction="vertical" ></el-divider>
          <div class="menu-picker">
            <div>
              <span class="title">{{$route?.meta?.title}}</span>
            </div>
          </div> -->
        </div>
      </el-col>   
      <el-col class="tagview">
        <template  v-if="tagsView === 'multiple'">
          <TagsView />
          </template>
      </el-col>
      <el-col class="search">
        <MenuSearch></MenuSearch>
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
        <div v-if="permission_routers.findIndex(r => r.name === 'app_mag') > -1" class="btn-manage" @click="gotoMag"><el-tooltip content="后台管理"><i class="el-icon-setting"></i></el-tooltip> <span class="ml-10">后台管理</span></div>
      </div>
      <div class="main" :class="{collapse:isCollapse,'full-right':!showSideBar,'right':showSideBar}">
        <!--页面主显示区-->
        <slot name="main" />
      </div>
    </div>
  </div>
</template>
<script>
import { localStore } from '@/utils/sessionStore'
import { getQueryVariable } from '@/utils/tools'
import { AppController } from '@controller'
import { mapGetters, mapState } from 'vuex'
import TagsView from '../components/TagsView.vue'
import HScroll from './HScroll'
import MenuSearch from './menuSearch.vue'
export default {
  components: { HScroll, TagsView, MenuSearch },
  computed: {
    ...mapGetters(['sidebar','permission_routers']),
    ...mapState({
      sidebar: state => state.app.sidebar,
      mainCenter: state => state.settings.mainCenter,
      appInfo: state => state.permission.appInfo,
      tagsView: state => state.settings.tagsView,
    }),
    isCollapse() {
      return !this.sidebar.opened
    },
    iconColor(){
      const color = this.rootRoute?.meta?.iconColor
      if(color){
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
    rootRoute(){
      const root = this.menus.find(menu => this.$route.path.startsWith(menu.path))
      if(root){
        return root
      }else{
        return ''
      }
    },
    objectMenu(){
      return localStore.get('isobjectMenu')
    },
    appExtra(){
      if(this.appInfo.extra){
        const obj = JSON.parse(this.appInfo.extra)
        return obj
      } else {
        return {}
      }
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
      currentAppId: '',
      key:'',
    }
  },
  async created() {
    this.currentAppId = getQueryVariable('appId')
    const resp = await this.dispatch(AppController.findApp,{id: this.currentAppId })
    this.$store.commit('SET_APPINFO', resp.data)
  },
  methods:{
    gotoMag(){
      this.$store.commit('SET_LAST_APP_ROUTE', {
        path: this.$route.path,
        query: this.$route.query,
      })
      this.$router.push({
        path:`/app/app_mag/app_info_mag/app_detail?appId=${this.$route.query.appId}`
      })
    }
  }

}
</script>

<style lang="scss" scoped>
@import './template.scss';
.menu-picker{
  cursor:default;
  &:hover{
    background:none;
  }
}
::v-deep .left-component__scroll .el-scrollbar__wrap{
  height: calc(100vh - 86px)!important;
}
.btn-manage{
  border-top: 1px solid #e5e5e5;
  line-height: 40px;
  height: 40px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  padding-right:20px;
  i{
    color: var(--menuText);
  }
  &:hover{
    background: #e5e5e5;
  }
}
.collapse{
  .btn-manage{
    span{
      display: none;
    }
  }
}
</style>