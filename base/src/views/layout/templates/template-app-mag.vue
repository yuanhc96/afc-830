<template>
  <div class="app-layout" :class="currentAppId || 'single-application'">
    <el-row type="flex" class="top">
      <el-col class="topmenu">
        <div class="navigation">
          <el-tooltip content="返回"><i @click="goBack" class="el-icon-arrow-left back" /></el-tooltip>
          <span class="ml-10">后台管理</span>
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
      </div>
      <div class="main" :class="{collapse:isCollapse,'full-right':!showSideBar,'right':showSideBar}">
        <!--页面主显示区-->
        <slot name="main" />
      </div>
    </div>
  </div>
</template>
<script>
import { getQueryVariable } from '@/utils/tools'
// import { loadRemoteComponent } from '@/utils/loadRemote.js'
import { localStore } from '@/utils/sessionStore'
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
      lastAppRoute: state => state.permission.lastAppRoute,
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
      appName: null,
      marginLeft: 0,
      currentAppId: '',
      showHover: false,
      tagsViewVisible:false,
      key:'',
    }
  },
  async created() {
    this.$bus.$on('closeHover', () => {
      this.showHover = false
    })
    this.currentAppId = getQueryVariable('appId')
    const resp = await this.dispatch(AppController.findApp,{id: this.currentAppId })
    this.$store.commit('SET_APPINFO', resp.data)
  },
  methods:{
    refresh(){
      window.history.go(0)
    },
    gotoPlatform() {
      const { origin } = location
      // 业务对象返回
      if (localStore.get('isobjectMenu')) {
        localStore.set('isobjectMenu', false)
        // 拼装路由后，再跳转
        this.setRouter()
        window.location.href = localStore.get('returnPlatformRouter') || origin
        window.location.reload()
      }
    },
    goBack(){
      if(this.lastAppRoute){
        
        this.$router.push({
          name:'bfp_my_to_do_list',
          query:this.$route.query,
        })
      }else{

      }
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
.back{
  font-size:30px;
  color:var(--tagBg);
  cursor:pointer;
  &:hover{
    background-color: #e5e5e5;
  }
}
</style>