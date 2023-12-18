<template>
  <div id="top-menu" class="top-menu" data-testId="顶部菜单栏">
    <el-scrollbar class="component__scroll">
      <el-menu text-color="#6f7172" mode="horizontal" :router="true">
        <el-menu-item
          v-for="menu in menus"
          :key="menu.name"
          :index="getIndex(menu)"
          :route="getQuery(menu)"
          @click="nodeClick(menu)"
        >
          <div class="icon-bg" :style="menu?.meta?.iconColor ? `background-image:${menu?.meta?.iconColor}` : ''">
         <pm-icon v-if="menu.meta && menu.meta.icon" :value="menu.meta.icon" />
          </div>
          <div class="title" :class="isActive(menu) ? 'is-active-title' : 'is-normal'">{{ menu.meta.title }}</div>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script>
import Icon from '@/components/Icon/icon'
import { getQueryVariable, replaceValueByUser, toQueryObject } from '@util/tools.js'
import { mapGetters } from 'vuex'

export default {
  components: { Icon },
  computed: {
    ...mapGetters(['permission_routers']),
    menus() {
      return this.permission_routers.filter(
        (menu) => menu.isNewWindowOpen || (!menu.hidden && menu.children && menu.children.length > 0)
      )
    }
  },
  mounted() {
    if (this.menus.length) {
      if (this.isActive(this.menus[0])) this.$emit('sendCurrentTopMenu', this.menus[0])
    } else {
      this.alterMegNoPermission()
    }
  },
  methods: {
    isActive(menu) {
      const index = getQueryVariable('appId') ? 2 : 1
      if (this.$route.path.split('/')[index] === menu.path.split('/')[index]) {
        this.$emit('sendCurrentTopMenu', menu)
      }
      return this.$route.path.split('/')[index] === menu.path.split('/')[index]
    },
    getIndex(menu, parentPath = '') {
      let _path = parentPath + '/' + menu.path
      _path = _path.replace(/\/\//gi, '/')
      if (menu.children && menu.children.length) {
        return this.getIndex(menu.children[0], _path)
      } else {
        return _path
      }
    },
    getQuery(menu) {
      return menu.query ? { path: this.getIndex(menu), query: toQueryObject(menu.query) } : null
    },
    nodeClick(menu) {
      if (menu.isNewWindowOpen) {
        this.newWindowOpen(menu)
      }
      this.openProcess(menu)
      this.$bus.$emit('closeHover')
    },
    openProcess(menu) {
      if (menu.meta.resource) {
        const appCode = menu.meta.resource.appCode
        const content = JSON.parse(menu.meta.resource.content)
        const { openType, processDefName } = content
        if (openType === 'process') {
          const frameworkWin = this.$router.resolve({
            path: '/module/bfp/page/bfp_proc_framework',
            query: {
              processDefName,
              pageType: 'start',
              appName: appCode
            }
          })
          window.open(frameworkWin.href, '_blank')
        }
      }
    },
    newWindowOpen(menu) {
      if (menu.meta.resource) {
        const content = JSON.parse(menu.meta.resource.content)
        const { openType, url, params } = content
        if (openType === 'iframe') {
          let currentUrl = ''
          if (params) {
            if (params.indexOf('${') !== -1) {
              const curParams = replaceValueByUser(params)
              currentUrl = `${url}${curParams}`
            } else {
              currentUrl = `${url}${params}`
            }
          } else {
            currentUrl = url
          }
          window.open(currentUrl)
          this.$router.back(-1)
        }
      }
    },
    alterMegNoPermission() {
      this.$alert('当前你还没有权限，请联系租户管理分配角色和权限', '提示', {
        confirmButtonText: '确定',
        callback: (action) => {}
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
$bgColor: #204171;
$background: transparent;
$hoverBg: #e5e5e5;
$fontColor: $base-color-black;
$fontActiveColor: $base-color-black;

.top-menu {
  padding-left: 0px;
  max-height: calc(100vh - 100px);
}

.el-menu--horizontal {
  background: transparent;
  display: flex;
  flex-wrap: wrap;
}

.el-menu--horizontal>.el-menu-item {
  border: none;
  width: 33%;
  height: 80px;
  text-align:center;
  margin-bottom:10px;
  &.is-active {
    border: none;
    color:rgb(111, 113, 114);
    .icon-bg{
      height: 38px;
      width: 38px;
      
    }
    // .title{
    //   font-weight:700;
    // }
  }
  &:hover{
    background: #f8f8f8;
    .icon-bg{
      transition: all .3 ease;
      transform:scale(1.2);
    }
  }
}

.el-menu--horizontal>.el-menu-item {
  padding: 0px 20px !important;
}

.icon-bg{
  transition: all .3 ease;
  display:inline-block;
  text-align:center;
  background-image: linear-gradient(135deg,#f8c54f,#f0a800);
  border-radius: 8px;
  height: 38px;
  width: 38px;
  i{
    transform: translateY(-13px);
    color: #fff!important;      
  }
}
.title{
  line-height:20px;
  text-align:center;
}
.is-active-title {
  font-weight:700;
}
::v-deep .component__scroll .el-scrollbar__wrap {
  overflow-x: hidden;
  height: calc(100vh - 100px);
}
</style>