<template>
  <div class="sidebar-container" :class="{'hideSidebar':isCollapse}">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      menu-trigger="click"
      :router="true"
      :collapse-transition="false"
    >
      <!-- <SidebarItem :routes="bfpRoutes" :collapse="isCollapse" /> -->
      <SidebarItem :parent-path="isApp ? null : $route.matched[0].path" :routes="routes" :collapse="isCollapse" />
    </el-menu>
  </div>
</template>

<script>
import { BaseVue } from '@lib'
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem },
  mixins: [BaseVue],
  computed: {
    ...mapGetters(['permission_routers', 'sidebar']),
    isApp(){
      return this.$route.query.appId && this.$route.path.indexOf('/app/app_mag') === -1
    },
    routes() {
      console.log('this.permission_routers', this.permission_routers)
      if(this.isApp){
        const routes = this.permission_routers.filter(route => {
          if(route.name && route.name.startsWith('bfp_')){
            // route.children = null
            route.children.forEach(r => {
              r.showIcon = false
            })
          }
          return  route.query === `appId=${this.$route.query.appId}` && !['app_mag','app_background_manage'].includes(route.name)
        })
        return routes
      } else {
        const route = this.permission_routers.find(route => route.path === this.$route.matched[0].path)
        return route && route.children ? route.children : (route ? [route] : [])
      }
    },
    // bfpRoutes() {
    //   if(this.$route.query.appId && this.$route.path.indexOf('/app/app_mag') === -1) {  //进入的是 app 门户
    //     const bfpRoute = this.permission_routers.filter(route => route.path.indexOf('bfp_') > -1)
    //     bfpRoute.forEach(route => {
    //       route.children = null
    //     })
    //     return bfpRoute
    //   } else {
    //     return []
    //   }
    // },
    isCollapse() {
      return !this.sidebar.opened
    },
    menuDisable() {
      return !(this.$route.name === 'dashboard' && this.platform === null)
    },
    theme() {
      return this.$store.state.settings.theme
    },
   
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.logo {
  height: 70px;
  background: #2f3742;
  font-size: 20px;
  font-weight: bold;
  color: white;
  line-height: 70px;
  text-align: center;
  cursor: pointer;
}
</style>
